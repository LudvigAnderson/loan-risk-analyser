import { useContext, useMemo } from "react"
import { DataContext } from "../contexts/DataContext"

import LineGraph from "./core/LineGraph";
import { minIntRate, type ExpectedLossParams, type MinIntRateParams } from "../services/RiskModelling";

export default function InterestGraph() {
  // The results sent from the API
  const dataContext = useContext(DataContext);
  if (!dataContext) throw new Error("useContext must be inside a Data Provider.");
  const { data } = dataContext;

  const maxIntRate = 0.2

  const intRates = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0.001; i <= maxIntRate; i += 0.001) {arr.push(Number(i.toFixed(6)))}
    return arr;
  }, [])

  const profit = useMemo(() => {
    if (!data) return null;
    if (!intRates) return null;
    const minRates = intRates.map(r => {
      const expectedLossParams: ExpectedLossParams = {
        loanAmount: data.raw_data["loan_amnt"],
        term: data.raw_data["term"],
        mu: Math.log(data.median_survival_time),
        intRate: r,
        causalEffect: data.causal_effect
      }
      const minIntRateParams: MinIntRateParams = { // COULD MAYBE SET SOME INPUTS FOR THIS?
        costOfFunds: 0.04,
        operatingCosts: 0.02,
        riskWeight: 1.0,
        targetROE: 0.14,
        requiredCET1: 0.166
      }
      
      return minIntRate(expectedLossParams, minIntRateParams);
    })
    const differences = intRates.map((r, i) => r - minRates[i]);
    return differences
  }, [data, intRates])

  return (
    <div className="w-[800px] m-auto">
      {intRates?.length && profit?.length && (
        <LineGraph
          x={intRates}
          y={profit}
          id="profit"
          ymin={Math.min(...profit) - 0.1}
          ymax={Math.max(...profit) + 0.1}
          xmax={intRates[intRates.length - 1]}
          xlabel="Interest rate"
          ylabel="Profit"
          xPercent={true}
          markerY={0}
        />
      )}
    </div>
  )
}