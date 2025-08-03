from sklearn.base import BaseEstimator, TransformerMixin
import pandas as pd
from pandas import DataFrame, Series
from typing import List
from pathlib import Path
from config.paths import DATA_FINAL_DIR

class MonetaryTransformer(BaseEstimator, TransformerMixin):
    def __init__(
            self,
            issue_d_col: str = "issue_d",
            money_cols: List[str] = None
    ):
        self.issue_d_col = issue_d_col
        self.money_cols = money_cols or ["annual_inc", "revol_bal", "avg_cur_bal", "loan_amnt"]

    @property
    def norwegian_inflation_data(self):
        if not hasattr(self, "_norwegian_inflation_data"):
            # Inflation factors for Norway from each month until present time
            self._norwegian_inflation_data = pd.read_csv(DATA_FINAL_DIR / "total_inflation_factors.csv", low_memory=False, delimiter=",").iloc[0]
        return self._norwegian_inflation_data

    @property
    def ppp_data(self):
        if not hasattr(self, "_ppp_data"):
            # PPP factors for Norway for each year from 2007 to 2018
            self._ppp_data = pd.read_csv(DATA_FINAL_DIR / "norway_ppp.csv", low_memory=False).iloc[0]
        return self._ppp_data

    def fit(self, X, y=None):
        return self
    
    def transform(self, X: DataFrame) -> DataFrame:
        X = X.copy()
        ssb_dates = self._datetime_to_ssb_format(X[self.issue_d_col])
        inflation_factors = ssb_dates.map(self.norwegian_inflation_data)
        ppp_factors = self._calculate_ppp_factor(X[self.issue_d_col])

        for col in self.money_cols:
            X[col] = X[col] * inflation_factors * ppp_factors
        
        return X
    
    # Changes the datetime format to the one SSB uses (e.g. "2007M03")
    def _datetime_to_ssb_format(self, datetimes: Series) -> Series:
        year = datetimes.dt.year.astype(str)
        month = datetimes.dt.month.astype(str).str.zfill(2)
        return year + "M" + month
    
    # I calculate PPP as an average between the current and next year,
    # based on which month the loan was issued. For example, a loan issued
    # in December will be weighted 11/12 for the next year
    # and 1/12 for the current year, because December is month 12
    def _calculate_ppp_factor(self, issue_d: Series) -> Series:
        year = issue_d.dt.year
        month = issue_d.dt.month
        ppp_year = year.astype(str).map(self.ppp_data).astype(float)
        ppp_nextyear = (year + 1).astype(str).map(self.ppp_data).astype(float)
        return ppp_year * (13-month)/12 + ppp_nextyear * (month-1)/12

