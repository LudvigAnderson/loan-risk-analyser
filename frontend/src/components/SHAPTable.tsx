import { useContext, useMemo } from "react";
import { DataContext } from "../contexts/DataContext";

const shapGroups = {
  "Loan factors": [
    "monthly_principal",
    "principal/inc"
  ],
  "Income and employment": [
    "annual_inc",
    "emp_length",
  ],
  "Account status": [
    "total_acc",
    "acc_satisfied_rate",
  ],
  "Debt factors": [
    "total_bc_limit",
    "bc_util",
    "percent_bc_gt_75",
    "dti",
    "il_util",
    "total_bal_ex_mort",
    "total_bal/inc",
  ],
  "Credit history": [
    "acc_open_past_24mths",
    "inq_last_6mths",
    "credit_history_months",
    "mths_since_last_delinq",
    "pub_rec_bankruptcies",
    "delinq_2yrs",
    "collections_12_mths_ex_med",
  ],
  "External factors": [
    "month",
    "unemployment_rate",
  ]

}

export default function SHAPTable() {
  // The results sent from the API
  const dataContext = useContext(DataContext);
  if (!dataContext) throw new Error("useContext must be inside a Data Provider.");
  const { data } = dataContext;

  const shapValues = useMemo(() => {
    if (!data || !data.shap_values) return null;
    const copy = { ...data.shap_values };
    copy.month = data.shap_values["month_sin"] + data.shap_values["month_cos"];
    return copy;
  }, [data]);

  return (
    <div>
      {shapValues && (
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Feature</th>
              <th className="border border-gray-300 px-4 py-2">Contribution to predicted survival time</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(shapGroups).map(([category, features]) => {
              const totalShap = features.reduce((sum, feature) => sum + shapValues[feature], 0);
              return (
                <tr className={(totalShap > 0) ? "slightly-green" : "slightly-red"}>
                  <td className="border border-gray-300 px-4 py-2">{category}</td>
                  <td className="border border-gray-300 px-4 py-2">{(totalShap > 0) && "+"}{((Math.exp(totalShap) - 1) * 100).toFixed(1)}%</td>
                </tr>
              )
            })}
            {/*Object.entries(shapValues).map(([k, v]) => (
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{k}</td>
                <td className="border border-gray-300 px-4 py-2">{((Math.exp(v) - 1) * 100).toFixed(1)}%</td>
              </tr>
            ))*/}
          </tbody>
        </table>
      )}
    </div>
  )
}