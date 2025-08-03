from sklearn.base import BaseEstimator, TransformerMixin
from pandas import DataFrame
from typing import Dict, Tuple

class InteractionTransformer(BaseEstimator, TransformerMixin):
    def __init__(
            self,
            multiplications: Dict[str, Tuple[str, str]] = None,
            divisions: Dict[str, Tuple[str, str]] = None
    ):
        self.multiplications = multiplications or []
        self.divisions = divisions or []

    def fit(self, X: DataFrame, y=None):        
        return self
    
    def transform(self, X: DataFrame) -> DataFrame:
        X = X.copy()

        for feature_name in self.multiplications:
            features = self.multiplications[feature_name]
            X[feature_name] = X[features[0]] * X[features[1]]

        for feature_name in self.divisions:
            features = self.divisions[feature_name]
            X[feature_name] = X[features[0]] / (X[features[1]] + 1)

        return X

