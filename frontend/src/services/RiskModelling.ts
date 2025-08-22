import { adjustedMuLogT, cumulativeSum, discretePDF } from "./Statistics";

export interface MinIntRateParams {
  costOfFunds: number;
  operatingCosts: number;
  riskWeight: number;
  targetROE: number;
  requiredCET1: number;
}

export interface ExpectedLossParams {
  loanAmount: number;
  term: number;
  mu: number;
  sigma?: number;
  intRate: number;
  causalEffect: number;
}

function monthlyPayment(P: number, annualRate: number, n: number): number {
  const r = annualRate / 12;
  const M = P * (r * (1 + r)**n) / ((1 + r)**n - 1);
  return M;
}

function principalPayments(P: number, annualRate: number, n: number): number[] {
  const r = annualRate / 12;
  const M = monthlyPayment(P, annualRate, n);

  const principalParts = [0]; // No payment in the first month

  let outstanding = P;
  for (let t = 1; t <= n; t++) {
    const interestPart = outstanding * r;
    const principalPart = M - interestPart;
    principalParts.push(principalPart);
    outstanding -= principalPart;
  }

  return principalParts;
}

export function expectedLoss({ loanAmount, term, mu, sigma = 1, intRate, causalEffect }: ExpectedLossParams): number {
  const months = Array.from({ length: term + 1 }, (_, i) => i);
  const adjustedMu = adjustedMuLogT(mu, intRate*100, causalEffect, term, sigma); // the causal effect currently assumes interest percentage points
  const principals = principalPayments(loanAmount, intRate, term); // [0, p_1, p_2, ...]
  const cumulativePrincipals = cumulativeSum(principals) // [0, 0+p_1, 0+p_1+p_2, ...]

  const defaultRatePerMonth = months.map(t => discretePDF(t, adjustedMu, sigma));
  const remainingPrincipalPerMonth = cumulativePrincipals.map(p => loanAmount - p);

  const exLoss = defaultRatePerMonth.reduce(
    (sum, pDefault, i) => sum + pDefault * remainingPrincipalPerMonth[i],
    0
  );

  return exLoss;
}


export function minIntRate(
  {
    loanAmount,
    term,
    mu,
    sigma = 1,
    intRate,
    causalEffect
  }: ExpectedLossParams,
  {
      costOfFunds,
      operatingCosts,
      riskWeight = 1.0,
      targetROE = 0.14,
      requiredCET1 = 0.166,
  }: MinIntRateParams
) {
  const exLoss = expectedLoss({ loanAmount, term, mu, sigma, intRate, causalEffect });
  const exLossPerYear = exLoss / (term / 12) // term is given in months;
  const yearlyRiskCost = exLossPerYear / loanAmount;

  const equityCost = riskWeight * requiredCET1 * targetROE

  const totalYearlyCost = costOfFunds +
                          operatingCosts +
                          equityCost +
                          yearlyRiskCost
  return totalYearlyCost;
}