from sklearn.base import BaseEstimator, TransformerMixin
from pandas import DataFrame

class DefaultTransformer(BaseEstimator, TransformerMixin):
    def __init__(
            self,
            status_col: str = "loan_status",
    ):
        self.status_col = status_col
        self.event_mapping = {
            "Charged Off": 1,
            "Does not meet the credit policy. Status:Charged Off": 1,
            "Default": 1,
            "Fully Paid": 0,
            "Current": 0,
            "Late (31-120 days)": 0,
            "In Grace Period": 0,
            "Late (16-30 days)": 0,
            "Does not meet the credit policy. Status:Fully Paid": 0
        }

    def fit(self, X, y=None):
        return self
    
    def transform(self, X: DataFrame) -> DataFrame:
        X = X.copy()
        X["default"] = X[self.status_col].map(self.event_mapping).fillna(0)

        return X