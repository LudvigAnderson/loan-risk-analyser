from google.cloud import secretmanager
from utils.settings_loader import load_gcloud_paths

def get_API_secret():
    gcloud_paths = load_gcloud_paths()
    project_id = gcloud_paths["project_id"]
    api_secret_id = gcloud_paths["api_secret_id"]
    
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{project_id}/secrets/{api_secret_id}/versions/latest"

    response = client.access_secret_version(name=name)
    secret_key = response.payload.data.decode("UTF-8")

    return secret_key