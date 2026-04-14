export type TaskPriority = "High" | "Medium" | "Low";

export type Task = {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  priority: TaskPriority;
  completed: boolean;
};

export const initialTasks: Task[] = [
  {
    id: "t-1",
    title: "Finish algebra worksheet",
    subject: "Math",
    dueDate: "2026-04-14",
    priority: "High",
    completed: false,
  },
  {
    id: "t-2",
    title: "Review optics formulas",
    subject: "Physics",
    dueDate: "2026-04-15",
    priority: "Medium",
    completed: false,
  },
  {
    id: "t-3",
    title: "Write history summary notes",
    subject: "History",
    dueDate: "2026-04-16",
    priority: "Low",
    completed: true,
  },
  {
    id: "t-4",
    title: "Prepare English vocabulary quiz",
    subject: "English",
    dueDate: "2026-04-17",
    priority: "High",
    completed: false,
  },
  {
    id: "t-5",
    title: "Complete biology lab report",
    subject: "Biology",
    dueDate: "2026-04-18",
    priority: "Medium",
    completed: false,
  },
  {
    id: "t-6",
    title: "Practice programming loops",
    subject: "IT",
    dueDate: "2026-04-19",
    priority: "Low",
    completed: false,
  },
];
