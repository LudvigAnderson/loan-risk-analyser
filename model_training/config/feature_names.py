PREDICTION_FEATURES = [
    # loan information
    "loan_amnt", "issue_d", "last_pymnt_d", "loan_status", "int_rate", "term",

    # applicant demographics
    "emp_length", "annual_inc", "addr_state",

    # credit status
    "dti", "bc_util", "total_bc_limit", "delinq_2yrs",
    "total_acc", "percent_bc_gt_75", "il_util",

    # credit history
    "acc_open_past_24mths", "tot_cur_bal", "num_sats", "total_bal_ex_mort",
    "earliest_cr_line", "mths_since_last_delinq",
    "collections_12_mths_ex_med", "pub_rec_bankruptcies",
    "inq_last_6mths",
]

NUISANCE_EXCLUDED_FEATURES = [
    "desc", "emp_title", "zip_code", "grade", # I can use sub_grade

    "id", "member_id", "policy_code", "title", "url", 

    "funded_amnt", "funded_amnt_inv", "next_pymnt_d", "out_prncp", "out_prncp_inv", "pymnt_plan", "payment_plan_start_date", 
    "recoveries", "total_pymnt", "total_pymnt_inv", "total_rec_int", "total_rec_late_fee", "total_rec_prncp",
    "deferral_term", "orig_projected_additional_accrued_interest", "last_pymnt_amnt", "collection_recovery_fee",
    "last_credit_pull_d", "last_fico_range_high", "last_fico_range_low", "installment",
]

NUISANCE_EXCLUDED_FEATURE_KEYWORDS = [
    "hardship", "joint", "sec_app", "settlement",
]