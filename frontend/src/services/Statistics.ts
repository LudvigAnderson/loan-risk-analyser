import { erf } from "mathjs"

function normalCDF(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

// Uses precomputed coefficients to approximate the normal inverse CDF.
// I adapted this from StackOverflow user DeepSpace101's answer here: https://stackoverflow.com/questions/8816729/javascript-equivalent-for-inverse-normal-function-eg-excels-normsinv-or-nor
// I used ChatGPT to better understand the algorithm, and it helped me write a more legible version.
function normalInvCDF(p: number): number {
  if (p <= 0 || p >= 1) {
    const epsilon = 1e-10
    p = Math.min(Math.max(p, epsilon), 1 - epsilon);
  }

  const a1 = -39.6968302866538,
        a2 = 220.946098424521,
        a3 = -275.928510446969,
        a4 = 138.357751867269,
        a5 = -30.6647980661472,
        a6 = 2.50662827745924;

  const b1 = -54.4760987982241,
        b2 = 161.585836858041,
        b3 = -155.698979859887,
        b4 = 66.8013118877197,
        b5 = -13.2806815528857;

  const c1 = -0.00778489400243029,
        c2 = -0.322396458041136,
        c3 = -2.40075827716184,
        c4 = -2.54973253934373,
        c5 = 4.37466414146497,
        c6 = 2.93816398269878;

  const d1 = 0.00778469570904146,
        d2 = 0.32246712907004,
        d3 = 2.445134137143,
        d4 = 3.75440866190742;

  const plow = 0.02425;
  const phigh = 1 - plow;
  let q, r;

  if (p < plow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c1*q + c2)*q + c3)*q + c4)*q + c5)*q + c6) /
           ((((d1*q + d2)*q + d3)*q + d4)*q + 1);
  } else if (p > phigh) {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c1*q + c2)*q + c3)*q + c4)*q + c5)*q + c6) /
            ((((d1*q + d2)*q + d3)*q + d4)*q + 1);
  } else {
    q = p - 0.5;
    r = q * q;
    return (((((a1*r + a2)*r + a3)*r + a4)*r + a5)*r + a6)*q /
           (((((b1*r + b2)*r + b3)*r + b4)*r + b5)*r + 1);
  }
}

export function lognormalCDF(x: number, mu: number, sigma: number = 1): number {
  if (x <= 0) return 0;
  const z = (Math.log(x) - mu) / sigma
  return normalCDF(z)
}

export function lognormalSF(x: number, mu: number, sigma: number = 1): number {
  return 1 - lognormalCDF(x, mu, sigma);
}

export function lognormalPDF(x: number, mu: number, sigma: number = 1): number {
  if (x <= 0) return 0;
  const coeff = 1 / (x * sigma * Math.sqrt(2*Math.PI));
  const exponent = -Math.pow(Math.log(x) - mu, 2) / (2 * sigma ** 2);
  return coeff * Math.exp(exponent);
}

export function discretePDF(x: number, mu: number, sigma: number = 1): number {
  return lognormalCDF(x, mu, sigma) - lognormalCDF(x-1, mu, sigma);
}

export function muLogTToExT(muLogT: number, sigma: number = 1): number {
  return Math.exp(muLogT + (sigma**2) / 2);
}

export function exTToMuLogT(exT: number, sigma: number = 1): number {
  return Math.log(exT) - (sigma**2) / 2;
}

// Considers CDF at term to be the predicted default chance,
// adjusts for the effect of interest rate and calculates new mu
export function adjustedMuLogT(
  oldMuLogT: number,
  intRate: number,
  causalEffect: number,
  term: number,
  sigma: number = 1
): number {
  const baseDefaultChance = lognormalCDF(term, oldMuLogT, sigma);
  const defaultChanceIncrease = intRate * causalEffect;
  const newDefaultChance = baseDefaultChance + defaultChanceIncrease;

  return Math.log(term) - sigma * normalInvCDF(newDefaultChance);
}

// This elegant solution was adapted from https://stackoverflow.com/questions/20477177/creating-an-array-of-cumulative-sum-in-javascript
export function cumulativeSum(array: number[]): number[] {
  const cumsum = ((sum: number) => (value: number) => sum += value)(0);
  return array.map(cumsum);
}