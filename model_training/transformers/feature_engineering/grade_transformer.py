from sklearn.base import BaseEstimator, TransformerMixin
from pandas import DataFrame

class GradeTransformer(BaseEstimator, TransformerMixin):
    def __init__(self, sub_grade_col: str = "sub_grade"):
        self.sub_grade_col = sub_grade_col

    def fit(self, X, y=None):
        return self
    
    def transform(self, X: DataFrame) -> DataFrame:
        X = X.copy()

        grades = X[self.sub_grade_col].str.strip()

        letter_map = {
            "A": 0,
            "B": 1,
            "C": 2,
            "D": 3,
            "E": 4,
            "F": 5,
            "G": 6,
        }
        number_map = {
            "1": 0,
            "2": 1,
            "3": 2,
            "4": 3,
            "5": 4,
        }
        
        X["lending_club_grade"] = (
            grades.str[0].map(letter_map) * len(number_map)
            + grades.str[1].map(number_map)
        )
        return X