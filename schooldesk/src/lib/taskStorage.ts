import { initialTasks, type Task } from "../data/tasks";

const TASKS_STORAGE_KEY = "schooldesk_tasks";

const isTaskPriority = (value: unknown): value is Task["priority"] => {
  return value === "High" || value === "Medium" || value === "Low";
};

const isTask = (value: unknown): value is Task => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.subject === "string" &&
    typeof candidate.dueDate === "string" &&
    typeof candidate.completed === "boolean" &&
    isTaskPriority(candidate.priority)
  );
};

export const loadTasksFromStorage = (): Task[] => {
  if (typeof window === "undefined") {
    return initialTasks;
  }

  try {
    const raw = window.localStorage.getItem(TASKS_STORAGE_KEY);

    if (!raw) {
      return initialTasks;
    }

    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return initialTasks;
    }

    if (!parsed.every((item) => isTask(item))) {
      return initialTasks;
    }

    return parsed;
  } catch {
    return initialTasks;
  }
};

export const saveTasksToStorage = (tasks: Task[]) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Ignore storage write errors to keep the app usable.
  }
};
