/**
 * useWaitlist — tracks whether the visitor has joined a full course's waitlist
 * (the "Notify Me" flow). Persisted in localStorage under `aa_waitlist` as a
 * list of course ids, so the "On the waitlist" state survives reloads — mirrors
 * how enrollment persists under `aa_enrolled`.
 */
import { useState } from "react";

const KEY = "aa_waitlist";

function readList(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeList(list: string[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* ignore storage failures — state still updates for this session */
  }
}

/**
 * @returns `[joined, join, leave]` — whether this course is already on the
 * waitlist, a function to add it, and a function to remove it (e.g. on logout).
 */
export function useWaitlist(courseId: string): [boolean, () => void, () => void] {
  const [joined, setJoined] = useState(() => readList().includes(courseId));

  const join = () => {
    const list = readList();
    if (!list.includes(courseId)) {
      list.push(courseId);
      writeList(list);
    }
    setJoined(true);
  };

  const leave = () => {
    writeList(readList().filter((id) => id !== courseId));
    setJoined(false);
  };

  return [joined, join, leave];
}
