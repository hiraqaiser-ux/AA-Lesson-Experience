import { Button } from "./Button";

export function FinishWatchingModal({
  open,
  onContinue,
  onNext,
}: {
  open: boolean;
  onContinue: () => void;
  onNext: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-16"
      style={{ backgroundColor: "var(--c-overlay-black-70)" }}
      role="dialog"
      aria-modal="true"
      aria-label="Finish watching"
    >
      <div className="flex w-full max-w-[420px] flex-col items-center gap-20 rounded-lg border border-secondary-900 bg-surface p-24">
        <h2 className="text-lg font-medium text-neutral-0">Finish watching</h2>
        <div className="h-4 w-full" style={{ height: 1, backgroundColor: "var(--c-secondary-900)" }} />
        <p className="text-center text-sm text-secondary-300">
          You&apos;re doing so well! Finish watching the video to continue.
        </p>
        <div className="flex w-full flex-col gap-12">
          <Button variant="primary" fullWidth onClick={onContinue}>
            Continue
          </Button>
          <Button variant="secondary" fullWidth onClick={onNext}>
            Next lesson
          </Button>
        </div>
      </div>
    </div>
  );
}
