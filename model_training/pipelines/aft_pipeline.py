from sklearn.pipeline import Pipeline

from transformers.cleaning import (
    DropNATransformer,
    DropColumnsTransformer,
)
from transformers.feature_creation import (
    BoundsTransformer,
    CreditHistoryTransformer,
    YearMonthTransformer,
    InteractionTransformer,
    UnemploymentTransformer,
)
from transformers.feature_engineering import (
    DatetimeTransformer,
    EmpLengthTransformer,
    MonetaryTransformer,
    TermTransformer,
    PercentageTransformer
)

# Pipeline used to transform data to be used by the prediction models
def create_aft_pipeline(drop_issue_d: bool = False) -> Pipeline:
    # These columns will be dropped completely at the end of the pipeline:
    cols_to_drop = [
        "loan_status",
        "earliest_cr_line",
        "last_pymnt_d",
        "issue_year",

        "addr_state",
        "application_type",

        "num_sats",
        "total_bal_il",
        "tot_cur_bal",
        "int_rate",
        "term",
    ]
    if drop_issue_d:
        cols_to_drop.append("issue_d")
    

    pipeline = Pipeline([
        # Drops rows with NA.
        # Only columns with very few (<0.1%) NA's get dropped.
        ("drop_na", DropNATransformer(
            cols=[
                "last_pymnt_d",
                "pub_rec_bankruptcies",
                "revol_util",
                "dti",
                "collections_12_mths_ex_med",
                "inq_last_6mths",
            ]
        )),

        # converts appropriate columns to datetimes, such as the issue date and last payment
        ("datetime_transformer", DatetimeTransformer(
            cols=[
                "issue_d",
                "earliest_cr_line",
                "last_pymnt_d"
            ]
        )),

        # makes "survival_time" and "event" columns
        ("bounds_transformer", BoundsTransformer()),

        ("year_month_transformer", YearMonthTransformer()),

        # adds unemployment as a column based on the issue_d
        ("unemployment_transformer", UnemploymentTransformer()),

        ("term_transformer", TermTransformer()),


        # Imputes NA as 0, replaces "< 1" with "0",
        # and then extracts the numbers and turns the column into int format
        ("emp_length_transformer", EmpLengthTransformer()),

        # Makes a column representing the amount of months of credit history
        # before the issue date
        ("credit_history_transformer", CreditHistoryTransformer()),

        # Converts columns that represent percentages, such that 33.5 --> 0.335
        ("percentage_transformer", PercentageTransformer(
            cols=[
                "dti",
                "revol_util",
                "il_util",
                "bc_util",
                "pct_tl_nvr_dlq",
                "percent_bc_gt_75"
            ]
        )),

        # Converts monetary amounts to current Norwegian prices, by using PPP and inflation.
        # The final value represents Norwegian prices, NOK, in 2025.
        ("inflation_ppp_transformer", MonetaryTransformer(
            money_cols=[
                "loan_amnt",
                "annual_inc",
                "total_bc_limit",
                "bc_open_to_buy",
                "delinq_amnt",
                "tot_cur_bal",
                "total_bal_ex_mort",
            ]
        )),

        # Makes interaction terms
        ("interaction_transformer", InteractionTransformer(
            divisions={
                "loan/inc": ("loan_amnt", "annual_inc"),
                "total_bal/inc": ("tot_cur_bal", "annual_inc"),
                "acc_satisfied_rate": ("num_sats", "total_acc"),
                "loan/term": ("loan_amnt", "term"),
                "emp_length/term": ("emp_length", "term"),
                # history score? credithistorymonths/pubrec
            }
        )),

        # Drops unwanted columns
        ("column_remover", DropColumnsTransformer(
            cols=cols_to_drop
        )),
    ])

    return pipeline