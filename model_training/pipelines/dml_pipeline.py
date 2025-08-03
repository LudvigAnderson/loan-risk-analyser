from sklearn.pipeline import Pipeline

from transformers.cleaning import (
    DropNATransformer,
    DropColumnsTransformer,
    ZeroImputer,
)
from transformers.feature_creation import (
    CreditHistoryTransformer,
    YearMonthTransformer,
    InteractionTransformer,
    UnemploymentTransformer,
    DefaultTransformer
)
from transformers.feature_engineering import (
    DatetimeTransformer,
    EmpLengthTransformer,
    OneHotEncoder,
    TermTransformer,
    FicoTransformer,
)

# Pipeline for data fed to the nuisance models used in EconML's LinearDML model
def create_dml_pipeline() -> Pipeline:
    OHE_cols = [
        "addr_state",
        "purpose",
        "home_ownership",
        "verification_status",
        "initial_list_status",
        "disbursement_method",
    ]
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

        # makes "default" column (0 or 1)
        ("default_transformer", DefaultTransformer()),
        ("year_month_transformer", YearMonthTransformer()),

        # adds unemployment as a column based on the issue_d
        ("unemployment_transformer", UnemploymentTransformer()),

        ("term_transformer", TermTransformer()),

        ("fico_transformer", FicoTransformer()),

        ("ohe", OneHotEncoder(cols=OHE_cols)),

        # Imputes NA as -1, replaces "< 1" with "0",
        # and then extracts the numbers and turns the column into int format

        ("emp_length_transformer", EmpLengthTransformer()), # consider adding a parameter for whether to impute na.

        # Makes a column representing the amount of months of credit history
        # before the issue date
        ("credit_history_transformer", CreditHistoryTransformer()),

        # The double ML model doesn't accept any NA stuff
        ("zero_imputer", ZeroImputer(
            impute_all=True
        )),


        ("interaction_transformer", InteractionTransformer(
            divisions={
                "loan/inc": ("loan_amnt", "annual_inc"),
                "total_bal/inc": ("tot_cur_bal", "annual_inc"),
                "acc_satisfied_rate": ("num_sats", "total_acc"),
                "loan/term": ("loan_amnt", "term"),
                "emp_length/term": ("emp_length", "term"),
            }
        )),

        # Drops unwanted columns
        ("column_remover", DropColumnsTransformer(
            cols=[
                "loan_status", "earliest_cr_line", "last_pymnt_d", "addr_state",
                "application_type", "num_sats", "total_bal_il", "tot_cur_bal",
                "sub_grade", "issue_d",
            ]
        )),
    ])

    return pipeline