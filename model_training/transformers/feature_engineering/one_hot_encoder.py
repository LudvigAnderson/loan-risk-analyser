from sklearn.base import BaseEstimator, TransformerMixin
from pandas import DataFrame
import pandas as pd
from typing import List
from collections import OrderedDict

class OneHotEncoder(BaseEstimator, TransformerMixin):
    def __init__(self, cols: List[str] = None, min_freq: float = 0.01):
        self.cols = cols or []
        self.min_freq = min_freq

    def fit(self, X: DataFrame, y=None):
        self.ohe_categories = OrderedDict() # categories to encode
        self.infrequent_categories = OrderedDict() # categories to encode together in an "infrequent" column

        for col in self.cols:
            self.ohe_categories[col] = []
            self.infrequent_categories[col] = []

            frequencies = X[col].value_counts() / X.shape[0]

            for category in frequencies.keys():
                f = frequencies[category]
                if f >= self.min_freq:
                    self.ohe_categories[col].append(category)
                else:
                    self.infrequent_categories[col].append(category)
        
        return self
    
    def transform(self, X: DataFrame) -> DataFrame:
        X = X.copy()
        for col in self.cols:
            if col not in X.columns:
                raise ValueError(f"Column {col} not found in DataFrame.")

            df = pd.DataFrame()
            
            for category in self.ohe_categories[col]:
                df[f"{col}_{category}"] = X[col].eq(category).astype(int)
            
            if self.infrequent_categories[col]:
                df[f"{col}_infrequent"] = X[col].isin(self.infrequent_categories[col]).astype(int)

            if len(df.columns) > 1:
                df = df.drop(columns=[df.columns[0]])

            X = pd.concat([X, df], axis=1).drop(columns=[col])
            

        return X

