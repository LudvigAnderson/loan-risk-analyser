import NumberInput from "./core/NumberInput"
import Accordion from "./core/Accordion"
import Button from "./core/Button"
import { DataContext } from "../contexts/DataContext"

import { useContext, useEffect, useState } from "react"
import type { FormEvent } from "react"

import { presets, defaultData } from "../presets/DataPresets"
import type { FormData } from "../presets/DataPresets"

import { isEqual } from "lodash"

export default function ApplicantForm() {
  const dataContext = useContext(DataContext);
  if (!dataContext) throw new Error("useContext must be inside a Data Provider.");
  const { setData } = dataContext;

  const [loading, setLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const [presetData, setPresetData] = useState<FormData>(defaultData);

  useEffect(() => {
    let intervalId = 0;
    let delayTimeout = 0;

    if (loading) {
      delayTimeout = setTimeout(() => {
        intervalId = setInterval(() => {
          setElapsedTime((time) => time + 1);
        }, 1000);
      }, 1000);
    } else {
      setElapsedTime(0);
      clearTimeout(delayTimeout);
      clearInterval(intervalId)
    }

    return () => {
      clearTimeout(delayTimeout);
      clearInterval(intervalId);
    }
  }, [loading]);


  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const rawData = Object.fromEntries(formData.entries());

    const parsedData = Object.fromEntries(
      Object.entries(rawData).map(([key, value]) => {
        const strValue = value as string;
        const cleanedValue = strValue.replace(",", ".").replace(/\s/g, "");
        const num = Number(cleanedValue);
        return [key, isNaN(num) ? null : num];
      })
    );

    try {
      const url = "https://loan-risk-api-745451102896.europe-west4.run.app/predict";
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedData)
      };
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error details:", errorData);
        throw new Error("API call failed.");
      }

      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error calling API:", error);
    } finally {
      setLoading(false)
    }
  }

  function changePreset(p: FormData) {
    setPresetData(p);
  }

  return(
    <>
      <div className="flex flex-row items-center pb-3">
        <span>Load preset data:</span>
        <div className="flex flex-row ml-3 space-x-1">
          {Object.entries(presets).map(([name, preset]) => (
            <Button
              key={name}
              onClick={() => changePreset({ ...preset })}
              className={isEqual(presetData, preset) ? "btn !bg-indigo-800" : "btn"}
            >{name}</Button>
          ))}
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap">
          <div className="w-full lg:w-1/2">
          <Accordion buttonText="Loan information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <NumberInput
                presetData={presetData}
                label="Loan amount"
                unit="kr"
                description="The loan amount the applicant is applying for."
                variableName="loan_amnt"
              />
              <NumberInput
                presetData={presetData}
                label="Term"
                unit="months"
                description="The loan's term in months."
                variableName="term"
              />
            </div>
          </Accordion>
          <Accordion buttonText="Employment and income">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <NumberInput presetData={presetData} label="Annual income" unit="kr" variableName="annual_inc" />
              <NumberInput presetData={presetData} label="Employment length" unit="years" variableName="emp_length" allowNotApplicable />
            </div>
          </Accordion>

          <Accordion buttonText="Credit cards">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <NumberInput presetData={presetData} label="Credit card balance" unit="kr" variableName="bc_bal" />
              <NumberInput presetData={presetData} label="Total credit card limit" unit="kr" variableName="total_bc_limit" />
              <NumberInput
                presetData={presetData}
                label="Credit cards >75%"
                description="The percentage of credit cards, for which the current balance exceeds 75% of the credit card's limit."
                unit="%"
                allowNotApplicable
                variableName="percent_bc_gt_75"
              />
            </div>
          </Accordion>
          </div>

          <div className="w-full lg:w-1/2">
          <Accordion buttonText="Installment loans">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <NumberInput presetData={presetData} label="Initial mortgage" unit="kr" variableName="init_mortgage" />
              <NumberInput presetData={presetData} label="Current mortgage" unit="kr" variableName="mortgage" />
              <NumberInput presetData={presetData} label="Initial student debt" unit="kr" variableName="init_student_loan" />
              <NumberInput presetData={presetData} label="Current student debt" unit="kr" variableName="student_loan" />
              <NumberInput presetData={presetData} label="Initial car loan debt" unit="kr" variableName="init_car_loan" />
              <NumberInput presetData={presetData} label="Current car loan debt" unit="kr" variableName="car_loan" />
              <NumberInput presetData={presetData} label="Initial consumer loan debt" unit="kr" variableName="init_consumer_loan" />
              <NumberInput presetData={presetData} label="Current consumer loan debt" unit="kr" variableName="consumer_loan" />

              <NumberInput
                presetData={presetData}
                label="Total monthly installments"
                unit="kr"
                description="The total amount that the applicant currently pays in installments each month."
                variableName="monthly_installments"
              />
            </div>
          </Accordion>

          <Accordion buttonText="Account information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <NumberInput
                presetData={presetData}
                label="Number of credit accounts"
                description="For example: credit cards, mortgage accounts, consumer loans."
                variableName="total_acc"
              />
              <NumberInput
                presetData={presetData}
                label="Number of satisfied credit accounts"
                description="A credit account is satisfied if it has never been delinquent."
                variableName="num_sats"
              />
            </div>
          </Accordion>

          <Accordion buttonText="Credit history">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <NumberInput presetData={presetData} label="Accounts opened (24m)" variableName="acc_open_past_24mths" />
              <NumberInput presetData={presetData} label="Credit inquiries (6m)" variableName="inq_last_6mths" />
              <NumberInput presetData={presetData} label="Credit history length" unit="months" variableName="credit_history_months" />
              <NumberInput presetData={presetData} label="Last delinquency" allowNotApplicable unit="months ago" variableName="mths_since_last_delinq" />
              <NumberInput presetData={presetData} label="Previous bankruptcies" variableName="pub_rec_bankruptcies" />
              <NumberInput presetData={presetData} label="Delinquencies (24m)" variableName="delinq_2yrs" />
              <NumberInput presetData={presetData} label="Collections (12m)" variableName="collections_12_mths_ex_med" />
            </div>
          </Accordion>
          </div>
        </div>
        
        <div className="flex flex-row items-center mt-2">
          <Button type="submit" disabled={loading} className={loading ? "btn disabled-input" : "btn"}>
            {loading ? "Getting predictions..." : "Predict risk"}
          </Button>
          {(elapsedTime > 0) && (
            <div className="ml-3">
              The API is waking up... {elapsedTime}
              <span className="ml-3 inline-block w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></span>
            </div>
          )}
        </div>
      </form>
    </>
  )
}