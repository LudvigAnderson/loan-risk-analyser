import { useState } from "react";
import BaseModal from "./BaseModal";
import Accordion from "../core/Accordion";
import UnorderedList from "../core/UnorderedList";

export default function SkillsModal() {
  const [isOpen, setIsOpen] = useState(false);

  return(
    <BaseModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      buttonText="Skills illustrated by this project"
      title="Skills"
    >
      <div className="flex flex-wrap">
        <Accordion buttonText="Full Stack">
          <p>This project encompasses:</p>
          <UnorderedList>
            <li>Model training</li>
            <li>Automation</li>
            <li>Cloud Development</li>
            <li>Backend</li>
            <li>Frontend</li>
          </UnorderedList>
        </Accordion>
        <Accordion buttonText="Cloud Cost Optimization (FinOps)">
          <UnorderedList>
            <li>Cut ML training costs by optimizing training for GPU acceleration and using fast, vectorized operations.</li>
            <li>Set up Google Cloud to automatically delete old Docker images, reducing the cost of storage.</li>
            <li>Implemented multi-stage Docker builds to minimize image size, reducing the cost of storage and cold start times.</li>
          </UnorderedList>
        </Accordion>
        <Accordion buttonText="Statistics">
          <UnorderedList>
            <li>Survival analysis with Accelerated Failure Time (AFT) model, including censoring and event handling.</li>
            <li>Double/debiased machine learning (DML) for causal inference using EconML.</li>
          </UnorderedList>
        </Accordion>
        <Accordion buttonText="Machine learning">
          <UnorderedList>
            <li>Training XGBoost models and hyperparameter optimization with Optuna.</li>
            <li>Feature engineering and creation to increase generalizability.</li>
            <li>Optimizing models for explainability with SHAP values.</li>
          </UnorderedList>
        </Accordion>
      </div>
    </BaseModal>
  )
}