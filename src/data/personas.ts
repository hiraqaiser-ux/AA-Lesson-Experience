/**
 * The four personas this product supports: a signed-out Visitor, plus three
 * signed-in identities (Enrolled Student, Teacher, Teacher Assistant) that can
 * be switched between from the account dropdown, to preview each experience.
 *
 * Teacher/Assistant reuse identities already present in the discussion data
 * (Abdul Haseeb, Mehak Adil) so switching personas shows content consistent
 * with what's already in the feed.
 */
import type { AvatarColor, Role } from "./discussions";
import type { School } from "./newsfeed";

export type PersonaId = "visitor" | "student" | "teacher" | "assistant";

export interface Persona {
  id: Exclude<PersonaId, "visitor">;
  name: string;
  initials: string;
  color: AvatarColor;
  avatarUrl?: string;
  /** Role chip shown on their posts/comments; students have none. */
  role?: Role;
  /** Label shown in the account switcher. */
  label: string;
}

export const PERSONAS: Record<Exclude<PersonaId, "visitor">, Persona> = {
  student: { id: "student", name: "Hira Qaiser", initials: "H", color: "blue", label: "Enrolled Student" },
  teacher: {
    id: "teacher",
    name: "Abdul Haseeb",
    initials: "AH",
    color: "teal",
    avatarUrl: "/instructor-abdul.png",
    role: "teacher",
    label: "Teacher",
  },
  assistant: {
    id: "assistant",
    name: "Mehak Adil",
    initials: "MA",
    color: "red",
    role: "assistant",
    label: "Teacher Assistant",
  },
};

/** Display order for the account switcher. */
export const PERSONA_ORDER: Exclude<PersonaId, "visitor">[] = ["student", "teacher", "assistant"];

/**
 * Schools "belonging" to a persona — progress-based for the Enrolled Student
 * (their own course progress), taught-by for the Teacher, none for a Visitor
 * (or Teacher Assistant, which has no course-ownership concept here). Used by
 * the mobile Home feed to vary "my courses" / post Enroll-link state by the
 * active persona.
 */
export function getMySchools(schools: School[], persona: PersonaId): School[] {
  if (persona === "student") return schools.filter((s) => s.progress);
  if (persona === "teacher") return schools.filter((s) => s.instructor === PERSONAS.teacher.name);
  return [];
}

/** Builds the NavBar `accountSwitcher` prop for the given active persona. */
export function buildAccountSwitcher(current: PersonaId, setPersona: (id: PersonaId) => void) {
  return {
    options: PERSONA_ORDER.map((id) => ({
      id,
      label: PERSONAS[id].label,
      active: current === id,
      onSelect: () => setPersona(id),
    })),
  };
}
