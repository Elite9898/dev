import { useEffect, useState } from "react";
import Sidebar, { type SidebarTab } from "./components/layout/Sidebar";
import ToastContainer from "./components/ui/ToastContainer";
import { type ToastItem, type ToastType } from "./components/ui/Toast";
import type { Exam } from "./data/exams";
import { type FocusMode, type FocusSettings } from "./data/focus";
import type { Note } from "./data/notes";
import type { Lesson } from "./data/schedule";
import type { Task } from "./data/tasks";
import { loadExamsFromStorage, saveExamsToStorage } from "./lib/examStorage";
import {
  loadFocusFromStorage,
  loadFocusSettingsFromStorage,
  saveFocusSettingsToStorage,
  saveFocusToStorage,
} from "./lib/focusStorage";
import { loadNotesFromStorage, saveNotesToStorage } from "./lib/notesStorage";
import {
  loadScheduleFromStorage,
  saveScheduleToStorage,
} from "./lib/scheduleStorage";
import { loadTasksFromStorage, saveTasksToStorage } from "./lib/taskStorage";
import DashboardPage from "./pages/DashboardPage";
import ExamsPage from "./pages/ExamsPage";
import FocusPage from "./pages/FocusPage";
import NotesPage from "./pages/NotesPage";
import SchedulePage from "./pages/SchedulePage";
import TasksPage from "./pages/TasksPage";

function App() {
  const [initialFocus] = useState(() => loadFocusFromStorage());
  const [initialFocusSettings] = useState(() => loadFocusSettingsFromStorage());

  const navItems: SidebarTab[] = [
    "Dashboard",
    "Tasks",
    "Exams",
    "Schedule",
    "Focus",
    "Notes",
  ];

  const [activeTab, setActiveTab] = useState<SidebarTab>("Dashboard");
  const [tasks, setTasks] = useState<Task[]>(() => loadTasksFromStorage());
  const [exams, setExams] = useState<Exam[]>(() => loadExamsFromStorage());
  const [lessons, setLessons] = useState<Lesson[]>(() =>
    loadScheduleFromStorage(),
  );
  const [notes, setNotes] = useState<Note[]>(() => loadNotesFromStorage());
  const [focusMode, setFocusMode] = useState<FocusMode>(initialFocus.lastMode);
  const [completedSessions, setCompletedSessions] = useState<number>(
    initialFocus.completedSessions,
  );
  const [focusSettings, setFocusSettings] =
    useState<FocusSettings>(initialFocusSettings);
  const [focusTimerRuntime, setFocusTimerRuntime] = useState<{
    isRunning: boolean;
    mode: FocusMode;
  }>({
    isRunning: false,
    mode: initialFocus.lastMode,
  });
  const [focusStartShortcutNonce, setFocusStartShortcutNonce] = useState(0);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (message: string, type: ToastType) => {
    setToasts((currentToasts) => {
      const hasDuplicate = currentToasts.some(
        (toast) => toast.message === message && toast.type === type,
      );

      if (hasDuplicate) {
        return currentToasts;
      }

      return [
        ...currentToasts,
        {
          id: `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          message,
          type,
        },
      ];
    });
  };

  const dismissToast = (id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id),
    );
  };

  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  useEffect(() => {
    saveExamsToStorage(exams);
  }, [exams]);

  useEffect(() => {
    saveScheduleToStorage(lessons);
  }, [lessons]);

  useEffect(() => {
    saveNotesToStorage(notes);
  }, [notes]);

  useEffect(() => {
    saveFocusToStorage({
      completedSessions,
      lastMode: focusMode,
    });
  }, [completedSessions, focusMode]);

  useEffect(() => {
    saveFocusSettingsToStorage(focusSettings);
  }, [focusSettings]);

  const addTask = (newTask: Omit<Task, "id" | "completed">) => {
    setTasks((currentTasks) => [
      ...currentTasks,
      {
        id: `t-${Date.now()}`,
        completed: false,
        ...newTask,
      },
    ]);
    addToast("Dodano zadanie.", "success");
  };

  const updateTask = (id: string, updatedTask: Omit<Task, "id">) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...updatedTask, id: task.id } : task,
      ),
    );
    addToast("Zapisano zmiany zadania.", "success");
  };

  const toggleTask = (id: string) => {
    const task = tasks.find((item) => item.id === id);

    if (!task) {
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.map((task) => {
        if (task.id !== id) {
          return task;
        }

        const nextCompleted = !task.completed;
        return { ...task, completed: nextCompleted };
      }),
    );

    addToast(
      !task.completed
        ? "Zadanie oznaczono jako wykonane."
        : "Zadanie oznaczono jako aktywne.",
      "info",
    );
  };

  const deleteTask = (id: string) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
    addToast("Usunięto zadanie.", "success");
  };

  const addExam = (newExam: Omit<Exam, "id">) => {
    setExams((currentExams) => [
      ...currentExams,
      {
        id: `e-${Date.now()}`,
        ...newExam,
      },
    ]);
    addToast("Dodano sprawdzian.", "success");
  };

  const updateExam = (id: string, updatedExam: Omit<Exam, "id">) => {
    setExams((currentExams) =>
      currentExams.map((exam) =>
        exam.id === id ? { ...updatedExam, id: exam.id } : exam,
      ),
    );
    addToast("Zapisano zmiany sprawdzianu.", "success");
  };

  const deleteExam = (id: string) => {
    setExams((currentExams) => currentExams.filter((exam) => exam.id !== id));
    addToast("Usunięto sprawdzian.", "success");
  };

  const addLesson = (newLesson: Omit<Lesson, "id">) => {
    setLessons((currentLessons) => [
      ...currentLessons,
      {
        id: `l-${Date.now()}`,
        ...newLesson,
      },
    ]);
    addToast("Dodano lekcję.", "success");
  };

  const updateLesson = (id: string, updatedLesson: Omit<Lesson, "id">) => {
    setLessons((currentLessons) =>
      currentLessons.map((lesson) =>
        lesson.id === id ? { ...updatedLesson, id: lesson.id } : lesson,
      ),
    );
    addToast("Zapisano zmiany lekcji.", "success");
  };

  const deleteLesson = (id: string) => {
    setLessons((currentLessons) =>
      currentLessons.filter((lesson) => lesson.id !== id),
    );
    addToast("Usunięto lekcję.", "success");
  };

  const addNote = (newNote: Omit<Note, "id" | "updatedAt">) => {
    setNotes((currentNotes) => [
      {
        id: `n-${Date.now()}`,
        title: newNote.title,
        content: newNote.content,
        updatedAt: new Date().toISOString(),
      },
      ...currentNotes,
    ]);
    addToast("Dodano notatkę.", "success");
  };

  const updateNote = (
    id: string,
    updatedNote: Omit<Note, "id" | "updatedAt">,
  ) => {
    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === id
          ? {
              ...note,
              title: updatedNote.title,
              content: updatedNote.content,
              updatedAt: new Date().toISOString(),
            }
          : note,
      ),
    );
    addToast("Zapisano zmiany notatki.", "success");
  };

  const deleteNote = (id: string) => {
    setNotes((currentNotes) => currentNotes.filter((note) => note.id !== id));
    addToast("Usunięto notatkę.", "success");
  };

  const incrementCompletedSessions = () => {
    setCompletedSessions((current) => current + 1);
    addToast("Sesja nauki zakończona.", "info");
  };

  const handleStartStudySessionFromShortcut = () => {
    setActiveTab("Focus");

    if (focusTimerRuntime.isRunning) {
      if (focusTimerRuntime.mode === "study") {
        addToast("Sesja nauki już trwa.", "info");
      } else {
        addToast("Licznik jest już uruchomiony.", "info");
      }
      return;
    }

    setFocusMode("study");
    setFocusStartShortcutNonce((current) => current + 1);
    addToast("Rozpoczęto sesję nauki.", "success");
  };

  const renderPage = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <DashboardPage
            tasks={tasks}
            exams={exams}
            lessons={lessons}
            notes={notes}
            completedSessions={completedSessions}
            onNavigateToTab={setActiveTab}
          />
        );
      case "Tasks":
        return (
          <TasksPage
            tasks={tasks}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
            onValidationError={() =>
              addToast("Uzupełnij wszystkie wymagane pola zadania.", "error")
            }
          />
        );
      case "Exams":
        return (
          <ExamsPage
            exams={exams}
            onAddExam={addExam}
            onUpdateExam={updateExam}
            onDeleteExam={deleteExam}
            onValidationError={() =>
              addToast(
                "Uzupełnij wszystkie wymagane pola sprawdzianu.",
                "error",
              )
            }
          />
        );
      case "Schedule":
        return (
          <SchedulePage
            lessons={lessons}
            onAddLesson={addLesson}
            onUpdateLesson={updateLesson}
            onDeleteLesson={deleteLesson}
            onValidationError={(message) => addToast(message, "error")}
          />
        );
      case "Focus":
        return (
          <FocusPage
            currentMode={focusMode}
            focusSettings={focusSettings}
            completedSessions={completedSessions}
            onModeChange={setFocusMode}
            onFocusSettingsChange={setFocusSettings}
            onCompleteStudySession={incrementCompletedSessions}
            startStudyShortcutNonce={focusStartShortcutNonce}
            onTimerRuntimeChange={setFocusTimerRuntime}
          />
        );
      case "Notes":
        return (
          <NotesPage
            notes={notes}
            onAddNote={addNote}
            onUpdateNote={updateNote}
            onDeleteNote={deleteNote}
            onValidationError={() =>
              addToast("Uzupełnij tytuł i treść notatki.", "error")
            }
          />
        );
      default:
        return (
          <DashboardPage
            tasks={tasks}
            exams={exams}
            lessons={lessons}
            notes={notes}
            completedSessions={completedSessions}
            onNavigateToTab={setActiveTab}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar
          logoInitial="S"
          appName="SchoolDesk"
          subtitle="Organizator ucznia"
          navItems={navItems}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onStartSessionClick={handleStartStudySessionFromShortcut}
        />

        <main className="flex-1 p-4 sm:p-5 xl:p-6">{renderPage()}</main>
      </div>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
