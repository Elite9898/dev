export type LessonDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday";

export type Lesson = {
  id: string;
  day: LessonDay;
  subject: string;
  startTime: string;
  endTime: string;
  room: string;
};

export const weekDays: LessonDay[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

export const initialLessons: Lesson[] = [
  {
    id: "l-1",
    day: "Monday",
    subject: "Math",
    startTime: "08:00",
    endTime: "08:45",
    room: "A12",
  },
  {
    id: "l-2",
    day: "Monday",
    subject: "English",
    startTime: "09:00",
    endTime: "09:45",
    room: "B05",
  },
  {
    id: "l-3",
    day: "Tuesday",
    subject: "Physics",
    startTime: "10:00",
    endTime: "10:45",
    room: "C02",
  },
  {
    id: "l-4",
    day: "Wednesday",
    subject: "History",
    startTime: "11:00",
    endTime: "11:45",
    room: "A03",
  },
  {
    id: "l-5",
    day: "Thursday",
    subject: "Biology",
    startTime: "08:00",
    endTime: "08:45",
    room: "Lab 2",
  },
  {
    id: "l-6",
    day: "Friday",
    subject: "IT",
    startTime: "12:00",
    endTime: "12:45",
    room: "D10",
  },
  {
    id: "l-7",
    day: "Friday",
    subject: "Chemistry",
    startTime: "13:00",
    endTime: "13:45",
    room: "Lab 1",
  },
];
