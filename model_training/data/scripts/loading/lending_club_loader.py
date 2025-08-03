import pandas as pd
from google.cloud import storage
from io import BytesIO
from utils.settings_loader import load_gcloud_paths

from pandas import DataFrame

import logging
logger = logging.getLogger(__name__)

def get_lending_club_data(path=None, usecols=None) -> DataFrame:
    if path: # This is just for development purposes
        chunksize = 100_000
        chunks = pd.read_csv(
            path,
            low_memory=False,
            chunksize=chunksize,
            usecols=usecols
        )

        df = pd.concat(chunks)
        logger.info("Lending Club data converted to pandas DataFrame.")

        return df
    
    cloud_paths = load_gcloud_paths()

    client = storage.Client()

    bucket_name = cloud_paths["gcs_bucket"]
    blob_name = cloud_paths["blobs"]["lending_club_data"]

    bucket = client.bucket(bucket_name)
    blob = bucket.blob(blob_name)

    data_bytes = blob.download_as_bytes()
    logger.info("Lending Club data downloaded from Google Cloud Storage.")

    data_stream = BytesIO(data_bytes)

    chunksize = 100_000
    chunks = pd.read_csv(
        data_stream,
        low_memory=False,
        chunksize=chunksize,
        usecols=usecols
    )

    df = pd.concat(chunks)
    logger.info("Lending Club data converted to pandas DataFrame.")

    return df