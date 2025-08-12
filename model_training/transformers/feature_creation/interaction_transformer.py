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
            ] = None
    ):
        self.features = features or {}

    def fit(self, X: DataFrame, y=None):        
        return self
    
    def transform(self, X: DataFrame) -> DataFrame:
        X = X.copy()

        for feature_name in self.features:
            interaction = self.features[feature_name]
            operation = interaction[2]
            X[feature_name] = operation(X[interaction[0]], X[interaction[1]])

        return X

