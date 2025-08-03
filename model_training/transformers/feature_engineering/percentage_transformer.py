from sklearn.base import BaseEstimator, TransformerMixin
from pandas import DataFrame
from typing import List

class PercentageTransformer(BaseEstimator, TransformerMixin):
    def __init__(self, cols: List[str] = None):
        self.cols = cols or []

    def fit(self, X: DataFrame, y=None):        
        return self
    
    def transform(self, X: DataFrame) -> DataFrame:
        X = X.copy()
        for col in self.cols:
            if col not in X.columns:
                raise ValueError(f"Column {col} not found in DataFrame.")

            X[col] = X[col] / 100

        return X

