/** Thin progress bar — track (secondary-800) + success fill. */
export function ProgressBar({ value = 0 }: { value?: number }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="h-4 w-full overflow-hidden rounded-full bg-secondary-800">
      <div
        className="h-full rounded-full bg-success transition-[width] duration-300 ease-in-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
