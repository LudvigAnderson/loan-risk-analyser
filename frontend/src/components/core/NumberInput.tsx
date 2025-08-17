import { useState, useContext, useEffect } from "react";
import type { ChangeEvent, InputHTMLAttributes } from "react";
import { Input, Field, Label } from "@headlessui/react";

import Tooltip from "./Tooltip";
import FormDisabledContext from "../../contexts/FormDisabledContext";
import type { FormData } from "../../presets/DataPresets";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  variableName: keyof FormData;
  unit?: string;
  allowNotApplicable?: boolean
  description?: string;
  decimalPlaces?: number;
  presetData: FormData;
}

const formatter = new Intl.NumberFormat("nb-NO");

export default function NumberInput({
  label,
  variableName,
  unit,
  allowNotApplicable,
  description,
  decimalPlaces=2,
  presetData,
  className="",
  ...props 
}: InputFieldProps) {
  const [rawValue, setRawValue] = useState<string | null>("");
  const [isNA, setIsNA] = useState(false);
  const isDisabled = useContext(FormDisabledContext);

  useEffect(() => {
    const v = presetData[variableName];
    setRawValue(v != null ? v.toString() : null);
  }, [presetData])

  function formatNumber(value: string | null): string {
    if (value == null) return "N/A";

    const parts = value.split(".");
    const formattedInteger = formatter.format(Number(parts[0]));

    if (parts.length > 1) {
      return formattedInteger + "," + parts[1].slice(0, decimalPlaces);
    }
    
    if (value.endsWith(".")) {
      return formattedInteger + ",";
    }

    return formattedInteger;
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const input = e.target.value;
    let numericString = input.replace(/[^\d.,]/g, "");
    while ((numericString.match(/[.,]/g) || []).length > 1) {
      numericString = numericString.replace(/[.,]/, "");
    }
    numericString = numericString.replace(",", ".");
    setRawValue(numericString);
  }

  function handleNAChange(e: ChangeEvent<HTMLInputElement>) {
    const checked = e.target.checked;
    setIsNA(checked);
    if (checked) {
      setRawValue(null)
    } else {
      setRawValue("0")
    }
  }
  
  return (
    <Field as="div" className="px-4 py-2">
      <Tooltip comment={description}>
        <Label
          htmlFor={variableName}
          className="block font-medium"
        >
          {label}
          {allowNotApplicable && (
            <Label className="inline-flex items-center space-x-1 cursor-pointer select-none pl-2">
              <Input
                type="checkbox"
                checked={isNA}
                onChange={handleNAChange}
                className="cursor-pointer"
              />
              <span className="text-sm text-gray-400">N/A</span>
            </Label>
          )}
        </Label>
      </Tooltip>
      
      <div className="flex items-center space-x-2">
        <Input
          disabled={isDisabled}
          readOnly={isNA}
          value={formatNumber(rawValue)}
          onChange={handleChange}
          name={variableName}
          className={
            "block w-32 rounded-md bg-white/5 px-3 py-2 " +
            "text-base outline-1 -outline-offset-1 " +
            "focus:outline-2 focus:-outline-offset-2 " +
            (isNA ? "disabled-input " : "") +
            className
          }
          {...props}
        />
        {unit && <span className="text-sm text-gray-400">{unit}</span>}
      </div>
    </Field>
  )
}