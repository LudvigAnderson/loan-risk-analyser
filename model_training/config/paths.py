from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent
CONFIG_DIR = PROJECT_ROOT / "config"
DATA_DIR = PROJECT_ROOT / "data"
DATA_FINAL_DIR = DATA_DIR / "final"
DATA_RAW_DIR = DATA_DIR / "raw"
SETTINGS_DIR = PROJECT_ROOT / "settings"
SAVED_MODELS_DIR = PROJECT_ROOT / "saved_models"