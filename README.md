# Loan Risk Analyser

This project uses the Lending Club data set to predict the survival time (time until default) for loan applicants.

## Model Training

`model_training/` is actually more of an ML pipeline, and does the following:
1. Retrieves a filtered Lending Club data set from Google Cloud Storage,
2. Trains an XGBoost model with the Accelerated Failure Time (AFT) model as objective,
3. Uses debiased/double ML to find the causal effect of interest rate on default rate,
4. Saves the models to Google Cloud Storage,
5. Notifies the API from `backend/` to retrieve the new ML models.

## Backend

`backend/` creates a FastAPI application that runs on Google Cloud Run. It retrieves the ML models from Google Cloud Storage to keep them in memory. It receives a loan application's data, transforms it into a valid format, and returns a response with predictions and calculations.

## Frontend

`frontend/` is a React application that is hosted on Firebase.

## GitHub Actions + Docker + Google Cloud
`.github/workflows/` is where you can find my GitHub Action YAML files. The following processes are entirely automated with GitHub Actions, the only thing I do is push the code:
- Model training on Vertex AI
- API deployment to Cloud Run
- Frontend deployment to Firebase