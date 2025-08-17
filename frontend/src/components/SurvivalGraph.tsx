import { useContext, useMemo } from "react"
import { DataContext } from "../contexts/DataContext"

import LineGraph from "./core/LineGraph";
import { lognormalSF } from "../services/Statistics";

export default function SurvivalGraph() {
  // The results sent from the API
  const dataContext = useContext(DataContext);
  if (!dataContext) throw new Error("useContext must be inside a Data Provider.");
  const { data } = dataContext;

  // Get the term from the submitted form and turn it into an Array from 0 to term (inclusive)
  const times = useMemo(() => {
    if (!data || !data.raw_data.term) return null;
    const term = data.raw_data.term;
    return Array.from({ length: term + 1 }, (_, i) => i);
  }, [data])

  // Calculate the survival function
  const survivalFunction = useMemo(() => {
    if (!data) return null;
    if (!times) return null;
    const mu = Math.log(data.median_survival_time);
    return times.map(t => lognormalSF(t, mu));
  }, [data, times])

  {/*const cdf = useMemo(() => {
    if (!data) return null;
    if (!times) return null;
    const mu = Math.log(data.median_survival_time);
    return times.map(t => lognormalCDF(t, mu));
  }, [data, times])*/}



  // Make some buttons here to change the contents of the LineGraph
  return (
    <div className="w-[800px] m-auto">
      {times?.length && survivalFunction?.length && (
        <LineGraph
          x={times}
          y={survivalFunction}
          id="sf"
          ymin={0}
          ymax={1}
          xlabel="Month"
          ylabel="Chance of Not Defaulting"
          xmax={times[times.length - 1]}
        />
      )}
    </div>
  )
}