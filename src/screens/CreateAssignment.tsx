/**
 * CreateAssignment
 *
 * Teacher view for creating assignments with:
 * - Assignment type selection (Image / Audio / Text)
 * - Upload area or text input based on type
 * - Instructions input
 * - Student response type configuration (Text / Audio / Image)
 * - Submit button
 *
 * Follows the same layout pattern as other course screens.
 */

import { useState } from "react";
import { Icon } from "../components/Icon";

type AssignmentType = "image" | "audio" | "text";

interface AssignmentForm {
  type: AssignmentType;
  title: string;
  instructions: string;
  responseTypes: {
    text: boolean;
    audio: boolean;
    image: boolean;
  };
  file?: File;
}

const TABS = ["About", "Lessons", "Discussions", "Assignments"];

export function CreateAssignment() {
  const [activeTab, setActiveTab] = useState("Assignments");
  const [form, setForm] = useState<AssignmentForm>({
    type: "image",
    title: "",
    instructions: "",
    responseTypes: { text: true, audio: true, image: true }
  });

  const handleTypeChange = (type: AssignmentType) => {
    setForm(f => ({ ...f, type }));
  };

  const handleResponseTypeChange = (key: keyof AssignmentForm["responseTypes"]) => {
    setForm(f => ({
      ...f,
      responseTypes: { ...f.responseTypes, [key]: !f.responseTypes[key] }
    }));
  };

  const handleSubmit = () => {
    console.log("Assignment created:", form);
    alert("Assignment created successfully!");
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* ─── Tab Navigation ─── */}
      <nav className="border-b border-secondary-900 px-64">
        <div className="flex gap-32 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={[
                "py-12 text-14 font-medium transition-colors",
                activeTab === tab
                  ? "text-neutral-0 border-b-2 border-primary-500"
                  : "text-secondary-300 hover:text-secondary-200"
              ].join(" ")}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* ─── Header ─── */}
      <div className="border-b border-secondary-900 px-64 py-16">
        <h2 className="text-md font-semibold text-primary-500">
          + Create New Assignment
        </h2>
      </div>

      {/* ─── Main Content ─── */}
      <div className="flex-1 overflow-y-auto px-64 py-32">
        <div className="mx-auto w-full max-w-[1100px] flex flex-col gap-24">

          {/* ─── Assignment Type Selection ─── */}
          <fieldset className="flex flex-col gap-12">
            <label className="text-md font-semibold text-neutral-0">
              Assignment Type
            </label>
            <div className="flex flex-col gap-8">
              {[
                { value: "image" as const, label: "Image-based", desc: "Upload image (1MB max)" },
                { value: "audio" as const, label: "Audio-based", desc: "Upload audio MP3 (1MB max)" },
                { value: "text" as const, label: "Text-based", desc: "Write instructions (5K chars)" }
              ].map(opt => (
                <label
                  key={opt.value}
                  className={[
                    "flex items-center gap-12 rounded-8 px-16 py-12 cursor-pointer border transition-all",
                    form.type === opt.value
                      ? "bg-overlay-green-subtle border-primary-500"
                      : "bg-surface border-secondary-700 hover:border-secondary-600"
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    name="type"
                    value={opt.value}
                    checked={form.type === opt.value}
                    onChange={e => handleTypeChange(e.target.value as AssignmentType)}
                    className="hidden"
                  />
                  <span className={[
                    "text-16 flex-shrink-0",
                    form.type === opt.value ? "text-primary-500" : "text-secondary-600"
                  ].join(" ")}>
                    {form.type === opt.value ? "✓" : "○"}
                  </span>
                  <div className="flex flex-col gap-2 flex-1">
                    <span className="text-md font-medium text-neutral-0">
                      {opt.label}
                    </span>
                    <span className="text-sm text-secondary-500">
                      {opt.desc}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </fieldset>

          {/* ─── Title Input ─── */}
          <fieldset className="flex flex-col gap-8">
            <label className="text-md font-semibold text-neutral-0">
              Assignment Title
            </label>
            <input
              type="text"
              placeholder="e.g., Analyze an Image"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className={[
                "px-16 py-12 bg-surface rounded-8 border text-neutral-0 placeholder:text-secondary-600",
                "border-secondary-600 focus:border-primary-500 focus:outline-none transition-colors"
              ].join(" ")}
            />
          </fieldset>

          {/* ─── Upload / Content Area ─── */}
          <fieldset className="flex flex-col gap-8">
            <label className="text-md font-semibold text-neutral-0">
              {form.type === "image" ? "Upload Image" : form.type === "audio" ? "Upload Audio" : "Content"}
            </label>
            {form.type === "text" ? (
              <textarea
                placeholder="Enter your assignment content (up to 5000 characters)..."
                maxLength={5000}
                rows={6}
                className={[
                  "px-16 py-12 bg-surface rounded-8 border text-neutral-0 placeholder:text-secondary-600",
                  "border-secondary-600 focus:border-primary-500 focus:outline-none transition-colors",
                  "resize-none font-mono text-sm"
                ].join(" ")}
              />
            ) : (
              <div className={[
                "border-2 border-dashed rounded-12 p-24 text-center cursor-pointer transition-colors",
                "border-secondary-600 hover:border-primary-500 hover:bg-overlay-white-4"
              ].join(" ")}>
                <Icon name={form.type === "image" ? "file" : "volume"} size={32} className="mx-auto mb-12 text-secondary-400" />
                <p className="text-sm font-medium text-secondary-300">
                  Drag and drop or click to upload
                </p>
                <p className="text-xs text-secondary-500 mt-4">
                  {form.type === "image" ? "PNG, JPG (max 1MB)" : "MP3 (max 1MB)"}
                </p>
              </div>
            )}
          </fieldset>

          {/* ─── Instructions ─── */}
          <fieldset className="flex flex-col gap-8">
            <label className="text-md font-semibold text-neutral-0">
              Instructions
            </label>
            <textarea
              placeholder="Provide clear instructions for the student..."
              rows={4}
              className={[
                "px-16 py-12 bg-surface rounded-8 border text-neutral-0 placeholder:text-secondary-600",
                "border-secondary-600 focus:border-primary-500 focus:outline-none transition-colors",
                "resize-none"
              ].join(" ")}
              value={form.instructions}
              onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))}
            />
          </fieldset>

          {/* ─── Student Response Types ─── */}
          <fieldset className="flex flex-col gap-12">
            <label className="text-md font-semibold text-neutral-0">
              Students Can Submit
            </label>
            <div className="flex gap-24">
              {["text", "audio", "image"].map(type => (
                <label
                  key={type}
                  className="flex items-center gap-8 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={form.responseTypes[type as keyof typeof form.responseTypes]}
                    onChange={() => handleResponseTypeChange(type as keyof typeof form.responseTypes)}
                    className="hidden"
                  />
                  <span className={[
                    "text-16",
                    form.responseTypes[type as keyof typeof form.responseTypes]
                      ? "text-primary-500"
                      : "text-secondary-600"
                  ].join(" ")}>
                    {form.responseTypes[type as keyof typeof form.responseTypes] ? "✓" : "○"}
                  </span>
                  <span className="text-md font-medium text-secondary-300 capitalize">
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* ─── Submit Button ─── */}
          <div className="flex gap-12 pt-8">
            <button
              onClick={handleSubmit}
              className={[
                "px-24 py-12 rounded-full font-semibold transition-all",
                form.title.trim() && form.instructions.trim()
                  ? "bg-primary-500 text-neutral-1000 hover:bg-primary-400 active:scale-95"
                  : "bg-secondary-800 text-secondary-600 cursor-not-allowed"
              ].join(" ")}
            >
              Create Assignment
            </button>
            <button
              className="px-24 py-12 rounded-full font-semibold text-secondary-300 hover:text-secondary-200 transition-colors"
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
