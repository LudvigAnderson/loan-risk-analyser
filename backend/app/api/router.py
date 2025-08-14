from fastapi import APIRouter, Request, Depends
from app.api.dependencies import verify_api_key
from app.services.model_loader import load_ml_models
from app.models.loan_applicant import LoanApplicant
from app.services.calculations import get_all_calculations
from app.services.pipeline import transform_data

router = APIRouter()

# Reloads the ML models
@router.post("/reload-models", dependencies=[Depends(verify_api_key)])
async def reload_models(request: Request):
    await load_ml_models(request.app)
    return {"detail": "Models reloaded successfully."}

# Gets predictions from both models, as well as the SHAP values for the AFT model
@router.post("/predict")
async def predict(request: Request, data: LoanApplicant):
    results = get_all_calculations(request.app, data)
    return results