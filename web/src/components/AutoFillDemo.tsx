"use client";

import { useRef, useState } from "react";

const DEMO_VALUES: Record<string, string> = {
  full_name: "Alex Morgan",
  email: "alex.morgan@example.com",
  phone: "+1 415 555 0182",
  company: "Northwind Labs",
  job_title: "Product Designer",
  address: "120 Market Street",
  city: "San Francisco",
  country: "United States",
  summary:
    "I design calm, fast product experiences. Happy to share a portfolio on request.",
};

const FIELD_ORDER = Object.keys(DEMO_VALUES);

export function AutoFillDemo() {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(FIELD_ORDER.map((k) => [k, ""])),
  );
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const timers = useRef<number[]>([]);

  function clearTimers() {
    for (const id of timers.current) window.clearTimeout(id);
    timers.current = [];
  }

  function reset() {
    clearTimers();
    setBusy(false);
    setDone(false);
    setActiveField(null);
    setValues(Object.fromEntries(FIELD_ORDER.map((k) => [k, ""])));
  }

  function runFill() {
    if (busy) return;
    clearTimers();
    setBusy(true);
    setDone(false);
    setValues(Object.fromEntries(FIELD_ORDER.map((k) => [k, ""])));

    FIELD_ORDER.forEach((key, index) => {
      const id = window.setTimeout(() => {
        setActiveField(key);
        setValues((prev) => ({ ...prev, [key]: DEMO_VALUES[key] }));
        if (index === FIELD_ORDER.length - 1) {
          const end = window.setTimeout(() => {
            setActiveField(null);
            setBusy(false);
            setDone(true);
          }, 280);
          timers.current.push(end);
        }
      }, 140 + index * 160);
      timers.current.push(id);
    });
  }

  return (
    <div className="af-demo">
      <div className="af-demo-stage">
        <div className="af-demo-form-wrap">
          <div className="af-demo-form-head">
            <p className="af-demo-kicker">Live demo</p>
            <h3>Job application form</h3>
            <p>
              Starts empty. Press Auto-Fill with AI and every field fills in
              one smooth pass.
            </p>
          </div>
          <form
            className="af-demo-form"
            onSubmit={(e) => e.preventDefault()}
            autoComplete="off"
          >
            {(
              [
                ["full_name", "Full name", "text"],
                ["email", "Email", "email"],
                ["phone", "Phone", "tel"],
                ["company", "Company", "text"],
                ["job_title", "Job title", "text"],
                ["address", "Address", "text"],
                ["city", "City", "text"],
                ["country", "Country", "text"],
              ] as const
            ).map(([name, label, type]) => (
              <label
                key={name}
                className={activeField === name ? "is-filling" : undefined}
              >
                <span>{label}</span>
                <input
                  name={name}
                  type={type}
                  value={values[name]}
                  readOnly
                  placeholder="—"
                />
              </label>
            ))}
            <label
              className={
                activeField === "summary" ? "is-filling af-span-2" : "af-span-2"
              }
            >
              <span>About you</span>
              <textarea
                name="summary"
                rows={3}
                value={values.summary}
                readOnly
                placeholder="—"
              />
            </label>
          </form>
        </div>

        <button
          type="button"
          className={`af-fab${busy ? " is-busy" : ""}${done ? " is-done" : ""}`}
          onClick={runFill}
          disabled={busy}
        >
          <span className="af-fab-dot" aria-hidden />
          {busy ? "Filling…" : done ? "Filled" : "Auto-Fill with AI"}
        </button>
      </div>

      <div className="af-demo-actions">
        <button type="button" className="btn btn-ghost" onClick={reset}>
          Reset demo
        </button>
        <p className="af-demo-note">
          In Chrome, Ranasi fills real pages the same way — from your saved
          profile.
        </p>
      </div>
    </div>
  );
}
