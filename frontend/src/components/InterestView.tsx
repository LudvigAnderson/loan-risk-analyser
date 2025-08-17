import { useContext } from "react";
import InterestTable from "./InterestTable";
import InterestGraph from "./InterestGraph";
import { DataContext } from "../contexts/DataContext";

export default function InterestView() {
  const dataContext = useContext(DataContext);
  if (!dataContext) throw new Error("useContext must be inside a Data Provider.");
  const { data } = dataContext;
  return (
    <>
      {data != undefined ? (
        <div className="flex flex-wrap">
          <div className="w-1/2"><InterestTable /></div>
          <div className="w-1/2"><InterestGraph /></div>
        </div>
      ) : (
        <p>Submit applicant data first.</p>
      )}
    </>

  )
}