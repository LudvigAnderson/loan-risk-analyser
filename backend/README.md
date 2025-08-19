# Backend

## Overview

Standard tools:
![Python](https://img.shields.io/badge/Python-white?logo=python)
![NumPy](https://img.shields.io/badge/NumPy-white?logo=numpy&logoColor=013243)
![pandas](https://img.shields.io/badge/pandas-white?logo=pandas&logoColor=150458)

Specialized tools:
![FastAPI](https://img.shields.io/badge/FastAPI-white)
![XGBoost](https://img.shields.io/badge/XGBoost-white)
![Google Cloud](https://img.shields.io/badge/Google%20Cloud-white?logo=googlecloud)



This is the backend API that provides calculations and predictions for the frontend. The API is hosted on Google Cloud Run, and retrieves the trained XGBoost models from Google Cloud Storage upon start-up.

## Routes

### `/predict`

1. Takes data of the form specified in `app/models/loan_applicant.py`,
2. Transforms the data into feature set that the XGBoost models expect,
3. Uses the XGBoost models to predict/calculate:
    - The predicted survival time (time to default),
    - The causal effect of interest rate on default rate,
    - The SHAP values for the survival AFT model,
4. Returns these values along with the raw data and transformed data.

### `/reload-models`

1. Requires a secret key which is stored in Google Secret Manager.
2. If the secret key matches, the API begins retrieving the latest models from Google Cloud Storage.
3. To prevent simultaneous reloading and predicting, a lock mechanism queues actions so that reloading requests have to wait for prediction requests to finish, and vice versa.

## Code locations

| Where is the code for... | You can find it in... |
|--------------------------|-----------------------|
| The routes               | `app/api/router.py` |
| Data pipeline            | `app/services/pipeline.py` |
| Model loading            | `app/services/model_loader.py` |
| Calculations and predictions | `app/services/calculations.py` |
| Model lock               | `app/core/locking.py` |