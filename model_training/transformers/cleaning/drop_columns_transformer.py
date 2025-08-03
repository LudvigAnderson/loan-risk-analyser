from sklearn.base import BaseEstimator, TransformerMixin
from pandas import DataFrame
from typing import List

class DropColumnsTransformer(BaseEstimator, TransformerMixin):
    def __init__(self, cols: List[str] = None):
        self.cols = cols or []

    def fit(self, X, y=None):
        return self
    
    def transform(self, X: DataFrame) -> DataFrame:
        X = X.copy()
        X = X.drop(columns=self.cols, errors="ignore")
        return X