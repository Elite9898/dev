export type FocusMode = "study" | "break";

export const MIN_FOCUS_DURATION_MINUTES = 1;
export const MAX_FOCUS_DURATION_MINUTES = 180;

export const DEFAULT_STUDY_DURATION_MINUTES = 25;
export const DEFAULT_BREAK_DURATION_MINUTES = 5;

export type FocusSettings = {
  studyDuration: number;
  breakDuration: number;
};

export const defaultFocusSettings: FocusSettings = {
  studyDuration: DEFAULT_STUDY_DURATION_MINUTES,
  breakDuration: DEFAULT_BREAK_DURATION_MINUTES,
};

export const clampFocusDurationMinutes = (value: number) => {
  if (!Number.isFinite(value)) {
    return MIN_FOCUS_DURATION_MINUTES;
  }

  return Math.min(
    MAX_FOCUS_DURATION_MINUTES,
    Math.max(MIN_FOCUS_DURATION_MINUTES, Math.floor(value)),
  );
};

export const getConfiguredTimeByMode = (
  mode: FocusMode,
  settings: FocusSettings,
) => {
  return (
    (mode === "study" ? settings.studyDuration : settings.breakDuration) * 60
  );
};

export const STUDY_DURATION_SECONDS = DEFAULT_STUDY_DURATION_MINUTES * 60;
export const BREAK_DURATION_SECONDS = DEFAULT_BREAK_DURATION_MINUTES * 60;

export const getDefaultTimeByMode = (mode: FocusMode) => {
  return mode === "study" ? STUDY_DURATION_SECONDS : BREAK_DURATION_SECONDS;
};
