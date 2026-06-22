/**
 * AssignmentView
 *
 * Student view for an assignment with:
 * - Assignment content (image/audio/text-based)
 * - Instructions
 * - ResponseInput component for student to submit answer
 * - Tab navigation (About | Lessons | Discussions | Assignments)
 *
 * Follows the same layout pattern as Lessons and Discussions screens.
 */

import { useState } from "react";
import { ResponseInput } from "../components/ResponseInput";

interface Assignment {
  id: string;
  type: "image" | "audio" | "text";
  title: string;
  instructions: string;
  imageUrl?: string;
  audioUrl?: string;
  textContent?: string;
}

const ASSIGNMENT: Assignment = {
  id: "assign-001",
  type: "image",
  title: "Upload and Analyze an Image",
  instructions: "Please analyze this image:\n1. Identify the Arabic letters\n2. Explain their pronunciation\n3. Provide English meaning",
  imageUrl: "placeholder-image.jpg"
};

const TABS = ["About", "Lessons", "Discussions", "Assignments"];

export function AssignmentView() {
  const [activeTab, setActiveTab] = useState("Assignments");
  const [response, setResponse] = useState("");

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

      {/* ─── Breadcrumb Navigation ─── */}
      <div className="flex items-center gap-16 px-64 py-16 text-sm border-b border-secondary-900">
        <button className="text-secondary-400 hover:text-secondary-300">
          ‹ Back
        </button>
        <div className="h-4 w-px bg-secondary-700" />
        <span className="font-semibold text-neutral-0">Section 1</span>
        <div className="h-4 w-px bg-secondary-700" />
        <span className="text-secondary-300">{ASSIGNMENT.type === "image" ? "Image Assignment" : "Audio Assignment"}</span>
      </div>

      {/* ─── Main Content ─── */}
      <div className="flex-1 overflow-y-auto px-64 py-32">
        <div className="mx-auto w-full max-w-[1100px] flex flex-col gap-24">

          {/* ─── Assignment Title ─── */}
          <h1 className="text-xl font-semibold text-neutral-0">
            {ASSIGNMENT.title}
          </h1>

          {/* ─── Assignment Content (Image) ─── */}
          <div className="rounded-lg bg-surface-dark p-24 flex flex-col gap-12">
            <div className="relative bg-secondary-1000 rounded-8 aspect-video flex items-center justify-center">
              <div className="text-center text-secondary-500">
                {ASSIGNMENT.type === "image" && (
                  <>
                    <div className="text-48 mb-8">📷</div>
                    <p className="text-sm">Student uploaded image</p>
                  </>
                )}
                {ASSIGNMENT.type === "audio" && (
                  <>
                    <div className="text-48 mb-8">🎵</div>
                    <p className="text-sm">Audio file uploaded</p>
                  </>
                )}
              </div>
            </div>
            <p className="text-xs text-secondary-500">
              Student uploaded image of Arabic text
            </p>
          </div>

          {/* ─── Instructions ─── */}
          <div className="flex flex-col gap-8">
            <h2 className="text-md font-semibold text-neutral-0">
              Instructions
            </h2>
            <p className="text-md text-secondary-300 leading-6 whitespace-pre-line">
              {ASSIGNMENT.instructions}
            </p>
          </div>

          {/* ─── Response Section ─── */}
          <div className="flex flex-col gap-16">
            <ResponseInput
              label="Your Answer"
              placeholder="Type your response here…"
              value={response}
              onChange={setResponse}
              onSend={(value) => {
                alert(`Response submitted: ${value}`);
                setResponse("");
              }}
              onAttach={() => alert("Attach file")}
              onRecord={() => alert("Start recording")}
              helperText="Press ⌘ Enter to submit your response."
            />
          </div>

        </div>
      </div>
    </div>
  );
}
