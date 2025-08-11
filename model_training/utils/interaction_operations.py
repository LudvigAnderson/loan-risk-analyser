import numpy as np
import pandas as pd

from pandas import Series

def divide(s1: Series, s2: Series) -> Series:
    s2_nonzero = s2 != 0

    a = s1.to_numpy(dtype=float, copy=False)
    b = s2.to_numpy(dtype=float, copy=False)

    out = np.full_like(a, np.nan)
    np.divide(a, b, out=out, where=s2_nonzero)

    return pd.Series(out, index=s1.index)

def dividep1(s1: Series, s2: Series) -> Series:
    return divide(s1, s2 + 1)

