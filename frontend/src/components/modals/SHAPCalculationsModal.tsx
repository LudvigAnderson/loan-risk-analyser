import { useState } from "react";
import BaseModal from "./BaseModal";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import UnorderedList from "../core/UnorderedList";

export default function SHAPCalculationsModal() {
  const [isOpen, setIsOpen] = useState(false);

  return(
    <BaseModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      buttonText="Technical details"
      title="Technical details on my SHAP calculations"
      buttonClass="text-sm pr-1 link text-blue-500 hover:text-blue-700 hover:underline cursor-pointer"
    >
      <div>
        <p>The XGBoost model is trained using the Accelerated Failure Time (AFT) survival objective. The event is default, which means that the XGBoost model fits to predict the log of time until default as such:</p>
        <BlockMath math="\ln T = f(\mathbf{x}) + \sigma Z" />
        <p>where</p>
        <div className="py-2">
        <UnorderedList>
          <li><InlineMath math="T" /> is the time until default in months</li>
          <li><InlineMath math="f" /> is the tree ensemble's learned prediction</li>
          <li><InlineMath math="\mathbf{x}" /> is the feature set</li>
          <li><InlineMath math="Z" /> is the error term</li>
        </UnorderedList>
        </div>
        <p>I have chosen for <InlineMath math="Z" /> to be normally distributed, meaning that <InlineMath math="\ln T" /> is normally distributed, and <InlineMath math="T" /> is log-normally distributed.</p>
        <p>For log-normally distributed variables, the median is typically a more descriptive measure than the mean, which is why I use it.</p>
        <p>Because the model's prediction <InlineMath math="\hat{\mu}" /> is the mean of <InlineMath math="\ln T \sim \mathcal{N}(\mu, \sigma^2)" />, that means the predicted median of <InlineMath math="T" /> is <InlineMath math="e^{\hat{\mu}}" />.</p>
        <br />
        <p>Furthermore, the SHAP values for the model generally sum up to equal the prediction:</p>
        <BlockMath math="\ln T = \underbrace{\phi_0}_{\mathclap{\text{Baseline}}} + \sum_{i=1}^{|\mathbf{x}|} \phi_i" />
        <p>Because I want to explain the features' contribution in terms of months and not log-months, I exponentiate both sides:</p>
        <BlockMath math="\exp(\ln T) = \exp\left(\sum_{i=1}^{|\mathbf{x}|} \phi_i\right)" />
        <BlockMath math="\Rightarrow \mathrm{median}(T) = e^{\phi_0 + \phi_1 + \phi_2 + \ldots + \phi_{|\mathbf{x}|}}" />
        <BlockMath math="\Rightarrow \mathrm{median}(T) = \underbrace{e^{\phi_0}}_{\mathclap{\text{Baseline}}} \cdot e^{\phi_1} \cdot e^{\phi_2} \cdot \ldots \cdot e^{\phi_{|\mathbf{x}|}}" />
        <p>As you can see, after exponentiating, the SHAP values can be treated as multipliers to the baseline, and be expressed as % increases or decreases to the baseline, for example:</p>
        <BlockMath math="\phi_0 = 4.248 \Rightarrow e^{\phi_i} \approx 70 \Rightarrow \text{ Baseline median survival time is 70 months.}" />
        <BlockMath math="\phi_i = 0.25 \Rightarrow e^{\phi_i} \approx 1.284 \Rightarrow \phi_i \text{ increases median survival time by 28.4\%}" />
        <BlockMath math="\phi_i = -0.25 \Rightarrow e^{\phi_i} \approx 0.779 \Rightarrow \phi_i \text{ decreases median survival time by 22.1\%}" />
      </div>
    </BaseModal>
  )
}