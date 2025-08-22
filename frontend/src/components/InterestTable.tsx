import { useContext } from "react";
import NumberInput from "./core/NumberInput";
import { InterestDataContext, InterestRateContext, type InterestDataProps } from "../contexts/InterestDataContext";
import { DataContext } from "../contexts/DataContext";
import { expectedLoss } from "../services/RiskModelling";



export default function InterestTable() {
  const interestDataContext = useContext(InterestDataContext);
  if (!interestDataContext) throw new Error("useContext must be inside a Data Provider.");
  const { interestData, setInterestData } = interestDataContext;

  const dataContext = useContext(DataContext);
  if (!dataContext) throw new Error("useContext must be inside a Data Provider.");
  const { data } = dataContext;

  const interestRateContext = useContext(InterestRateContext);
  if (!interestRateContext) throw new Error("useContext must be inside a Data Provider.");
  const { interestRate } = interestRateContext;

  function changeInterestData(key: keyof InterestDataProps, value: string) {
    setInterestData({ ...interestData, [key]: Number(value) })
  }

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td></td>
            <td>
              <NumberInput
                label="Cost of Funds"
                unit="%"
                defaultValue={interestData.costOfFunds}
                extraOnChange={e => changeInterestData("costOfFunds", e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td className="relative"><span className="math-operator">+</span></td>
            <td>
              <NumberInput
                label="Operating costs"
                unit="%"
                defaultValue={interestData.operatingCosts}
                extraOnChange={e => changeInterestData("operatingCosts", e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td className="relative"><span className="math-operator">+</span></td>
            <td className="flex flex-row items-center">
              <NumberInput
                label="Risk weight"
                unit="%"
                defaultValue={interestData.riskWeight}
                extraOnChange={e => changeInterestData("riskWeight", e.target.value)}
              />
            </td>
            <td className="relative"><span className="math-operator">&times;</span></td>
            <td>
              <NumberInput
                label="CET1 ratio"
                unit="%"
                defaultValue={interestData.requiredCET1Ratio}
                extraOnChange={e => changeInterestData("requiredCET1Ratio", e.target.value)}
              />
            </td>
            <td className="relative"><span className="math-operator">&times;</span></td>
            <td>
              <NumberInput
                label="Target ROE"
                unit="%"
                defaultValue={interestData.targetROE}
                extraOnChange={e => changeInterestData("targetROE", e.target.value)}
              />
            </td>
          </tr>
          {(data && data.raw_data) ? (
            <>
            {interestRate && (
              <>
                <tr>
                  <td className="relative"><span className="math-operator">+</span></td>
                  <td>
                    <NumberInput
                      label="Expected loss"
                      value={(expectedLoss({
                        loanAmount: data.raw_data.loan_amnt,
                        term: data.raw_data.term,
                        mu: Math.log(data.median_survival_time),
                        sigma: 1,
                        intRate: interestRate,
                        causalEffect: data.causal_effect,
                      }) * 100 / data.raw_data.loan_amnt).toFixed(1)}
                      unit="%"
                      disabled={true}
                      className="disabled-input"
                    />
                  </td>
                  <td className="relative"><span className="math-operator">&divide;</span></td>
                  <td>
                    <NumberInput
                      label="Term in years"
                      value={(data.raw_data.term / 12).toFixed(1)}
                      disabled={true}
                      className="disabled-input"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="relative"><span className="math-operator">&asymp;</span></td>
                  <td>
                    <NumberInput
                      label="Interest rate"
                      value={(interestRate * 100).toFixed(1)}
                      unit="%"
                      disabled={true}
                      className="disabled-input"
                    />
                  </td>
                </tr>
                <tr className="border-b">
                  <td></td>
                  <td colSpan={5}><p className="font-semibold pt-1">The loan is predicted to be profitable at an interest rate of {(interestRate * 100).toFixed(1)}%.</p></td>
                </tr>
              </>
            )}
            {interestRate === null && (
              <>
                <tr>
                  <td></td>
                  <td>
                    <NumberInput
                      label="Expected loss"
                      value="N/A"
                      disabled={true}
                      className="disabled-input"
                    />
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    <NumberInput
                      label="Interest rate"
                      value="N/A"
                      disabled={true}
                      className="disabled-input"
                    />
                  </td>
                </tr>
                <tr className="border-b">
                  <td></td>
                  <td colSpan={5}><p className="font-semibold pt-1">The loan cannot be made profitable at any interest rate.</p></td>
                </tr>
              </>
            )}
            </> 
          ) : (
            <tr>
              <td></td>
              <td>
                <p>Data could not be found, try submitting the applicant data again.</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}