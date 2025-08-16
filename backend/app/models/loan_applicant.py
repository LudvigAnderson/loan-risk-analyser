from pydantic import BaseModel
from typing import Optional

class LoanApplicant(BaseModel):
    annual_inc: float
    loan_amnt: float
    term: int # in months
    emp_length: int

    bc_bal: float
    total_bc_limit: float
    percent_bc_gt_75: Optional[int]
    
    init_mortgage: float
    mortgage: float
    
    init_student_loan: float
    student_loan: float
    
    init_car_loan: float
    car_loan: float

    init_consumer_loan: float
    consumer_loan: float

    monthly_installments: float

    num_sats: int
    total_acc: int
    acc_open_past_24mths: int
    inq_last_6mths: int
    credit_history_months: int
    mths_since_last_delinq: Optional[int]
    pub_rec_bankruptcies: int
    delinq_2yrs: int
    collections_12_mths_ex_med: int
    

