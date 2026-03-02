import { FormEvent, useState } from "react";
import { createTestCase } from "../services/api";
import type { TestStep } from "../types";

const defaultSteps: TestStep[] = [
  { order: 1, action: "goto", value: "https://example-insurance-app.com/quote" },
  { order: 2, action: "fill", selector: "#age", value: "35" },
  { order: 3, action: "fill", selector: "#sumInsured", value: "1000000" },
  { order: 4, action: "click", selector: "#calculatePremium" },
  { order: 5, action: "assert", selector: "#premiumValue", expected: { contains: "15420" } }
];

export default function TestBuilderPage() {
  const [name, setName] = useState("Insurance Premium Validation");
  const [appUrl, setAppUrl] = useState("https://example-insurance-app.com");
  const [stepsJson, setStepsJson] = useState(JSON.stringify(defaultSteps, null, 2));

  const [age, setAge] = useState(35);
  const [sumInsured, setSumInsured] = useState(1000000);
  const [policyType, setPolicyType] = useState("Term");
  const [rider, setRider] = useState("Critical Illness");
  const [premiumExpected, setPremiumExpected] = useState(15420.5);

  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setResult(null);
    setError(null);
    try {
      const steps = JSON.parse(stepsJson);
      const payload = await createTestCase({
        name,
        appUrl,
        insuranceInput: {
          age,
          sumInsured,
          policyType,
          rider,
          premiumExpected
        },
        steps
      });
      setResult(`Created test case ${payload.id}`);
    } catch (err: any) {
      setError(err.message ?? "Failed to create test case");
    }
  }

  return (
    <section className="panel">
      <h2>No-Code Test Builder</h2>
      <form onSubmit={onSubmit} className="builder-form">
        <label>
          Test Case Name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Application URL
          <input value={appUrl} onChange={(e) => setAppUrl(e.target.value)} />
        </label>

        <div className="grid">
          <label>
            Age
            <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} />
          </label>
          <label>
            Sum Insured
            <input
              type="number"
              value={sumInsured}
              onChange={(e) => setSumInsured(Number(e.target.value))}
            />
          </label>
          <label>
            Policy Type
            <input value={policyType} onChange={(e) => setPolicyType(e.target.value)} />
          </label>
          <label>
            Rider
            <input value={rider} onChange={(e) => setRider(e.target.value)} />
          </label>
          <label>
            Premium Expected
            <input
              type="number"
              step="0.01"
              value={premiumExpected}
              onChange={(e) => setPremiumExpected(Number(e.target.value))}
            />
          </label>
        </div>

        <label>
          Steps JSON
          <textarea rows={14} value={stepsJson} onChange={(e) => setStepsJson(e.target.value)} />
        </label>
        <button type="submit">Create Test Case</button>
      </form>

      {result ? <p className="success">{result}</p> : null}
      {error ? <p className="error">{error}</p> : null}
    </section>
  );
}

