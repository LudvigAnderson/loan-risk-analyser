from training import train_aft_model, train_causal_model
import logging
from config.logging_config import setup_logging

def main():
    setup_logging()
    train_aft_model()
    train_causal_model()

if __name__ == "__main__":
    main()