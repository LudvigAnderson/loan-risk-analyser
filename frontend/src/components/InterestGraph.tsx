import { useContext, useEffect, useMemo } from "react"
import { DataContext } from "../contexts/DataContext"

import LineGraph from "./core/LineGraph";
import { minIntRate, type ExpectedLossParams, type MinIntRateParams } from "../services/RiskModelling";
import { InterestDataContext, InterestRateContext } from "../contexts/InterestDataContext";

export default function InterestGraph() {
  // The results sent from the API
  const dataContext = useContext(DataContext);
  if (!dataContext) throw new Error("useContext must be inside a Data Provider.");
  const { data } = dataContext;

  const interestDataContext = useContext(InterestDataContext);
  if (!interestDataContext) throw new Error("useContext must be inside a Data Provider.");
  const { interestData } = interestDataContext;

  const interestRateContext = useContext(InterestRateContext);
  if (!interestRateContext) throw new Error("useContext must be inside a Data Provider.");
  const { setInterestRate } = interestRateContext;


  const maxIntRate = 0.2;

  const intRates = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0.001; i <= maxIntRate; i += 0.001) {arr.push(Number(i.toFixed(6)));}
    return arr;
  }, [])

  const profit = useMemo(() => {
    if (!data) return null;
    if (!intRates) return null;
    if (!interestData) return null;

    const minRates = intRates.map(r => {
      const expectedLossParams: ExpectedLossParams = {
        loanAmount: data.raw_data["loan_amnt"],
        term: data.raw_data["term"],
        mu: Math.log(data.median_survival_time),
        intRate: r,
        causalEffect: data.causal_effect
      }
      const minIntRateParams: MinIntRateParams = {
        costOfFunds: interestData.costOfFunds / 100,
        operatingCosts: interestData.operatingCosts / 100,
        riskWeight: interestData.riskWeight / 100,
        requiredCET1: interestData.requiredCET1Ratio / 100,
        targetROE: interestData.targetROE / 100,
      }
      
      return minIntRate(expectedLossParams, minIntRateParams);
    });

    const differences = intRates.map((r, i) => r - minRates[i]);
    return differences;
  }, [data, intRates, interestData])

  useEffect(() => {
    if (!profit) return;
    
    let bestRate;
    const firstNonNegativeValue = profit.find(x => x >= 0);
    if (firstNonNegativeValue) {
      const index = profit.indexOf(firstNonNegativeValue);
      bestRate = intRates[index];
    } else {
      bestRate = null;
    }
    setInterestRate(bestRate);

  }, [profit, setInterestRate])

  return (
    <div className="w-[800px] m-auto">
      {intRates?.length && profit?.length && (
        <LineGraph
          x={intRates}
          y={profit}
          id="profit"
          ymin={-0.25}//{Math.min(...profit) - 0.1}
          ymax={0.25}//{Math.max(...profit) + 0.1}
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