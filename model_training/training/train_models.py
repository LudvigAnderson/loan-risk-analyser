import pandas as pd
from datetime import datetime

import optuna
from xgboost import XGBRegressor, XGBClassifier
from econml.dml import LinearDML

from models import XGBoostAFT
from utils.settings_loader import load_training_settings, load_gcloud_paths
from utils.metrics import concordance_index
from utils.google_storage import upload_to_gcs
from pipelines import create_aft_pipeline, create_dml_pipeline
from data.scripts.loading import get_lending_club_data
from config.paths import SAVED_MODELS_DIR, DATA_FINAL_DIR
from config.feature_names import PREDICTION_FEATURES

from pandas import DataFrame
from optuna import Trial, Study
from typing import Dict, Tuple

import logging
logger = logging.getLogger(__name__)


def _split_data(df: DataFrame, data_splits: Dict) -> Dict:
    y_cols = ["lower_bound", "upper_bound"]
    
    final_data = {}
    for split in data_splits:
        mask = df["issue_d"].between(
            pd.Timestamp(data_splits[split]["start"]),
            pd.Timestamp(data_splits[split]["end"]),
            inclusive="both"
        )
        Xy = df[mask].drop(columns=["issue_d"])
        final_data[split] = {
            "X": Xy.drop(columns=y_cols),
            "y": Xy[y_cols]
        }
    
    return final_data

def _run_trials(data: Dict, constraints: Dict, n_trials: int = 5) -> Tuple[XGBoostAFT, Study]:
    X_optuna = data["optuna_val"]["X"]
    y_optuna = data["optuna_val"]["y"]

    best_c_index = 0
    best_model = None
    
    def objective(trial: Trial):
        nonlocal best_c_index, best_model

        model = XGBoostAFT(
            learning_rate=trial.suggest_float("learning_rate", 0.01, 0.3, log=True),
            gamma=trial.suggest_float("gamma", 1e-3, 10.0),
            min_child_weight=trial.suggest_float("min_child_weight", 1, 10.0),
            max_depth=trial.suggest_int("max_depth", 6, 12),
            num_boost_round=trial.suggest_int("num_boost_round", 100, 1000),

            X_val=data["xgboost_val"]["X"],
            y_val=data["xgboost_val"]["y"],
            monotone_constraints=constraints,
        )

        model.fit(data["train"]["X"], data["train"]["y"])

        c_index = concordance_index(model, X_optuna, y_optuna)

        if c_index > best_c_index:
            best_c_index = c_index
            best_model = model

        return c_index
    
    logger.info("Optuna trials begun.")

    study = optuna.create_study(direction="maximize")
    study.optimize(objective, n_trials=n_trials)

    logger.info(f"Optuna finished running {n_trials} trials.")
    return best_model, study

def train_aft_model():  
    settings = load_training_settings()
    cloud_paths = load_gcloud_paths()

    # Date ranges for training, testing, validation (for XGBoost eval and Optuna)
    data_splits = settings["data_splits"]

    # Monotonic constraints for the AFT-XGBoost model
    monotone_constraints = settings["monotone_constraints"]

    # Get the data from Google Cloud Storage
    df = get_lending_club_data(usecols=PREDICTION_FEATURES)

    # Transform the data
    pipeline = create_aft_pipeline()
    transformed_df = pipeline.fit_transform(df)

    # Split the data into X and y for training, testing, validation
    data = _split_data(transformed_df, data_splits)

    # Use Optuna for hyperparameter optimization
    best_model, study = _run_trials(data, monotone_constraints, n_trials=5)

    X_test = data["test"]["X"]
    y_test = data["test"]["y"]

    c_index = concordance_index(best_model, X_test, y_test)

    # Save the model locally
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    model_path = SAVED_MODELS_DIR / f"aft_model_{timestamp}.ubj"
    best_model.save_model(model_path)
    logger.info(f"Best model saved locally to {model_path}.")

    # Upload the model to Google Cloud Storage
    upload_to_gcs(
        local_path=model_path,
        bucket_name=cloud_paths["gcs_bucket"],
        blob_name=cloud_paths["blobs"]["aft_model"]
    )


def train_causal_model():
    settings = load_training_settings()
    nuissance_params = settings["nuissance_params"]
    cloud_paths = load_gcloud_paths()

    # Get the data from Google Cloud Storage
    complete_df = get_lending_club_data()

    # Transform the data
    dml_pipeline = create_dml_pipeline()
    transformed_df = dml_pipeline.fit_transform(complete_df)

    # Split the data into X, y and t
    y_cols = ["default"]
    t_cols = ["int_rate"]

    y = transformed_df[y_cols]
    t = transformed_df[t_cols]
    X = transformed_df.drop(columns=y_cols + t_cols)

    # Create nuissance models for y and t
    interest_rate_model = XGBRegressor(**nuissance_params)
    default_rate_model = XGBClassifier(**nuissance_params)

    est = LinearDML(
        model_y=default_rate_model,
        model_t=interest_rate_model,
        discrete_outcome=True
    )

    est.fit(
        Y=y.values.ravel(),
        T=t.values.ravel(),
        X=X.values
    )
    causal_effect_estimates = est.const_marginal_ate(X).squeeze()

    # Choose only the features that will be available in production
    df = complete_df[PREDICTION_FEATURES]

    pipeline = create_aft_pipeline(drop_issue_d=True)

    # We are not fitting AFT this time, so no need for the bounds
    transformed_df = pipeline.fit_transform(df).drop(columns=["lower_bound", "upper_bound"])
    
    causal_col = ["predicted_causal_effect"]
    
    transformed_df[causal_col[0]] = causal_effect_estimates

    causal_X = transformed_df.drop(columns=causal_col)
    causal_y = transformed_df[causal_col]

    causal_model = XGBRegressor(
        **nuissance_params # Should probably change this
    )

    causal_model.fit(causal_X, causal_y)

    # Save the model locally
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    model_path = SAVED_MODELS_DIR / f"causal_model_{timestamp}.ubj"
    causal_model.save_model(model_path)

    logger.info(f"Causal model saved locally to {model_path}.")

    # Upload the model to Google Cloud Storage
    upload_to_gcs(
        local_path=model_path,
        bucket_name=cloud_paths["gcs_bucket"],
        blob_name=cloud_paths["blobs"]["causal_model"]
    )

    

if __name__ == "__main__":
    train_aft_model()
    train_causal_model()