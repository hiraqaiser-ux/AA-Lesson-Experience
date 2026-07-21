import { useState } from "react";
import type { PersonaId } from "../data/personas";

const PERSONA_KEY = "aa_persona";

function readPersona(): PersonaId {
  if (typeof localStorage === "undefined") return "visitor";
  const saved = localStorage.getItem(PERSONA_KEY);
  return saved === "student" || saved === "teacher" || saved === "assistant" ? saved : "visitor";
}

/**
 * The active persona (Visitor / Enrolled Student / Teacher / Teacher Assistant),
 * persisted in localStorage so it survives the full-page navigations between
 * the community screens (?screen=newsfeed / courses / school).
 */
export function usePersona() {
  const [persona, setPersonaState] = useState<PersonaId>(readPersona);

  const setPersona = (id: PersonaId) => {
    setPersonaState(id);
    try {
      if (id === "visitor") localStorage.removeItem(PERSONA_KEY);
      else localStorage.setItem(PERSONA_KEY, id);
    } catch {
      /* ignore */
    }
  };

  return [persona, setPersona] as const;
}
