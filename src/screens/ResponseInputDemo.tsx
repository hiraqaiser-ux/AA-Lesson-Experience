/**
 * ResponseInputDemo
 * Shows ResponseInput in all four states (Default, Focus, Filled, Recording)
 * so you can review the DS Input Field visual language in the prototype.
 */
import { useState } from "react";
import { ResponseInput, ResponseInputState } from "../components/ResponseInput";

const STATES: { label: string; state: ResponseInputState; desc: string }[] = [
  {
    label: "Default",
    state: "default",
    desc: "Border secondary-600 · Placeholder secondary-600",
  },
  {
    label: "Focus",
    state: "focus",
    desc: "Border primary-500 (lime) · Cursor in field",
  },
  {
    label: "Filled",
    state: "filled",
    desc: "Border secondary-400 · Value secondary-200 · Send active",
  },
  {
    label: "Recording",
    state: "recording",
    desc: "Border primary-500 · Red pulse dot · Stop button",
  },
];

export function ResponseInputDemo() {
  const [liveValue, setLiveValue] = useState("");

  return (
    <div className="min-h-full bg-background px-24 py-40">
      <div className="mx-auto w-full max-w-[680px] flex flex-col gap-48">

        {/* Header */}
        <div className="flex flex-col gap-8">
          <h1 className="text-xl font-bold text-neutral-0">Response Input</h1>
          <p className="text-md text-secondary-300">
            DS Input Field (6:141) visual language applied to the student
            response textarea — border tokens, radius, shadow, typography.
          </p>
        </div>

        {/* Live interactive */}
        <section className="flex flex-col gap-16">
          <h2 className="text-lg font-medium text-neutral-0">Live — try it</h2>
          <ResponseInput
            label="Your answer"
            placeholder="Type your answer here…"
            value={liveValue}
            onChange={setLiveValue}
            onSend={(v) => { alert(`Sent: ${v}`); setLiveValue(""); }}
            onAttach={() => alert("Attach clicked")}
            onRecord={() => alert("Record clicked")}
            helperText="Press ⌘ Enter to send."
          />
        </section>

        {/* All states static */}
        <section className="flex flex-col gap-24">
          <h2 className="text-lg font-medium text-neutral-0">All states</h2>
          <div className="grid grid-cols-1 gap-32 sm:grid-cols-2">
            {STATES.map(({ label, state, desc }) => (
              <div key={state} className="flex flex-col gap-12">
                <div className="flex items-center gap-8">
                  <span className="text-sm font-medium text-secondary-100">{label}</span>
                  <span className="rounded-full bg-overlay-white-8 px-8 py-4 text-xs text-secondary-400">
                    state="{state}"
                  </span>
                </div>
                <ResponseInput
                  state={state}
                  label={state !== "default" ? "Your answer" : undefined}
                  value={
                    state === "filled"
                      ? "This is a sample typed response."
                      : state === "focus"
                      ? ""
                      : ""
                  }
                  recordingTime="00:12"
                  placeholder="Type your answer…"
                />
                <p className="text-xs text-secondary-500">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* With label + error */}
        <section className="flex flex-col gap-16">
          <h2 className="text-lg font-medium text-neutral-0">With error</h2>
          <ResponseInput
            label="Your answer"
            state="default"
            errorText="This field is required before you can submit."
            placeholder="Type your answer…"
          />
        </section>

        {/* Disabled */}
        <section className="flex flex-col gap-16">
          <h2 className="text-lg font-medium text-neutral-0">Disabled</h2>
          <ResponseInput
            label="Your answer"
            disabled
            value="This response has been submitted."
            placeholder="Type your answer…"
          />
        </section>

      </div>
    </div>
  );
}
