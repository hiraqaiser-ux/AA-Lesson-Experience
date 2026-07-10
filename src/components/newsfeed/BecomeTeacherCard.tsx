/** BecomeTeacherCard — "Teach with Athan Academy" callout, shared by the
 *  courses sidebar and the mobile nav drawer. */
import { Icon } from "../Icon";
import { Button } from "../Button";

export function BecomeTeacherCard({ onBecomeTeacher }: { onBecomeTeacher: () => void }) {
  return (
    <div className="flex flex-col gap-12 rounded-lg border border-overlay-white-4 bg-secondary-950 p-16">
      <div className="flex flex-col gap-4">
        <h3 className="text-md font-bold text-neutral-0">Teach with Athan Academy</h3>
        <p className="text-sm leading-5 text-secondary-300">
          Share your knowledge and start your own school on Athan Academy.
        </p>
      </div>
      <Button variant="ghost" size="lg" onClick={onBecomeTeacher} className="self-start">
        Become an instructor
        <Icon name="arrow-right" size={16} />
      </Button>
    </div>
  );
}
