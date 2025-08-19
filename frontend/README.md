# Frontend

## Overview

![React](https://img.shields.io/badge/React-white?logo=react&logoColor=0088CC)
![TypeScript](https://img.shields.io/badge/TypeScript-white?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-white?logo=tailwindcss)
![Firebase](https://img.shields.io/badge/Firebase%20Hosting-white?logo=firebase&logoColor=DD2C00)

This is a React app hosted on Firebase. It has the following functionality:
- Use data preset buttons to load in data for fictional applicants, or use the input fields directly,
- Get predicted survival time (time until default) for the applicant and see the survival graph with cumulative survival chance for each month,
- See the model's prediction explained by the individual features, grouped under broader categories like _Credit history_,
- See the bank's estimated profit margin on the loan, given the interest rate. The calculation uses the applicant's risk, the bank's costs, CET1 requirement, and target ROE.

## Code locations

| Where is the code for... | You can find it in... |
|--------------------------|-----------------------|
| Survival graph           | `src/components/SurvivalGraph.tsx` |
| Interest rate graph      | `src/components/InterestGraph.tsx` |
| SHAP calculations        | `src/components/SHAPTable.tsx` |
| Interest rate calculations | `src/services/RiskModelling.ts` |