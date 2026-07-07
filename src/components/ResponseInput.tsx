/**
 * ResponseInput
 *
 * A multi-line student-response field derived from the DS Input Field (node 6:141).
 * Visual language is identical to the DS component:
 *   • border-secondary-600 (default) → secondary-400 (hover) → primary-500 (focus)
 *   • rounded-sm (8px), drop-shadow-xs, secondary-600 placeholder, secondary-100 value
 *   • Optional label above and helper / error text below
 *
 * Adds response-specific features on top of the DS base:
 *   • Multi-line textarea (grows with content)
 *   • Inline toolbar: Attach · Mic (or Stop when recording) · Send
 *   • States: default | focus | filled | recording
 *
 * Rules:
 *   • All colors via tokens — no hardcoded hex
 *   • All spacing on the 4px grid
 *   • DS Input Field node (41405:27) is NOT modified
 */

import { useState, useRef, useCallback } from "react";
import { Icon } from "./Icon";
import type { IconName } from "./Icon";
import { MAX_TEXT_LENGTH } from "../data/discussions";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ResponseInputState = "default" | "focus" | "filled" | "recording";

export interface ResponseInputProps {
  /** Optional label rendered above the input (DS: secondary-100, medium) */
  label?: string;
  /** Textarea placeholder text */
  placeholder?: string;
  /** Controlled value */
  value?: string;
  /** Callback fired on every keystroke */
  onChange?: (value: string) => void;
  /** Fired when the send button is clicked */
  onSend?: (value: string) => void;
  /** Fired when the attach (paperclip) icon is clicked (used only if no image handler) */
  onAttach?: () => void;
  /** Preview src of a pending image attachment — shows a thumbnail chip in the field */
  attachmentPreview?: string;
  /** Fired with the chosen File when the user picks an image via the paperclip */
  onAttachImage?: (file: File) => void;
  /** Fired when the user removes the pending image attachment */
  onRemoveAttachment?: () => void;
  /** Fired when the mic icon is clicked (starts recording) */
  onRecord?: () => void;
  /** Fired when the stop icon is clicked (ends recording) */
  onStopRecording?: () => void;
  /** Elapsed recording time displayed in the recording state, e.g. "00:12" */
  recordingTime?: string;
  /**
   * Externally override the visual state.
   * Omit to let the component manage state automatically from interaction.
   */
  state?: ResponseInputState;
  /** Helper text shown below the field in the default / filled states */
  helperText?: string;
  /** Error message; shown below the field and turns border to error red */
  errorText?: string;
  /** Disables the entire input */
  disabled?: boolean;
  className?: string;
}

// ─── Border colour mapping ────────────────────────────────────────────────────

function borderClass(
  state: ResponseInputState,
  hasError: boolean,
  isHovered: boolean
): string {
  // Per DS Input Field: focus / filled / recording / hover all use secondary-400.
  // The border is never green — only the Send button turns green when filled.
  if (hasError) return "border-error";
  if (state === "recording") return "border-secondary-400";
  if (state === "focus") return "border-secondary-400";
  if (state === "filled") return "border-secondary-400";
  if (isHovered) return "border-secondary-400";
  return "border-secondary-600";
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ResponseInput({
  label,
  placeholder = "Type your answer…",
  value: externalValue,
  onChange,
  onSend,
  onAttach,
  attachmentPreview,
  onAttachImage,
  onRemoveAttachment,
  onRecord,
  onStopRecording,
  recordingTime = "00:00",
  state: externalState,
  helperText,
  errorText,
  disabled = false,
  className = "",
}: ResponseInputProps) {
  // Internal value — used when uncontrolled
  const [internalValue, setInternalValue] = useState("");
  const [internalState, setInternalState] = useState<ResponseInputState>("default");
  const [isHovered, setIsHovered] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resolve controlled vs uncontrolled
  const value = externalValue !== undefined ? externalValue : internalValue;
  const state = externalState !== undefined ? externalState : internalState;

  const hasError = Boolean(errorText);
  const isRecording = state === "recording";
  const hasAttachment = Boolean(attachmentPreview);
  const isFilled = value.trim().length > 0;
  // Send is enabled with text, a pending image, or while recording.
  const canSend = isFilled || isRecording || hasAttachment;

  // Auto-grow textarea
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const next = e.target.value;
      if (externalValue === undefined) setInternalValue(next);
      onChange?.(next);
      if (externalState === undefined) {
        setInternalState(next.length > 0 ? "filled" : "focus");
      }
      // Reset height then set to scrollHeight so it grows naturally
      const el = e.target;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    },
    [externalValue, externalState, onChange]
  );

  const handleFocus = () => {
    if (externalState === undefined && !isRecording) {
      setInternalState(value.length > 0 ? "filled" : "focus");
    }
  };

  const handleBlur = () => {
    if (externalState === undefined) {
      setInternalState(value.length > 0 ? "filled" : "default");
    }
  };

  const handleSend = () => {
    if (!canSend) return;
    onSend?.(value);
    if (externalValue === undefined) setInternalValue("");
    if (externalState === undefined) setInternalState("default");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  // Paperclip → open the native image picker when an image handler is provided,
  // otherwise fall back to the generic onAttach callback.
  const handleAttachClick = () => {
    if (onAttachImage) fileInputRef.current?.click();
    else onAttach?.();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onAttachImage?.(file);
    // Reset so picking the same file again still fires a change event.
    e.target.value = "";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd/Ctrl + Enter sends
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Layout ────────────────────────────────────────────────────────────────

  const border = borderClass(state, hasError, isHovered);

  return (
    <div className={`flex flex-col gap-8 ${className}`}>

      {/* ── Label (DS: secondary-100, medium, 16px) ── */}
      {label && (
        <label className="text-md font-medium text-secondary-100 leading-5">
          {label}
        </label>
      )}

      {/* ── Input container ─────────────────────────────────────────────── */}
      {/*
        DS Input Field container:
          border border-secondary-600  (default)
          rounded-sm (8px)
          drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]
          bg-background (inherits dark page bg — same as DS on dark canvas)
          overflow-hidden
      */}
      {/* Hidden native picker — opened by the paperclip when an image handler is set */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Single row: [attachment] + text/recording (grows) + toolbar (inline, right) */}
      <div
        className={[
          "flex items-center gap-12 border rounded-sm p-16 transition-all duration-150",
          "drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]",
          "bg-background",
          border,
          disabled ? "opacity-40 pointer-events-none" : "",
        ].join(" ")}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Pending image attachment — thumbnail with a remove control */}
        {hasAttachment && !isRecording && (
          <div className="relative shrink-0">
            <img
              src={attachmentPreview}
              alt="Attachment preview"
              className="size-40 rounded-sm border border-secondary-700 object-cover"
            />
            <button
              type="button"
              aria-label="Remove attachment"
              onClick={onRemoveAttachment}
              className="absolute -right-4 -top-4 grid size-16 place-items-center rounded-full bg-secondary-1000 text-neutral-0 ring-1 ring-secondary-600 transition-colors hover:bg-secondary-900"
            >
              <Icon name="x" size={10} />
            </button>
          </div>
        )}

        {isRecording ? (
          <div className="flex min-w-0 flex-1 items-center gap-8">
            <span className="relative flex h-8 w-8 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75" />
              <span className="relative inline-flex h-8 w-8 rounded-full bg-error" />
            </span>
            <span className="text-md text-secondary-100">
              Recording…{" "}
              <span className="font-medium tabular-nums text-primary-500">{recordingTime}</span>
            </span>
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={MAX_TEXT_LENGTH}
            rows={1}
            aria-label={label ?? "Response input"}
            aria-invalid={hasError}
            aria-describedby={
              errorText ? "response-input-error" : helperText ? "response-input-helper" : undefined
            }
            style={{ resize: "none" }}
            className={[
              "min-w-0 flex-1 max-h-[120px] bg-transparent text-md leading-6 outline-none",
              "placeholder:text-secondary-600",
              state === "focus"
                ? "text-secondary-100"
                : state === "filled"
                ? "text-secondary-200"
                : "text-secondary-600",
            ].join(" ")}
          />
        )}

        {/* Toolbar — inline on the right */}
        <div className="flex shrink-0 items-center gap-4">
          <ToolbarIconButton
            icon="paperclip"
            label="Attach image"
            onClick={handleAttachClick}
            disabled={disabled || isRecording}
          />
          {isRecording ? (
            <ToolbarIconButton
              icon="square"
              label="Stop recording"
              onClick={onStopRecording}
              active
              activeColor="text-error"
            />
          ) : (
            <ToolbarIconButton
              icon="mic"
              label="Record audio"
              onClick={onRecord}
              disabled={disabled}
            />
          )}
          <SendButton active={canSend} onClick={handleSend} disabled={disabled} />
        </div>
      </div>

      {/* ── Helper / Error text + character counter ── */}
      <div className="flex items-center justify-between gap-8">
        <div className="min-w-0">
          {errorText ? (
            <p id="response-input-error" role="alert" className="text-sm text-error leading-5">
              {errorText}
            </p>
          ) : helperText ? (
            <p id="response-input-helper" className="text-sm text-secondary-400 leading-5">
              {helperText}
            </p>
          ) : null}
        </div>
        {!isRecording && (
          <span className="shrink-0 text-sm tabular-nums text-secondary-500">
            {value.length}/{MAX_TEXT_LENGTH}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface ToolbarIconButtonProps {
  icon: IconName;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  activeColor?: string;
}

function ToolbarIconButton({
  icon,
  label,
  onClick,
  disabled = false,
  active = false,
  activeColor = "text-primary-500",
}: ToolbarIconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={[
        "flex items-center justify-center w-32 h-32 rounded-sm",
        "transition-colors duration-150 focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1",
        "focus-visible:ring-offset-background",
        disabled
          ? "text-secondary-700 cursor-not-allowed"
          : active
          ? `${activeColor} hover:bg-overlay-white-8`
          : "text-secondary-400 hover:text-secondary-200 hover:bg-overlay-white-8",
      ].join(" ")}
    >
      <Icon name={icon} size={18} />
    </button>
  );
}

interface SendButtonProps {
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function SendButton({ active, onClick, disabled = false }: SendButtonProps) {
  return (
    <button
      type="button"
      aria-label="Send response"
      onClick={onClick}
      disabled={disabled || !active}
      className={[
        "flex items-center justify-center w-32 h-32 rounded-full",
        "transition-all duration-150 focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1",
        "focus-visible:ring-offset-background",
        active && !disabled
          ? "bg-primary-500 text-neutral-1000 hover:bg-primary-400 active:scale-95"
          : "bg-secondary-800 text-secondary-600 cursor-not-allowed",
      ].join(" ")}
    >
      <Icon name="arrow-up" size={18} />
    </button>
  );
}
