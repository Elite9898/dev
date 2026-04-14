import { initialNotes, type Note } from "../data/notes";

const NOTES_STORAGE_KEY = "schooldesk_notes";

const isNote = (value: unknown): value is Note => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.content === "string" &&
    typeof candidate.updatedAt === "string"
  );
};

export const loadNotesFromStorage = (): Note[] => {
  if (typeof window === "undefined") {
    return initialNotes;
  }

  try {
    const raw = window.localStorage.getItem(NOTES_STORAGE_KEY);

    if (!raw) {
      return initialNotes;
    }

    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return initialNotes;
    }

    if (!parsed.every((item) => isNote(item))) {
      return initialNotes;
    }

    return parsed;
  } catch {
    return initialNotes;
  }
};

export const saveNotesToStorage = (notes: Note[]) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // Ignore storage write errors to keep the app usable.
  }
};
