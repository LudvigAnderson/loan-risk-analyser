from utils.google_secrets import get_API_secret
import requests

def update_models_in_API():
    URL = "https://loan-risk-api-745451102896.europe-west4.run.app/reload-models"
    secret = get_API_secret()

    response = requests.post(
        URL,
        headers={"api-key": secret},
        timeout=30
    )

    return response.json()