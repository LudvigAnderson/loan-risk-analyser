from sklearn.base import BaseEstimator, TransformerMixin
from pandas import DataFrame

class EmpLengthTransformer(BaseEstimator, TransformerMixin):
    def __init__(self, emp_length_col: str = "emp_length"):
        self.emp_length_col = emp_length_col

    def fit(self, X, y=None):
        return self
    
    def transform(self, X: DataFrame) -> DataFrame:
        X = X.copy()
        
        X[self.emp_length_col] = (
            X[self.emp_length_col]
            .fillna("0")
            .str.replace("< 1", "0", regex=False)
            .str.extract(r"(-?\d+)").astype(int)
        )
        return X