from sklearn.base import BaseEstimator, TransformerMixin
from pandas import DataFrame, Series
from typing import Dict, Tuple, Callable

class InteractionTransformer(BaseEstimator, TransformerMixin):
    def __init__(
            self,
            features: Dict[ # Example: { "loan/inc": ("loan_amnt", "annual_inc", numpy.divide) }
                str,
                Tuple[
                    str,
                    str,
                    Callable[[Series, Series], Series]
                ]
            ] = None,
            divisions: Dict[str, Tuple[str, str]] = None
    ):
        self.features = features or {}
        self.divisions = divisions or []

    def fit(self, X: DataFrame, y=None):        
        return self
    
    def transform(self, X: DataFrame) -> DataFrame:
        X = X.copy()

        for feature_name in self.features:
            interaction = self.features[feature_name]
            operation = interaction[2]
            X[feature_name] = operation(X[interaction[0]], X[interaction[1]])

        for feature_name in self.divisions:
            features = self.divisions[feature_name]
            X[feature_name] = X[features[0]] / (X[features[1]] + 1)

        return X

