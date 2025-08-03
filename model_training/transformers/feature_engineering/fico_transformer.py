from sklearn.base import BaseEstimator, TransformerMixin
from pandas import DataFrame

class FicoTransformer(BaseEstimator, TransformerMixin):
    def __init__(
            self,
            low_col: str = "fico_range_low",
            high_col: str = "fico_range_high"
    ):
        self.low_col = low_col
        self.high_col = high_col

    def fit(self, X, y=None):
        return self
    
    def transform(self, X: DataFrame) -> DataFrame:
        X = X.copy()
        
        X["fico_score"] = (X[self.low_col] + X[self.high_col]) / 2
        X = X.drop(columns=[self.low_col, self.high_col])

        return X