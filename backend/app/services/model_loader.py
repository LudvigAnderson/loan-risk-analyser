from google.cloud import storage
from app.utils.settings_loader import load_gcloud_paths
import asyncio
from concurrent.futures import ThreadPoolExecutor
from fastapi import FastAPI
from shap import TreeExplainer
from xgboost import Booster

from typing import Tuple

executor = ThreadPoolExecutor()

def _get_meta_data_sync(bucket_name: str, blob_name: str) -> str:
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    blob.reload()
    return blob.md5_hash

async def _get_meta_data(bucket_name: str, blob_name: str) -> str:
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(executor, _get_meta_data_sync, bucket_name, blob_name)

def _download_model_sync(bucket_name: str, blob_name: str) -> bytes:
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(blob_name)

    return blob.download_as_bytes()

async def _download_model(bucket_name: str, blob_name: str) -> bytes:
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(executor, _download_model_sync, bucket_name, blob_name)

async def load_ml_models(app: FastAPI):
    async with app.state.model_lock.acquire_write():
        cloud_paths = load_gcloud_paths()
        bucket_name = cloud_paths["gcs_bucket"]
        aft_blob = "models/aft_model.ubj"
        causal_blob = "models/causal_model.ubj"

        aft_hash, causal_hash = await asyncio.gather(
            _get_meta_data(bucket_name, aft_blob),
            _get_meta_data(bucket_name, causal_blob)
        )

        state_aft_hash = getattr(app.state, "aft_hash", None)
        state_causal_hash = getattr(app.state, "causal_hash", None)

        if state_aft_hash == aft_hash and state_causal_hash == causal_hash:
            return # Return if the app already has the same models loaded

        aft_bytes, causal_bytes = await asyncio.gather(
            _download_model(bucket_name, aft_blob),
            _download_model(bucket_name, causal_blob)
        )

        aft_model = Booster()
        aft_model.load_model(bytearray(aft_bytes))
        
        causal_model = Booster()
        causal_model.load_model(bytearray(causal_bytes))

        aft_shap_explainer = TreeExplainer(aft_model)

        app.state.aft_model = aft_model
        app.state.aft_hash = aft_hash
        app.state.causal_model = causal_model
        app.state.causal_hash = causal_hash
        app.state.aft_shap_explainer = aft_shap_explainer