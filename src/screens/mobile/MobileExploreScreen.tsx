/**
 * MobileExploreScreen — "Explore" tab, course list (Figma node 43882:79235).
 * Reuses the same SCHOOLS data and CourseCard used on the web Courses page —
 * only the DS tokens/layout are being ported to mobile, not the data.
 * For a Teacher, the courses they teach surface first as "My Schools" (moved
 * here from Home's "Enrolled Courses" row — a progress bar doesn't make sense
 * for a course you teach), followed by the rest as "Other Schools". Student/
 * Visitor keep the single flat "Explore Courses" list, unchanged.
 * Tapping a card is out of scope until a mobile course-detail screen exists.
 */
import { CourseCard } from "../../components/newsfeed/CourseCard";
import { SCHOOLS, type School } from "../../data/newsfeed";
import { getMySchools, type PersonaId } from "../../data/personas";

export function MobileExploreScreen({
  persona,
  onOpenSchool,
}: {
  persona: PersonaId;
  onOpenSchool: (school: School) => void;
}) {
  if (persona === "teacher") {
    const mySchools = getMySchools(SCHOOLS, persona);
    const otherSchools = SCHOOLS.filter((s) => !mySchools.some((m) => m.id === s.id));
    return (
      <div className="flex flex-1 flex-col gap-24 px-16 py-16">
        {mySchools.length > 0 && (
          <div className="flex flex-col gap-16">
            <h2 className="text-lg font-medium text-neutral-0">My Schools</h2>
            <div className="flex flex-col gap-16">
              {mySchools.map((school) => (
                <CourseCard key={school.id} course={school} onOpen={() => onOpenSchool(school)} />
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-col gap-16">
          <h2 className="text-lg font-medium text-neutral-0">Other Schools</h2>
          <div className="flex flex-col gap-16">
            {otherSchools.map((school) => (
              <CourseCard key={school.id} course={school} onOpen={() => onOpenSchool(school)} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-16 px-16 py-16">
      <h1 className="text-lg font-medium text-neutral-0">Explore Courses</h1>
      <div className="flex flex-col gap-16">
        {SCHOOLS.map((school) => (
          <CourseCard key={school.id} course={school} onOpen={() => onOpenSchool(school)} />
        ))}
      </div>
    </div>
  );
}
