import { useState } from "react";
import BaseModal from "./BaseModal";
import UnorderedList from "../core/UnorderedList";
import Accordion from "../core/Accordion";

export default function TechStackModal() {
  const [isOpen, setIsOpen] = useState(false);

  return(
    <BaseModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      buttonText="See my tech stack!"
      title="Tech Stack"
    >
      <div className="flex flex-wrap">
        <Accordion buttonText="ML pipeline:">
          <UnorderedList>
            <li>Python</li>
            <li>Numpy, pandas, scikit-learn</li>
            <li>XGBoost</li>
            <li>Optuna</li>
            <li>EconML (for debiased ML)</li>
            <li>CuPy (for GPU utilization)</li>
          </UnorderedList>
        </Accordion>
        <Accordion buttonText="Backend">
          <UnorderedList>
            <li>Python</li>
            <li>FastAPI</li>
          </UnorderedList>
        </Accordion>
        <Accordion buttonText="Frontend">
          <UnorderedList>
            <li>React</li>
            <li>TypeScript</li>
            <li>Tailwind CSS</li>
            <li>Nivo (d3.js-based visualization library)</li>
          </UnorderedList>
        </Accordion>
        <Accordion buttonText="Google Cloud">
          <UnorderedList>
            <li>Vertex AI</li>
            <li>Cloud Run</li>
            <li>Secret Manager</li>
            <li>Firebase</li>
            <li>Cloud Storage & Artifact Registry</li>
          </UnorderedList>
        </Accordion>
        <Accordion buttonText="Automation">
          <UnorderedList>
            <li>GitHub Actions</li>
          </UnorderedList>
        </Accordion>
      </div>
    </BaseModal>
  )
}