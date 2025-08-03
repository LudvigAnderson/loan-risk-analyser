import pandas as pd
import numpy as np
from sksurv.metrics import concordance_index_censored

from pandas import DataFrame
from utils.custom_typing import Predictor

def concordance_index(model: Predictor, X: DataFrame, y: DataFrame) -> float:
    preds = model.predict(X)
    event = y["upper_bound"].ne(np.inf)
    survival_time = y["lower_bound"]

    c_index, _, _, _, _ = concordance_index_censored(event, survival_time, -preds)
    return c_index