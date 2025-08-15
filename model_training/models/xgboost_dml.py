import xgboost as xgb
import cupy as cp
from sklearn.base import BaseEstimator, RegressorMixin
from typing import Dict, Type

class XGBoostDML(BaseEstimator, RegressorMixin):
    def __init__(
            self,
            params: Dict,
            model_type: Type[xgb.XGBModel],
            run_local: bool = False
    ):
        self.params = params
        self.model_type = model_type

        self._model: xgb.XGBModel = None

        self.run_local = run_local
    
    def fit(self, X, y):
        self.model_ = self.model_type(**self.params)
        if self.run_local:
            self.model_.fit(X, y)
        else:
            X_cp = cp.array(X)
            y_cp = cp.array(y)
            self.model_.fit(X_cp, y_cp)
    
    def predict(self, X):
        if self.run_local:
            return self.model_.predict(X)
        else:
            X_cp = cp.array(X)
            return self.model_.predict(X_cp)