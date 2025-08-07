from fastapi import FastAPI
from xgboost import Booster, DMatrix
from shap import TreeExplainer
from pandas import DataFrame

from typing import Dict, Tuple, Any


def _reorder_df(model: Booster, df: DataFrame) -> DataFrame:
    feature_names = model.feature_names
    return df[feature_names]

def predict(model: Booster, data: DataFrame) -> float:
    reordered_data = _reorder_df(model, data)
    dmatrix = DMatrix(reordered_data)
    return float(model.predict(dmatrix)[0])

def get_shap_values(model: Booster, explainer: TreeExplainer, data: DataFrame) -> Tuple[list, float]:
    reordered_data = _reorder_df(model, data)
    explanation = explainer(reordered_data)
    shap_values = explanation.values[0].tolist()
    base_value = float(explanation.base_values[0])

    shap_values = dict(zip(model.feature_names, shap_values))

    return shap_values, base_value


def get_all_calculations(app: FastAPI, data: DataFrame) -> Dict[str, Any]:
    aft_model: Booster = app.state.aft_model
    causal_model: Booster = app.state.causal_model
    explainer: TreeExplainer = app.state.aft_shap_explainer

    median_survival_time = predict(aft_model, data)
    causal_effect = predict(causal_model, data)
    shap_values, base_value = get_shap_values(aft_model, explainer, data)

    return {
        "median_survival_time": median_survival_time,
        "causal_effect": causal_effect,
        "shap_values": shap_values,
        "base_value": base_value
    }