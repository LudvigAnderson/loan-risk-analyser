import yaml
from app.config.paths import SETTINGS_DIR
from pathlib import Path
from typing import Union, Dict, Any

def _load_yaml(filename: Union[str, Path]) -> Dict[str, Any]:
    with open(filename, "r") as f:
        return yaml.safe_load(f)

def load_gcloud_paths():
    return _load_yaml(SETTINGS_DIR / "gcloud_paths.yaml")