from sklearn.base import BaseEstimator, TransformerMixin
from pandas import DataFrame

class TermTransformer(BaseEstimator, TransformerMixin):
    def __init__(self, term_col: str = "term"):
        self.term_col = term_col
        self.term_mapping = {
            " 36 months" : 36,
            " 60 months" : 60
        }

    def fit(self, X, y=None):
        return self
    
    def transform(self, X: DataFrame) -> DataFrame:
        X = X.copy()
        
        # I think this is faster and simpler than using regex
        X["term"] = X[self.term_col].map(self.term_mapping).astype(int)
        return X