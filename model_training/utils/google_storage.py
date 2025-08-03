from google.cloud import storage

from typing import Union
from pathlib import Path

import logging
logger = logging.getLogger(__name__)

def upload_to_gcs(
        local_path: Union[str, Path],
        bucket_name: str,
        blob_name: str
):  
    if blob_name is None:
        blob_name = Path(local_path).name
    
    try:
        client = storage.Client()
        bucket = client.bucket(bucket_name)
        blob = bucket.blob(blob_name)
        blob.upload_from_filename(local_path)
        logger.info(f"Uploaded {local_path} to gs://{bucket_name}/{blob_name}")
    except Exception as e:
        logger.error(f"Failed to upload {local_path} to GCS: {e}")
        raise