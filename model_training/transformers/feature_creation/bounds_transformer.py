from sklearn.base import BaseEstimator, TransformerMixin
from pandas import DataFrame
import numpy as np

class BoundsTransformer(BaseEstimator, TransformerMixin):
    def __init__(
            self,
            issue_col: str = "issue_d",
            last_payment_col: str = "last_pymnt_d",
            status_col: str = "loan_status",
    ):
        self.issue_col = issue_col
        self.last_payment_col = last_payment_col

        self.status_col = status_col
        self.event_mapping = {
            "Charged Off": 1,
            "Does not meet the credit policy. Status:Charged Off": 1,
            "Default": 1,
            "Fully Paid": np.inf,
            "Current": np.inf,
            "Late (31-120 days)": np.inf,
            "In Grace Period": np.inf,
            "Late (16-30 days)": np.inf,
            "Does not meet the credit policy. Status:Fully Paid": np.inf
        }

    def fit(self, X, y=None):
        return self
    
    def transform(self, X: DataFrame) -> DataFrame:
        X = X.copy()
        X["lower_bound"] = (
            (X[self.last_payment_col].dt.year - X[self.issue_col].dt.year) * 12
            + (X[self.last_payment_col].dt.month - X[self.issue_col].dt.month)
            + 1 # defaults happen the month after last payment
        )
        X["upper_bound"] = (
            X[self.status_col].map(self.event_mapping).fillna(np.inf)
            * X["lower_bound"]
        )
        X = X.dropna(subset=["upper_bound"])

        return X