from sklearn.base import BaseEstimator, TransformerMixin
from pandas import DataFrame
from typing import List
import pandas as pd

class ZeroImputer(BaseEstimator, TransformerMixin):
    def __init__(
            self,
            cols: List[str] = None,
            impute_all: bool = False,
            add_flag: bool = True,
            random_state: int = 123,
    ):
        self.cols = cols or []
        self.impute_value = 0
        self.impute_all = impute_all
        self.add_flag = add_flag
        self.random_state = random_state

    def fit(self, X: DataFrame, y=None):        
        return self
    
    def transform(self, X: DataFrame) -> DataFrame:
        X = X.copy()
        
        flags_to_add = {}

        if self.impute_all:
            # Impute all columns with missing values
            for col in X.columns:
                if X[col].isna().any():
                    if self.add_flag:
                        flags_to_add[f"{col}_was_NA"] = X[col].isna().astype(int)
                    X[col] = X[col].fillna(self.impute_value)
        else:
            # Impute only specified columns
            for col in self.cols:
                if col not in X.columns:
                    raise ValueError(f"Column {col} not found in DataFrame.")
                if self.add_flag:
                    flags_to_add[f"{col}_was_NA"] = X[col].isna().astype(int)
                X[col] = X[col].fillna(self.impute_value)            

        if self.add_flag:
            flags_df = pd.DataFrame(flags_to_add)

            # remove equal columns to control for multicollinearity
            if flags_df.shape[0] >= 1000:
                # first sample because transposing with 2e6 rows is crazy
                sample = flags_df.sample(n=1000, random_state=self.random_state)

                # drop duplicates and get the indices
                cols = sample.T.drop_duplicates().index

                flags_df = flags_df[cols]

            X = pd.concat([X, flags_df], axis=1)
        
        return X

