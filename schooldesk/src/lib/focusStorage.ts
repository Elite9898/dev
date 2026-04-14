import {
  clampFocusDurationMinutes,
  defaultFocusSettings,
  type FocusMode,
  type FocusSettings,
} from "../data/focus";

const FOCUS_STORAGE_KEY = "schooldesk_focus";
const FOCUS_SETTINGS_STORAGE_KEY = "schooldesk_focus_settings";

type PersistedFocusState = {
  completedSessions: number;
  lastMode: FocusMode;
};

const isFocusMode = (value: unknown): value is FocusMode => {
  return value === "study" || value === "break";
};

export const loadFocusFromStorage = (): PersistedFocusState => {
  if (typeof window === "undefined") {
    return { completedSessions: 0, lastMode: "study" };
  }

  try {
    const raw = window.localStorage.getItem(FOCUS_STORAGE_KEY);

    if (!raw) {
      return { completedSessions: 0, lastMode: "study" };
    }

    const parsed = JSON.parse(raw) as unknown;

    if (!parsed || typeof parsed !== "object") {
      return { completedSessions: 0, lastMode: "study" };
    }

    const candidate = parsed as Record<string, unknown>;
    const completed = candidate.completedSessions;
    const mode = candidate.lastMode;

    if (
      typeof completed !== "number" ||
      !Number.isFinite(completed) ||
      completed < 0
    ) {
      return { completedSessions: 0, lastMode: "study" };
    }

    if (!isFocusMode(mode)) {
      return { completedSessions: 0, lastMode: "study" };
    }

    return {
      completedSessions: Math.floor(completed),
      lastMode: mode,
    };
  } catch {
    return { completedSessions: 0, lastMode: "study" };
  }
};

export const saveFocusToStorage = (state: PersistedFocusState) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(FOCUS_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage write errors to keep the app usable.
  }
};

export const loadFocusSettingsFromStorage = (): FocusSettings => {
  if (typeof window === "undefined") {
    return defaultFocusSettings;
  }

  try {
    const raw = window.localStorage.getItem(FOCUS_SETTINGS_STORAGE_KEY);

    if (!raw) {
      return defaultFocusSettings;
    }

    const parsed = JSON.parse(raw) as unknown;

    if (!parsed || typeof parsed !== "object") {
      return defaultFocusSettings;
    }

    const candidate = parsed as Record<string, unknown>;
    const studyDuration = candidate.studyDuration;
    const breakDuration = candidate.breakDuration;

    if (
      typeof studyDuration !== "number" ||
      typeof breakDuration !== "number"
    ) {
      return defaultFocusSettings;
    }

    return {
      studyDuration: clampFocusDurationMinutes(studyDuration),
      breakDuration: clampFocusDurationMinutes(breakDuration),
    };
  } catch {
    return defaultFocusSettings;
  }
};

export const saveFocusSettingsToStorage = (settings: FocusSettings) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      FOCUS_SETTINGS_STORAGE_KEY,
      JSON.stringify({
        studyDuration: clampFocusDurationMinutes(settings.studyDuration),
        breakDuration: clampFocusDurationMinutes(settings.breakDuration),
      }),
    );
  } catch {
    // Ignore storage write errors to keep the app usable.
  }
};
