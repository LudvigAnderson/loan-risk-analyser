# Model training

## Overview

Standard tools:
![Python](https://img.shields.io/badge/Python-white?logo=python)
![NumPy](https://img.shields.io/badge/NumPy-white?logo=numpy&logoColor=013243)
![pandas](https://img.shields.io/badge/pandas-white?logo=pandas&logoColor=150458)
![scikit-learn](https://img.shields.io/badge/scikit--learn-white?logo=scikitlearn)

Specialized tools:
![XGBoost](https://img.shields.io/badge/XGBoost-white)
![Optuna](https://img.shields.io/badge/Optuna-white)
![EconML](https://img.shields.io/badge/EconML-white)
![CuPy](https://img.shields.io/badge/CuPy-white)
![Google Cloud](https://img.shields.io/badge/Google%20Cloud-white?logo=googlecloud)



This is the ML pipeline. It roughly does the following:

1. Load the data set from a CSV file in Google Cloud Storage,
2. Transform the data with the appropriate pipeline,
3. Train three models:
    - An XGBoost model with around 20 features, with Accelerated Failure Time (AFT) as the objective,
    - A debiased/double machine learning (DML) model which uses the entire feature space to predict the causal effect of interest rate on default rate,
    - An XGBoost regressor model that acts as a "student" model to the DML model, in order to use the smaller feature set to predict the causal effect,
4. Upload the two XGBoost models to Google Cloud Storage,
5. Notify the backend API to retrieve the new models.

## Code locations

| Where is the code for... | You can find it in... |
|--------------------------|-----------------------|
| Model training           | `training/train_models.py` |
| Data pipelines           | `pipelines/aft_pipeline.py`<br>`pipelines/dml_pipeline.py` |
| Custom data transformers | `transformers/cleaning/`<br>`transformers/feature_creation/`<br>`transformers/feature_engineering/` |
| Notifying backend API     | `utils/API_utils.py`<br>`google_secrets.py` |