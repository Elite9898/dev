export type ExamImportance = "High" | "Medium" | "Low";

export type Exam = {
  id: string;
  subject: string;
  date: string;
  topic: string;
  importance: ExamImportance;
};

export const initialExams: Exam[] = [
  {
    id: "e-1",
    subject: "Math",
    date: "2026-04-16",
    topic: "Quadratic equations",
    importance: "High",
  },
  {
    id: "e-2",
    subject: "Physics",
    date: "2026-04-19",
    topic: "Kinematics and motion",
    importance: "Medium",
  },
  {
    id: "e-3",
    subject: "English",
    date: "2026-04-21",
    topic: "Reading comprehension",
    importance: "Low",
  },
  {
    id: "e-4",
    subject: "Biology",
    date: "2026-04-24",
    topic: "Cell structure and function",
    importance: "Medium",
  },
  {
    id: "e-5",
    subject: "History",
    date: "2026-04-27",
    topic: "Industrial Revolution",
    importance: "High",
  },
  {
    id: "e-6",
    subject: "IT",
    date: "2026-05-02",
    topic: "Algorithm basics",
    importance: "Low",
  },
];
