import { initialLessons, type Lesson, weekDays } from "../data/schedule";

const SCHEDULE_STORAGE_KEY = "schooldesk_schedule";

const isLessonDay = (value: unknown): value is Lesson["day"] => {
  return weekDays.includes(value as Lesson["day"]);
};

const isLesson = (value: unknown): value is Lesson => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.subject === "string" &&
    typeof candidate.startTime === "string" &&
    typeof candidate.endTime === "string" &&
    typeof candidate.room === "string" &&
    isLessonDay(candidate.day)
  );
};

export const loadScheduleFromStorage = (): Lesson[] => {
  if (typeof window === "undefined") {
    return initialLessons;
  }

  try {
    const raw = window.localStorage.getItem(SCHEDULE_STORAGE_KEY);

    if (!raw) {
      return initialLessons;
    }

    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return initialLessons;
    }

    if (!parsed.every((item) => isLesson(item))) {
      return initialLessons;
    }

    return parsed;
  } catch {
    return initialLessons;
  }
};

export const saveScheduleToStorage = (lessons: Lesson[]) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(lessons));
  } catch {
    // Ignore storage write errors to keep the app usable.
  }
};
