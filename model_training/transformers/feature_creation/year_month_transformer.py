from sklearn.base import BaseEstimator, TransformerMixin
from pandas import DataFrame
import numpy as np

class YearMonthTransformer(BaseEstimator, TransformerMixin):
    def __init__(self, issue_d_col: str = "issue_d"):
        self.issue_d_col = issue_d_col

    def fit(self, X, y=None):
        return self
    
    def transform(self, X: DataFrame) -> DataFrame:
        X = X.copy()
        X["issue_year"] = X[self.issue_d_col].dt.year
        issue_month = X[self.issue_d_col].dt.month - 1
        X["month_sin"] = np.sin(2 * np.pi * issue_month / 12)
        X["month_cos"] = np.cos(2 * np.pi * issue_month / 12)
        return X