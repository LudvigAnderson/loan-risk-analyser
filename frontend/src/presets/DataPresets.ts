interface FormData {
  loan_amnt: number;
  term: number;

  annual_inc: number;
  emp_length: number | null;

  bc_bal: number;
  total_bc_limit: number;
  percent_bc_gt_75: number | null;

  init_mortgage: number;
  mortgage: number;
  init_student_loan: number;
  student_loan: number;
  init_car_loan: number;
  car_loan: number;
  init_consumer_loan: number;
  consumer_loan: number;

  monthly_installments: number;

  total_acc: number;
  num_sats: number;

  acc_open_past_24mths: number;
  inq_last_6mths: number;
  credit_history_months: number;
  mths_since_last_delinq: number | null;
  pub_rec_bankruptcies: number;
  delinq_2yrs: number;
  collections_12_mths_ex_med: number;
}

const defaultData: Readonly<FormData> = {
  loan_amnt: 0,
  term: 36,

  annual_inc: 0,
  emp_length: null,

  bc_bal: 0,
  total_bc_limit: 0,
  percent_bc_gt_75: 0,

  init_mortgage: 0,
  mortgage: 0,
  init_student_loan: 0,
  student_loan: 0,
  init_car_loan: 0,
  car_loan: 0,
  init_consumer_loan: 0,
  consumer_loan: 0,

  monthly_installments: 0,

  total_acc: 0,
  num_sats: 0,

  acc_open_past_24mths: 0,
  inq_last_6mths: 0,
  credit_history_months: 0,
  mths_since_last_delinq: null,
  pub_rec_bankruptcies: 0,
  delinq_2yrs: 0,
  collections_12_mths_ex_med: 0,
}

interface PresetList {
  [key: string]: Partial<FormData>;
}

const dataPresets: PresetList = {
  "Recent graduate": {
    loan_amnt: 50_000,
    term: 36,

    annual_inc: 650_000,
    emp_length: 0,

    bc_bal: 5000,
    total_bc_limit: 10_000,
    percent_bc_gt_75: 0,

    init_student_loan: 500_000,
    student_loan: 500_000,

    monthly_installments: 2500,

    total_acc: 2,
    num_sats: 2,

    credit_history_months: 24,
  },
  "Middle-aged homeowner": {
    loan_amnt: 100_000,
    term: 60,

    annual_inc: 850_000,
    emp_length: 10,

    bc_bal: 2500,
    total_bc_limit: 30_000,
    percent_bc_gt_75: 0,

    init_mortgage: 1_000_000,
    mortgage: 0,
    init_car_loan: 200_000,
    car_loan: 15_000,
    init_student_loan: 500_000,
    student_loan: 0,

    monthly_installments: 3500,

    total_acc: 6,
    num_sats: 6,

    credit_history_months: 300,
  },
  "Heavily indebted borrower": {
    loan_amnt: 30_000,
    term: 60,

    annual_inc: 600_000,
    emp_length: 5,

    bc_bal: 42_500,
    total_bc_limit: 45_000,
    percent_bc_gt_75: 100,

    init_student_loan: 350_000,
    student_loan: 345_000,
    init_consumer_loan: 300_000,
    consumer_loan: 270_000,

    monthly_installments: 8_000,

    total_acc: 15,
    num_sats: 6,

    acc_open_past_24mths: 4,
    inq_last_6mths: 7,
    credit_history_months: 60,
    mths_since_last_delinq: 3,
    pub_rec_bankruptcies: 1,
    delinq_2yrs: 8,
    collections_12_mths_ex_med: 1
  }
}


const presets: Record<string, FormData> = Object.fromEntries(
  Object.entries(dataPresets).map(([name, preset]) => [
    name,
    { ...defaultData, ...preset },
  ])
);

export { presets, defaultData };
export type { FormData }