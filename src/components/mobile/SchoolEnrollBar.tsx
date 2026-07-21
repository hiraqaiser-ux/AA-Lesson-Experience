/**
 * SchoolEnrollBar — sticky "Enroll Now $100 (One Time Payment)" footer shown
 * on the mobile School Detail tabs for a Visitor (Figma "Enroll Section",
 * shared verbatim across Lesson/Discussion/About). Extracted so the three
 * tabs don't each duplicate the same markup.
 */
import { Button } from "../Button";

export function SchoolEnrollBar({ onEnroll }: { onEnroll: () => void }) {
  return (
    <div className="flex flex-col items-center gap-16 rounded-t-lg border border-secondary-900 bg-secondary-1000 p-16">
      <Button variant="primary" size="lg" fullWidth onClick={onEnroll}>
        Enroll Now
      </Button>
      <p className="text-lg-2 font-semibold text-primary-500">
        $100 <span className="text-md font-normal text-secondary-200">(One Time Payment)</span>
      </p>
    </div>
  );
}
