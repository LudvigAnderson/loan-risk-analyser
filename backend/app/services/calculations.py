from fastapi import FastAPI
from app.services.pipeline import transform_data

from xgboost import Booster, DMatrix
from shap import TreeExplainer
from pandas import DataFrame
from typing import Dict, Tuple, Any
from models.loan_applicant import LoanApplicant


def _reorder_df(model: Booster, df: DataFrame) -> DataFrame:
    feature_names = model.feature_names
    return df[feature_names]

def predict(model: Booster, df: DataFrame, output_margin: bool = False) -> float:
    reordered_df = _reorder_df(model, df)
    dmatrix = DMatrix(reordered_df)
    return float(model.predict(dmatrix, output_margin=output_margin)[0])

def get_shap_values(model: Booster, explainer: TreeExplainer, df: DataFrame) -> Tuple[list, float]:
    reordered_df = _reorder_df(model, df)
    explanation = explainer(reordered_df)
    shap_values = explanation.values[0].tolist()
    base_value = float(explanation.base_values[0])

    shap_values = dict(zip(model.feature_names, shap_values))

    return shap_values, base_value


def get_all_calculations(app: FastAPI, data: LoanApplicant) -> Dict[str, Any]:
    aft_model: Booster = app.state.aft_model
    causal_model: Booster = app.state.causal_model
    explainer: TreeExplainer = app.state.aft_shap_explainer

    df = transform_data(data, app)

    median_survival_time = predict(aft_model, df)
    causal_effect = predict(causal_model, df)
    shap_values, base_value = get_shap_values(aft_model, explainer, df)

    return {
        "median_survival_time": median_survival_time,
        "causal_effect": causal_effect,
        "shap_values": shap_values,
        "base_value": base_value,
        "raw_data": data.model_dump(),
        "transformed_data": df.to_dict(orient="records")
    }