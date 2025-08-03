from sklearn.base import BaseEstimator, TransformerMixin
from pandas import DataFrame

class CreditHistoryTransformer(BaseEstimator, TransformerMixin):
    def __init__(self, earliest_credit_col: str = "earliest_cr_line", issue_d_col: str = "issue_d"):
        self.earliest_credit_col = earliest_credit_col
        self.issue_d_col = issue_d_col

    def fit(self, X, y=None):
        return self
    
    def transform(self, X: DataFrame) -> DataFrame:
        X = X.copy()
        X["credit_history_months"] = (
            (X[self.issue_d_col].dt.year - X[self.earliest_credit_col].dt.year) * 12
            + (X[self.issue_d_col].dt.month - X[self.earliest_credit_col].dt.month)
        )
        return X