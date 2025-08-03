from typing import Protocol
from numpy import ndarray

class Predictor(Protocol):
    def predict(self, X) -> ndarray:
        ...