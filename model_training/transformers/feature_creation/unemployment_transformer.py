from sklearn.base import BaseEstimator, TransformerMixin
import pandas as pd
from pandas import DataFrame
from config.paths import DATA_FINAL_DIR

class UnemploymentTransformer(BaseEstimator, TransformerMixin):
    def __init__(
            self,
            issue_d_col: str = "issue_d",
            issue_year_col: str = "issue_year",
            addr_state_col: str = "addr_state"
    ):
        self.issue_d_col = issue_d_col
        self.issue_year_col = issue_year_col
        self.addr_state_col = addr_state_col

    @property
    def oecd_data(self):
        if not hasattr(self, "_oecd_data"):
            # Includes Norway, monthly
            self._oecd_data = pd.read_csv(
                DATA_FINAL_DIR / "oecd_unemployment_nor_usa.csv",
                low_memory=False,
                delimiter=",",
                usecols=["REF_AREA", "TIME_PERIOD", "OBS_VALUE"],
                dtype={
                    "REF_AREA": "category",
                    "OBS_VALUE": float
                },
                parse_dates=["TIME_PERIOD"],
                date_format="%Y-%m"
            )
        return self._oecd_data
    
    @property
    def bls_data(self):
        if not hasattr(self, "_bls_data"):
            # Includes all American states, yearly
            self._bls_data = pd.read_csv(
                DATA_FINAL_DIR / "us_state_unemployment_rate.csv",
                low_memory=False,
                delimiter=",",
                dtype={
                    "year": int,
                    "state": "category",
                    "unemployment_rate": float
                }
            )
        return self._bls_data

    def fit(self, X, y=None):
        return self
    
    def transform(self, X: DataFrame) -> DataFrame:
        X = X.copy()

        # If American, use state-level unemployment rates
        if X[self.addr_state_col].notna().all():
            data = self.bls_data.copy()

            # save the index of X
            index = X.index
            
            X = X.merge(
                data.rename(columns={
                    "year": self.issue_year_col,
                    "state": self.addr_state_col
                }),
                how="left", # would have been same as inner but no data for DC state
                on=[self.issue_year_col, self.addr_state_col]
            )

            # put the index back in
            X.index = index

            # BLS doesn't give data for DC, so I just use the national-level rate
            oecd_data = self.oecd_data[self.oecd_data["REF_AREA"] == "USA"].copy()
            unemployment_map = oecd_data.groupby("TIME_PERIOD")["OBS_VALUE"].first()
            national_level_rate = X[self.issue_d_col].map(unemployment_map) / 100
            X["unemployment_rate"] = X["unemployment_rate"].fillna(national_level_rate)

        
        # If Norwegian, use national-level unemployment rates
        else:
            oecd_data = self.oecd_data[self.oecd_data["REF_AREA"] == "NOR"].copy()
            unemployment_map = oecd_data.groupby("TIME_PERIOD")["OBS_VALUE"].first()
            X["unemployment_rate"] = X[self.issue_d_col].map(unemployment_map) / 100
        
        return X