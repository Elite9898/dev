export type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
};

export const initialNotes: Note[] = [
  {
    id: "n-1",
    title: "Math formulas",
    content:
      "Remember: quadratic formula x = (-b +/- sqrt(b^2 - 4ac)) / 2a and complete the square examples.",
    updatedAt: "2026-04-14T08:30:00.000Z",
  },
  {
    id: "n-2",
    title: "History reminder",
    content:
      "Review causes of the Industrial Revolution and key inventions before Friday class.",
    updatedAt: "2026-04-13T18:15:00.000Z",
  },
  {
    id: "n-3",
    title: "Physics checklist",
    content:
      "Practice 10 kinematics tasks: displacement, velocity, acceleration and graph interpretation.",
    updatedAt: "2026-04-12T20:05:00.000Z",
  },
];
