import yaml
from pathlib import Path
from config.paths import SETTINGS_DIR
from typing import Union, Dict, Any

def _load_yaml(filename: Union[str, Path]) -> Dict[str, Any]:
    with open(filename, "r") as f:
        return yaml.safe_load(f)

def load_training_settings():
    return _load_yaml(SETTINGS_DIR / "training.yaml")

def load_gcloud_paths():
    return _load_yaml(SETTINGS_DIR / "gcloud_paths.yaml")