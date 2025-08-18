import pandas as pd
import numpy as np
from datetime import date
from app.models.loan_applicant import LoanApplicant
from fastapi import FastAPI
from xgboost import Booster

from pandas import DataFrame

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



def transform_data(data: LoanApplicant, app: FastAPI) -> DataFrame:
    df = pd.DataFrame([data.model_dump()])
    df = df.replace({None: np.nan})

    df["bc_util"] = divide(df["bc_bal"], df["total_bc_limit"])
    df["dti"] = divide(df["monthly_installments"], (df["annual_inc"] / 12))

    init_il = df["init_mortgage"] + df["init_student_loan"] + df["init_car_loan"] + df["init_consumer_loan"]
    cur_il = df["mortgage"] + df["student_loan"] + df["car_loan"] + df["consumer_loan"]
    df["il_util"] = divide(cur_il, init_il)

    df["tot_cur_bal"] =  df["bc_bal"] + cur_il
    df["total_bal_ex_mort"] = df["tot_cur_bal"] - df["mortgage"]

    df["percent_bc_gt_75"] = df["percent_bc_gt_75"] / 100

    df["monthly_principal"] = divide(df["loan_amnt"], df["term"])
    df["principal/inc"] = dividep1(df["monthly_principal"], df["annual_inc"])
    df["total_bal/inc"] = dividep1(df["tot_cur_bal"], df["annual_inc"])
    df["acc_satisfied_rate"] = divide(df["num_sats"], df["total_acc"])

    # In a real production environment, I would consider setting
    # this value based on an API call to Statistics Norway, so that
    # it can update for every month. However, for this portfolio
    # project, I consider it adequate to use the last month's rate.
    df["unemployment_rate"] = 0.046

    df["date"] = pd.to_datetime(date.today())

    angle = 2 * np.pi * (df["date"].dt.month - 1) / 12
    df["month_sin"] = np.sin(angle)
    df["month_cos"] = np.cos(angle)

    # Drop values that are not in the feature set
    model: Booster = app.state.aft_model
    df = df[model.feature_names]
    return df


