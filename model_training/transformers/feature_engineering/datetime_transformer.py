from sklearn.base import BaseEstimator, TransformerMixin
import pandas as pd
from pandas import DataFrame
from typing import List

class DatetimeTransformer(BaseEstimator, TransformerMixin):
    def __init__(self, cols: List[str] = None):
        self.cols = cols or []

    def fit(self, X, y=None):
        return self
    
    def transform(self, X: DataFrame) -> DataFrame:
        X = X.copy()
        for col in self.cols:
            X[col] = pd.to_datetime(X[col], errors="coerce", format="%b-%Y")
        return X