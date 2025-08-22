import React, { createContext, useState } from "react";
import type { ReactNode } from "react";


interface InterestDataProviderProps {
  children: ReactNode;
}

export interface InterestDataProps {
  costOfFunds: number;
  operatingCosts: number;
  riskWeight: number;
  requiredCET1Ratio: number;
  targetROE: number;
}

interface InterestDataContextProps {
  interestData: InterestDataProps;
  setInterestData: React.Dispatch<React.SetStateAction<InterestDataProps>>;
}

export interface InterestRateProviderProps {
  children: ReactNode;
} 

interface InterestRateProps {
  interestRate: number | null;
  setInterestRate: React.Dispatch<React.SetStateAction<number | null>>;
}

export const InterestDataContext = createContext<InterestDataContextProps | undefined>(undefined);

export function InterestDataProvider({ children }: InterestDataProviderProps) {
  const [interestData, setInterestData] = useState<InterestDataProps>({
    costOfFunds: 4,
    operatingCosts: 2,
    riskWeight: 100,
    requiredCET1Ratio: 16.6,
    targetROE: 14,
  });

  return (
    <InterestDataContext.Provider value={{ interestData, setInterestData }}>
      {children}
    </InterestDataContext.Provider>
  )
}

export const InterestRateContext = createContext<InterestRateProps | undefined>(undefined);

export function InterestRateProvider({ children }: InterestRateProviderProps) {
  const [interestRate, setInterestRate] = useState<number | null>(null);

  return (
    <InterestRateContext.Provider value={{ interestRate, setInterestRate }}>
      {children}
    </InterestRateContext.Provider>
  )
}