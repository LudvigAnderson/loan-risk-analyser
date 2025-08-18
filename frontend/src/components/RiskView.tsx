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
        <div className="flex flex-wrap pt-6">
          <div className="w-1/2">
            <h3 className="header3 underline text-center">How is the survival chance calculated?</h3>
            <SHAPTable />
          </div>
          <div className="w-1/2">
            <h3 className="header3 underline text-center">Applicant survival chance over time</h3>
            <SurvivalGraph />
          </div>
        </div>
      ) : (
        <p>Submit applicant data first.</p>
      )}
    </>

  )
}