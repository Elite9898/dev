import { initialExams, type Exam } from "../data/exams";

const EXAMS_STORAGE_KEY = "schooldesk_exams";

const isExamImportance = (value: unknown): value is Exam["importance"] => {
  return value === "High" || value === "Medium" || value === "Low";
};

const isExam = (value: unknown): value is Exam => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.subject === "string" &&
    typeof candidate.date === "string" &&
    typeof candidate.topic === "string" &&
    isExamImportance(candidate.importance)
  );
};

export const loadExamsFromStorage = (): Exam[] => {
  if (typeof window === "undefined") {
    return initialExams;
  }

  try {
    const raw = window.localStorage.getItem(EXAMS_STORAGE_KEY);

    if (!raw) {
      return initialExams;
    }

    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return initialExams;
    }

    if (!parsed.every((item) => isExam(item))) {
      return initialExams;
    }

    return parsed;
  } catch {
    return initialExams;
  }
};

export const saveExamsToStorage = (exams: Exam[]) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(EXAMS_STORAGE_KEY, JSON.stringify(exams));
  } catch {
    // Ignore storage write errors to keep the app usable.
  }
};
