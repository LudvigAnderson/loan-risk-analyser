import pandas as pd
import numpy as np
from datetime import date
from app.models.loan_applicant import LoanApplicant
from fastapi import FastAPI
from xgboost import Booster

from pandas import DataFrame

def transform_data(data: LoanApplicant, app: FastAPI) -> DataFrame:
    df = pd.DataFrame([data.model_dump()])
    df = df.replace({None: np.nan})



    df["bc_util"] = df["bc_bal"] / df["total_bc_limit"]
    df["revol_util"] = df["bc_util"]
    df["dti"] = df["monthly_installments"] / (df["annual_inc"] / 12)
    df["bc_open_to_buy"] = df["total_bc_limit"] - df["bc_bal"]

    init_il = df["init_mortgage"] + df["init_student_loan"] + df["init_car_loan"] + df["init_consumer_loan"]
    cur_il = df["mortgage"] + df["student_loan"] + df["car_loan"] + df["consumer_loan"]
    df["il_util"] = cur_il / init_il

    df["tot_cur_bal"] =  df["bc_bal"] + cur_il
    df["total_bal_ex_mort"] = df["tot_cur_bal"] - df["mortgage"]

    # need to change this in the transformer
    df["loan/inc"] = df["loan_amnt"] / df["annual_inc"]
    df["emp_length/term"] = df["emp_length"] / df["term"]
    df["acc_satisfied_rate"] = df["num_sats"] / df["total_acc"] # Need to fix this
    df["loan/term"] = df["loan_amnt"] / df["term"]
    df["total_bal/inc"] = df["tot_cur_bal"] / df["annual_inc"]

    df["pct_tl_nvr_dlq"] = np.divide(df["num_sats"], df["total_acc"])

    # In a real production environment, I would consider setting
    # this value based on an API call to Statistics Norway, so that
    # it can update for every month. However, for this portfolio
    # project, I consider it adequate to use the last month's rate.
    df["unemployment_rate"] = 0.46

    df["date"] = pd.to_datetime(date.today())

    angle = 2 * np.pi * (df["date"].dt.month - 1) / 12
    df["month_sin"] = np.sin(angle)
    df["month_cos"] = np.cos(angle)

    # Drop values that are not in the feature set
    model: Booster = app.state.aft_model
    df = df[model.feature_names]
    return df


