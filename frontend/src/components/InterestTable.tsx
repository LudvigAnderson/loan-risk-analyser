import NumberInput from "./core/NumberInput";



export default function InterestTable() {

  return (
    <div>
      <p>These are the numbers that I've used in the calculations, but I have not yet finished implementing this part, so the inputs are disabled for now.</p>
      <NumberInput
        label="Cost of Funds"
        unit="%"
        defaultValue="4"
        disabled={true}
        className="disabled-input"
      />
      <NumberInput
        label="Operating costs"
        unit="%"
        defaultValue="2"
        disabled={true}
        className="disabled-input"
      />
      <NumberInput
        label="Risk weight"
        unit="%"
        defaultValue="100"
        disabled={true}
        className="disabled-input"
      />
      <NumberInput
        label="Required CET1 ratio"
        unit="%"
        defaultValue="16.6"
        disabled={true}
        className="disabled-input"
      />
      <NumberInput
        label="Target ROE"
        unit="%"
        defaultValue="14"
        disabled={true}
        className="disabled-input"
      />
    </div>
  )
}