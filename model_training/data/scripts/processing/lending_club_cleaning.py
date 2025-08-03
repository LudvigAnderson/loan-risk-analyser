import pandas as pd
from config.paths import DATA_RAW_DIR, DATA_FINAL_DIR, DATA_DIR
from config.feature_names import NUISANCE_EXCLUDED_FEATURE_KEYWORDS, NUISANCE_EXCLUDED_FEATURES
from typing import List

# This is the filtering I ran on the original data set.
# The filtered data set is now stored on Google Cloud Storage, due to size.
def get_all_included_features() -> List[str]:
    dictionary = pd.read_csv(DATA_DIR / "dictionary" / "lending_club_dictionary.csv", low_memory=False)

    features = dictionary["LoanStatNew"].dropna()

    filtered = features[~features.isin(NUISANCE_EXCLUDED_FEATURES)]
    filtered = filtered[~filtered.str.contains("|".join(NUISANCE_EXCLUDED_FEATURE_KEYWORDS), case=False)]

    columns_to_read = filtered.str.strip().tolist()

    return columns_to_read

def generate_filtered_dataset():
    columns_to_read = get_all_included_features()
    chunksize = 1e5
    chunks = []
    

    for chunk in pd.read_csv(DATA_RAW_DIR / "accepted_2007_to_2018Q4.csv", low_memory=False, usecols=columns_to_read, chunksize=chunksize):
        chunks.append(chunk)
    
    df = pd.concat(chunks)
    
    df = df[df["application_type"] == "Individual"].drop(columns=["application_type"])

    df.to_csv(DATA_FINAL_DIR / "lending_club_filtered.csv", index=False, sep=",")


if __name__ == "__main__":
    generate_filtered_dataset()