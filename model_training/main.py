from training import train_aft_model, train_causal_model
import logging
from config.logging_config import setup_logging

logger = logging.getLogger(__name__)

def main():
    logger.info("FUNCTION main HAS STARTED.")
    setup_logging()
    train_aft_model()
    train_causal_model()

if __name__ == "__main__":
    main()