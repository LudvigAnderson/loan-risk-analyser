from pathlib import Path
import pandas as pd
from config.paths import DATA_RAW_DIR, DATA_FINAL_DIR

# This script is simply for converting the "ssb_inflation_data.csv" file,
# so that it instead reflects total inflation until today.

def generate_total_inflation_csv():
    df = pd.read_csv(DATA_RAW_DIR / "ssb_inflation_data.csv", low_memory=False, delimiter=";")

    series = df.iloc[0]

    def calculate_total_inflation(date: str):
        index = series.index.get_loc(date)
        length = series.shape[0]
        inflation_factors = series[index:length] / 100 + 1
        
        return inflation_factors.prod(axis=0)

    total_inflations = {}
    for month in series.keys():
        total_inflations[month] = calculate_total_inflation(month)

    total_inflations_df = pd.DataFrame([total_inflations])

    total_inflations_df.to_csv(DATA_FINAL_DIR / "total_inflation_factors.csv", index=False, sep=",")


if __name__ == "__main__":
    generate_total_inflation_csv()