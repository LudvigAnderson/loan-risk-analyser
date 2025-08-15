import xgboost as xgb
from sklearn.base import BaseEstimator, RegressorMixin
from typing import Dict, Literal
from pandas import DataFrame

class XGBoostAFT(BaseEstimator, RegressorMixin):
    def __init__(
            self,
            distribution: Literal["normal", "logistic", "extreme"] = "normal",
            num_boost_round: int = 100,
            max_depth: int = 6,
            learning_rate: float = 0.3,
            gamma: float = 0.0,
            random_state: int = None,
            monotone_constraints: Dict[str, int] = None,
            early_stopping_rounds: int = 20,
            X_val: DataFrame = None,
            y_val: DataFrame = None,
    ):
        self.distribution = distribution
        self.num_boost_round = num_boost_round
        self.max_depth = max_depth
        self.learning_rate = learning_rate
        self.gamma = gamma

        self.early_stopping_rounds = early_stopping_rounds
        self.X_val = X_val
        self.y_val = y_val

        self.random_state = random_state

        self.monotone_constraints = monotone_constraints or {}
        self.model_: xgb.Booster = None
    
    def fit(self, X: DataFrame, y: DataFrame):
        X = X.copy()
        y = y.copy()

        self.xgb_params = {
            "objective": "survival:aft",
            "aft_loss_distribution": self.distribution,
            "aft_loss_distribution_scale": 1.0,
            "device": "cuda",
            "tree_method": "hist",
            "learning_rate": self.learning_rate,
            "max_depth": self.max_depth,
            "gamma": self.gamma,
        }

        if self.random_state is not None:
            self.xgb_params["seed"] = self.random_state

        # Create DMatrix for eval
        if (
            self.X_val is not None
            and self.y_val is not None
            and self.early_stopping_rounds
        ):
            dval = xgb.DMatrix(self.X_val)
            dval.set_float_info("label_lower_bound", self.y_val["lower_bound"])
            dval.set_float_info("label_upper_bound", self.y_val["upper_bound"])
            evals = [(dval, "validation")]
        else:
            evals = None

        # Create DMatrix for training
        dtrain = xgb.DMatrix(X)
        dtrain.set_float_info("label_lower_bound", y["lower_bound"])
        dtrain.set_float_info("label_upper_bound", y["upper_bound"])

        # Set monotone constraints
        if self.monotone_constraints:
            ordered_constraints = tuple(self.monotone_constraints.get(f, 0) for f in X.columns)
            self.xgb_params["monotone_constraints"] = ordered_constraints

        # Train the model, returns xgboost.Booster object
        self.model_ = xgb.train(
            self.xgb_params,
            dtrain,
            num_boost_round=self.num_boost_round,
            evals=evals,
            early_stopping_rounds = self.early_stopping_rounds if evals else None,
            verbose_eval=False
        )

        return self
    
    def predict(self, X: DataFrame):
        X = X.copy()[self.model_.feature_names]
        dtest = xgb.DMatrix(X)
        predictions = self.model_.predict(dtest, output_margin=True)
        return predictions # Outputs the mean of ln(T), exponentiate with base e to get median of T
    
    def get_booster(self) -> xgb.Booster:
        return self.model_
    
    def save_model(self, fname):
        self.model_.save_model(fname)