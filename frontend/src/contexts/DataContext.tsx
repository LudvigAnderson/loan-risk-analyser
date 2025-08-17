import React, { createContext, useState } from "react";
import type { ReactNode } from "react";

interface DataProviderProps {
  children: ReactNode;
}

interface DataProps {
  median_survival_time: number;
  causal_effect: number;
  base_value: number;
  shap_values: { [key: string]: number; };
  raw_data: { [key: string]: number; };
  transformed_data: { [key: string]: number; };
}

interface DataContextProps {
  data: DataProps | undefined;
  setData: React.Dispatch<React.SetStateAction<DataProps | undefined>>;
}

export const DataContext = createContext<DataContextProps | undefined>(undefined);

export function DataProvider({ children }: DataProviderProps) {
  const [data, setData] = useState<DataProps | undefined>(undefined);

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  )
}