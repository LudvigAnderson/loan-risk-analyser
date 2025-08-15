from training import train_and_save_models
from utils.API_utils import update_models_in_API
import logging
from config.logging_config import setup_logging

def main():
    setup_logging()
    logger = logging.getLogger(__name__)
    logger.info("Model training beginning.")
    train_and_save_models()

    # Notify the FastAPI that there are new models
    response = update_models_in_API()
    logger.info(response)
    

if __name__ == "__main__":
    main()