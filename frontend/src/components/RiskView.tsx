import { useContext } from "react";
import SHAPTable from "./SHAPTable";
import SurvivalGraph from "./SurvivalGraph";
import { DataContext } from "../contexts/DataContext";

export default function RiskView() {
  const dataContext = useContext(DataContext);
  if (!dataContext) throw new Error("useContext must be inside a Data Provider.");
  const { data } = dataContext;
  return (
    <>
      {data != undefined ? (
        <div className="flex flex-wrap">
          <div className="w-1/2"><SHAPTable /></div>
          <div className="w-1/2"><SurvivalGraph /></div>
        </div>
      ) : (
        <p>Submit applicant data first.</p>
      )}
    </>

  )
}