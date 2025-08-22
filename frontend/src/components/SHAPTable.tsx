import { useContext, useMemo } from "react";
import { DataContext } from "../contexts/DataContext";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Accordion from "./core/Accordion";
import SHAPCalculationsModal from "./modals/SHAPCalculationsModal";

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
  ],
}

interface Explanation {
  name: string;
  explanation?: string;
}
interface ExplanationList {
  [key: string]: Explanation;
}

const featureExplanations: ExplanationList = {
  "monthly_principal": {
    name: "Monthly principal",
  },
  "principal/inc": {
    name: "Principal to income ratio",
  },
  "annual_inc": {
    name: "Annual income",
  },
  "emp_length": {
    name: "Employment length",
  },
  "total_acc": {
    name: "Credit accounts",
  },
  "acc_satisfied_rate": {
    name: "Non-delinquent accounts",
  },
  "total_bc_limit": {
    name: "Credit card limits",
  },
  "bc_util": {
    name: "Credit card usage",
  },
  "percent_bc_gt_75": {
    name: "Nearly-maxed cards",
  },
  "dti": {
    name: "Installments to income ratio",
  },
  "il_util": {
    name: "Installment loans",
  },
  "total_bal_ex_mort": {
    name: "Loans excluding mortgage",
  },
  "total_bal/inc": {
    name: "Loans to income ratio",
  },
  "acc_open_past_24mths": {
    name: "Accounts opened recently",
  },
  "inq_last_6mths": {
    name: "Recent credit inquiries",
  },
  "credit_history_months": {
    name: "Credit history length",
  },
  "mths_since_last_delinq": {
    name: "Delinquency recency",
  },
  "pub_rec_bankruptcies": {
    name: "Previous bankruptcies",
  },
  "delinq_2yrs": {
    name: "Recent delinquencies",
  },
  "collections_12_mths_ex_med": {
    name: "Recent collections",
  },
  "month": {
    name: "The current month",
  },
  "unemployment_rate": {
    name: "Unemployment rate",
  }
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
      {data && shapValues && (
        <table className="min-w-full border-collapse border border-gray-300">
          <tbody>
            <tr className="bg-gray-100 relative">
              <th colSpan={2} className="shap-column">
                Prediction
                <div className="absolute top-0 right-0 ">
                  <SHAPCalculationsModal />
                </div>
              </th>
            </tr>
            <tr>
              <td className="font-semibold shap-column w-1/2">Median survival time</td>
              <td className="font-semibold shap-column w-1/2">{data.median_survival_time.toFixed(0)} months</td>
            </tr>
            <tr className="bg-gray-100">
              <th colSpan={2} className="shap-column">Explanation</th>
            </tr>
            <tr>
              <td className="shap-column w-1/2">Baseline</td>
              <td className="shap-column w-1/2">{Math.exp((data.base_value)).toFixed(0)} months</td>
            </tr>
          </tbody>
          <tbody>
            <tr className="bg-gray-100">
              <th className="shap-column w-1/2">Feature</th>
              <th className="shap-column w-1/2">Contribution to predicted survival time</th>
            </tr>
          </tbody>
          <tbody>
            {Object.entries(shapGroups).map(([category, features]) => {
              const totalShap = features.reduce((sum, feature) => sum + shapValues[feature], 0);
              const buttonText = (
                <div className="w-full flex flex-row">
                  <div className="w-1/2 flex flex-row"><span className="pr-1">{category}</span> <ChevronDownIcon className="w-5 group-data-open:rotate-180" /></div><div className="w-1/2">{(totalShap > 0) && "+"}{((Math.exp(totalShap) - 1) * 100).toFixed(1)}%</div>
                </div>
              )
              return (
                <tr key={category}>
                  <td colSpan={2}>
                    <Accordion
                      buttonText={buttonText}
                      baseClassName="group flex items-center !text-black cursor-pointer border-b border-gray-300 px-4 py-2 w-full"
                      openClassName={(totalShap > 0) ? "more-green font-semibold" : "more-red font-semibold"}
                      closedClassName={(totalShap > 0) ? "slightly-green" : "slightly-red"}
                      insideClassName=""
                      paddingY={0}
                      useChevron={false}
                    >
                      <table className="min-w-full border-collapse border-b-2 border-black">
                        <tbody>
                          {features.map(feature => {
                            const contribution = (Math.exp(shapValues[feature]) - 1) * 100;
                            const explanation = featureExplanations[feature].name.trim();
                            return (
                            <tr key={feature} className={(contribution > 0) ? "slightly-green" : "slightly-red"}>
                              <td className="shap-column w-1/2 whitespace-nowrap">{explanation}</td>
                              <td className="shap-column w-1/2">{(contribution > 0) && "+"}{contribution.toFixed(1)}%</td>
                            </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </Accordion>
                  </td>
                </tr>
              )
            })}
            <tr>
              <td className="font-semibold shap-column w-1/2">Total:</td>
              <td className="font-semibold shap-column w-1/2">{(data.median_survival_time > Math.exp(data.base_value)) && "+"}{((data.median_survival_time / Math.exp(data.base_value) - 1) * 100).toFixed(1)}%</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  )
}