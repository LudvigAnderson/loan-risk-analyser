from fastapi import FastAPI
import numpy as np
from app.services.pipeline import transform_data

from xgboost import Booster, DMatrix
from pandas import DataFrame
from typing import Dict, Tuple, Any
from app.models.loan_applicant import LoanApplicant


def _reorder_df(model: Booster, df: DataFrame) -> DataFrame:
    feature_names = model.feature_names
    return df[feature_names]

def predict(model: Booster, df: DataFrame, output_margin: bool = False) -> float:
    reordered_df = _reorder_df(model, df)
    dmatrix = DMatrix(reordered_df)
    return float(model.predict(dmatrix, output_margin=output_margin)[0])

def get_shap_values(model: Booster, df: DataFrame) -> Tuple[list, float]:
    reordered_df = _reorder_df(model, df)
    dmatrix = DMatrix(reordered_df)
    shap_matrix = model.predict(dmatrix, pred_contribs=True, validate_features=True)
    shap_values = shap_matrix[0][:-1]
    base_value = float(shap_matrix[0][-1])

    shap_values = {feature: float(shap) for feature, shap in zip(model.feature_names, shap_values)}

    return shap_values, base_value


def get_all_calculations(app: FastAPI, data: LoanApplicant) -> Dict[str, Any]:
    aft_model: Booster = app.state.aft_model
    causal_model: Booster = app.state.causal_model

    df = transform_data(data, app)

    median_survival_time = predict(aft_model, df)
    causal_effect = predict(causal_model, df)
    shap_values, base_value = get_shap_values(aft_model, df)

    return {
        "median_survival_time": median_survival_time,
        "causal_effect": causal_effect,
        "shap_values": shap_values,
        "base_value": base_value,
        "raw_data": data.model_dump(),
        "transformed_data": df.replace({np.nan: None}).to_dict(orient="records")[0]
    }