import pandas as pd
from pathlib import Path
from config.paths import DATA_RAW_DIR, DATA_FINAL_DIR

def generate_us_state_unemployment_csv():
    FOLDER_NAME = "BLS_excel_files"

    start_year = 7  # 2007
    end_year = 18   # 2018

    dfs = []

    for year in range(start_year, end_year + 1):
        filename = f"laucnty{year:02}.xlsx"
        df = pd.read_excel(DATA_RAW_DIR / FOLDER_NAME / filename, header=1)

        df["State"] = df["County Name/State Abbreviation"].str.split(",").str[1].str.strip()

        labor_forces = df.groupby("State")["Labor Force"].sum()
        unemployed = df.groupby("State")["Unemployed"].sum()

        unemployment_rates = unemployed / labor_forces
        
        state_df = pd.DataFrame({
            "year": 2000 + year,
            "state": unemployment_rates.index,
            "unemployment_rate": unemployment_rates.values
        })

        dfs.append(state_df)


    complete_df = pd.concat(dfs)

    complete_df.to_csv(DATA_FINAL_DIR / "us_state_unemployment_rate.csv", index=False)


if __name__ == "__main__":
    generate_us_state_unemployment_csv()