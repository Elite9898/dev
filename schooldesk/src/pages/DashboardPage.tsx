import MainContent, {
  type TaskItem,
} from "../components/dashboard/MainContent";
import RightPanel from "../components/dashboard/RightPanel";
import StatsGrid from "../components/dashboard/StatsGrid";
import { type SidebarTab } from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import type { Exam } from "../data/exams";
import type { Note } from "../data/notes";
import { type Lesson, type LessonDay, weekDays } from "../data/schedule";
import type { Task } from "../data/tasks";

type DashboardPageProps = {
  tasks: Task[];
  exams: Exam[];
  lessons: Lesson[];
  notes: Note[];
  completedSessions: number;
  onNavigateToTab: (tab: SidebarTab) => void;
};

const dayIndexByName: Record<LessonDay, number> = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
};

const dayLabelMap: Record<LessonDay, string> = {
  Monday: "Poniedziałek",
  Tuesday: "Wtorek",
  Wednesday: "Środa",
  Thursday: "Czwartek",
  Friday: "Piątek",
};

const getLocalIsoDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const toDateStart = (date: Date) => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

const getDaysUntil = (dateString: string) => {
  const today = toDateStart(new Date());
  const target = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(target.getTime())) {
    return null;
  }

  return Math.ceil(
    (target.getTime() - today.getTime()) / (24 * 60 * 60 * 1000),
  );
};

const formatDueLabel = (dueDate: string) => {
  const taskDate = new Date(`${dueDate}T00:00:00`);

  if (Number.isNaN(taskDate.getTime())) {
    return dueDate;
  }

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const todayIso = getLocalIsoDate(today);
  const tomorrowIso = getLocalIsoDate(tomorrow);

  if (dueDate === todayIso) {
    return "Dziś";
  }

  if (dueDate === tomorrowIso) {
    return "Jutro";
  }

  return taskDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

const getCountdownLabel = (examDate: string) => {
  const days = getDaysUntil(examDate);

  if (days === null) {
    return examDate;
  }

  if (days <= 0) {
    return "dziś";
  }

  if (days === 1) {
    return "za 1 dzień";
  }

  return `za ${days} dni`;
};

const toPercent = (value: number) => {
  return Math.max(0, Math.min(100, Math.round(value)));
};

function DashboardPage({
  tasks,
  exams,
  lessons,
  notes,
  completedSessions,
  onNavigateToTab,
}: DashboardPageProps) {
  const todayIso = getLocalIsoDate(new Date());
  const dueTodayCount = tasks.filter(
    (task) => task.dueDate === todayIso,
  ).length;
  const completedCount = tasks.filter((task) => task.completed).length;
  const upcomingExams = [...exams]
    .filter((exam) => {
      const days = getDaysUntil(exam.date);
      return days !== null && days >= 0;
    })
    .sort((a, b) => a.date.localeCompare(b.date));
  const nextExam = upcomingExams[0];
  const latestNote = [...notes].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  )[0];

  const focusProgress = toPercent((completedSessions / 8) * 100);
  const tasksProgress = tasks.length
    ? toPercent((completedCount / tasks.length) * 100)
    : 0;
  const notesProgress = toPercent((notes.length / 12) * 100);

  const lessonsPerDay = weekDays.map(
    (day) => lessons.filter((lesson) => lesson.day === day).length,
  );
  const maxLessonsPerDay = Math.max(...lessonsPerDay, 1);
  const weeklyConsistencyValues = lessonsPerDay.map((count) =>
    toPercent((count / maxLessonsPerDay) * 100),
  );

  const activeWeekDays = lessonsPerDay.filter((count) => count > 0).length;
  const scheduleCoverage = toPercent((activeWeekDays / weekDays.length) * 100);

  const progressValues = [
    tasksProgress,
    focusProgress,
    notesProgress,
    scheduleCoverage,
  ];

  const subjects = Array.from(
    new Set([
      ...tasks.map((task) => task.subject),
      ...exams.map((exam) => exam.subject),
      ...lessons.map((lesson) => lesson.subject),
    ]),
  ).slice(0, 8);

  const stats = [
    {
      title: "Zadania na dziś",
      value: String(dueTodayCount),
      change: `wykonane: ${completedCount}`,
    },
    {
      title: "Nadchodzące sprawdziany",
      value: String(upcomingExams.length),
      change: nextExam
        ? getCountdownLabel(nextExam.date)
        : "brak zaplanowanych",
    },
    {
      title: "Sesje skupienia",
      value: String(completedSessions),
      change: completedSessions > 0 ? "ukończone" : "zacznij tryb skupienia",
    },
    {
      title: "Notatki",
      value: String(notes.length),
      change: latestNote ? "ostatnio zaktualizowane" : "dodaj pierwszą",
    },
  ];

  const dashboardTasks: TaskItem[] = [...tasks]
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4)
    .map((task) => ({
      name: task.title,
      time: `${formatDueLabel(task.dueDate)} • ${task.subject}`,
      status: task.priority,
      completed: task.completed,
    }));

  const profileDetails = [
    { label: "Wykonane zadania", value: String(completedCount) },
    { label: "Nadchodzące sprawdziany", value: String(upcomingExams.length) },
    { label: "Ukończone sesje", value: String(completedSessions) },
    { label: "Aktywne przedmioty", value: String(subjects.length) },
  ];

  const dashboardExams = upcomingExams.slice(0, 3).map((exam) => ({
    name: `${exam.subject} • ${exam.topic}`,
    time: getCountdownLabel(exam.date),
  }));

  const sortedLessons = [...lessons].sort((a, b) => {
    const dayOrder = dayIndexByName[a.day] - dayIndexByName[b.day];

    if (dayOrder !== 0) {
      return dayOrder;
    }

    return a.startTime.localeCompare(b.startTime);
  });

  const todayJsDay = new Date().getDay();
  const todayScheduleDay = weekDays.find(
    (day) => dayIndexByName[day] === todayJsDay,
  );

  const lessonsByDay = weekDays.reduce(
    (acc, day) => {
      acc[day] = sortedLessons.filter((lesson) => lesson.day === day);
      return acc;
    },
    {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
    } as Record<LessonDay, Lesson[]>,
  );

  const previewDay = (() => {
    if (todayScheduleDay && lessonsByDay[todayScheduleDay].length > 0) {
      return todayScheduleDay;
    }

    const todayIndex = todayScheduleDay ? dayIndexByName[todayScheduleDay] : 0;

    for (const day of weekDays) {
      if (dayIndexByName[day] > todayIndex && lessonsByDay[day].length > 0) {
        return day;
      }
    }

    for (const day of weekDays) {
      if (lessonsByDay[day].length > 0) {
        return day;
      }
    }

    return null;
  })();

  const schedulePreviewItems = previewDay
    ? lessonsByDay[previewDay].slice(0, 3).map((lesson) => ({
        title: lesson.subject,
        time: `${lesson.startTime}-${lesson.endTime}`,
        room: lesson.room,
      }))
    : [];

  return (
    <div className="mx-auto max-w-448">
      <Topbar
        welcomeText="Witaj ponownie"
        title="Twój panel nauki"
        notificationIcon="🔔"
        notificationLabel="Przejdź do zadań"
        onNotificationClick={() => onNavigateToTab("Tasks")}
        userName="Uczeń"
        userRole={`Aktywne przedmioty: ${subjects.length}`}
      />

      <StatsGrid stats={stats} />

      <section className="mt-6 grid grid-cols-1 gap-6 2xl:grid-cols-[1.45fr_1fr]">
        <MainContent
          overviewTitle="Podsumowanie dnia"
          overviewSubtitle="Aktualne zadania i postępy"
          addTaskLabel="Dodaj zadanie"
          onAddTaskClick={() => onNavigateToTab("Tasks")}
          progressValues={progressValues}
          progressLabels={["Zadania", "Skupienie", "Notatki", "Plan lekcji"]}
          subjectsTitle="Główne przedmioty"
          subjects={subjects.length > 0 ? subjects : ["Brak przedmiotów"]}
          weeklyConsistencyValues={weeklyConsistencyValues}
          tasksTitle="Lista zadań"
          tasksSubtitle="Co wymaga uwagi w następnej kolejności"
          viewAllLabel="Zobacz wszystko"
          onViewAllTasksClick={() => onNavigateToTab("Tasks")}
          emptyTasksMessage="Brak zadań. Dodaj pierwsze zadanie, aby zacząć planowanie."
          tasks={dashboardTasks}
        />

        <RightPanel
          profileIcon="👤"
          userName="Uczeń"
          profileSubtitle="Profil ucznia"
          profileDetails={profileDetails}
          examsTitle="Nadchodzące sprawdziany"
          examsTotalLabel={`Łącznie: ${upcomingExams.length}`}
          exams={dashboardExams}
          emptyExamsMessage="Brak nadchodzących sprawdzianów. Dodaj pierwszy termin."
          onAddExamClick={() => onNavigateToTab("Exams")}
          quickNoteTitle={latestNote ? latestNote.title : "Szybka notatka"}
          quickNoteText={
            latestNote
              ? latestNote.content.length > 120
                ? `${latestNote.content.slice(0, 120)}...`
                : latestNote.content
              : "Dodaj pierwszą notatkę, aby trzymać ważne przypomnienia i pomysły do nauki w jednym miejscu."
          }
          quickNoteButtonLabel="Otwórz notatki"
          onQuickNoteClick={() => onNavigateToTab("Notes")}
          onStartFocusClick={() => onNavigateToTab("Focus")}
          schedulePreviewTitle="Podgląd planu lekcji"
          schedulePreviewSubtitle={
            previewDay
              ? previewDay === todayScheduleDay
                ? "Lekcje na dziś"
                : `Kolejne lekcje: ${dayLabelMap[previewDay]}`
              : "Brak zaplanowanych lekcji"
          }
          schedulePreviewItems={schedulePreviewItems}
        />
      </section>
    </div>
  );
}

export default DashboardPage;
