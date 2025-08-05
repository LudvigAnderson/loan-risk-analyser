import xgboost as xgb
import cupy as cp
from sklearn.base import BaseEstimator, RegressorMixin
from typing import Dict, Type

class XGBoostDML(BaseEstimator, RegressorMixin):
    def __init__(
            self,
            params: Dict,
            model: Type[xgb.XGBModel],
    ):
        self.params = params
        self.model = model
    
    def fit(self, X, y):
        self.model_ = self.model(**self.params)
        X_cp = cp.array(X)
        y_cp = cp.array(y)
        self.model_.fit(X_cp, y_cp)
    
    def predict(self, X):
        X_cp = cp.array(X)
        return self.model_.predict(X_cp)