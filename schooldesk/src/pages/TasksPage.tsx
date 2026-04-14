import { useMemo, useState, type FormEvent } from "react";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import type { Task, TaskPriority } from "../data/tasks";

type TasksPageProps = {
  tasks: Task[];
  onAddTask: (newTask: Omit<Task, "id" | "completed">) => void;
  onUpdateTask: (id: string, updatedTask: Omit<Task, "id">) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onValidationError: () => void;
};

type TaskFormState = {
  title: string;
  subject: string;
  dueDate: string;
  priority: "" | TaskPriority;
  completed: boolean;
};

const initialFormState: TaskFormState = {
  title: "",
  subject: "",
  dueDate: "",
  priority: "",
  completed: false,
};

const priorityBadgeStyles: Record<TaskPriority, string> = {
  High: "bg-red-500/15 text-red-300",
  Medium: "bg-amber-500/15 text-amber-300",
  Low: "bg-emerald-500/15 text-emerald-300",
};

type TaskStatusFilter = "All" | "Completed" | "Active";
type TaskPriorityFilter = "All" | TaskPriority;
type TaskSortOption = "DueAsc" | "DueDesc" | "Priority" | "Recent";

const prioritySortRank: Record<TaskPriority, number> = {
  High: 0,
  Medium: 1,
  Low: 2,
};

const parseTaskIdAsTimestamp = (id: string) => {
  const parts = id.split("-");
  const maybeTimestamp = Number(parts[1]);
  return Number.isFinite(maybeTimestamp) ? maybeTimestamp : 0;
};

function TasksPage({
  tasks,
  onAddTask,
  onUpdateTask,
  onToggleTask,
  onDeleteTask,
  onValidationError,
}: TasksPageProps) {
  const [formState, setFormState] = useState<TaskFormState>(initialFormState);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [confirmDeleteTaskId, setConfirmDeleteTaskId] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatusFilter>("All");
  const [priorityFilter, setPriorityFilter] =
    useState<TaskPriorityFilter>("All");
  const [sortOption, setSortOption] = useState<TaskSortOption>("DueAsc");

  const title = formState.title.trim();
  const subject = formState.subject.trim();

  const fieldErrors = {
    title: title ? "" : "Pole tytuł jest wymagane.",
    subject: subject ? "" : "Pole przedmiot jest wymagane.",
    dueDate: formState.dueDate ? "" : "Pole termin jest wymagane.",
    priority: formState.priority ? "" : "Pole priorytet jest wymagane.",
  };

  const isFormValid =
    !fieldErrors.title &&
    !fieldErrors.subject &&
    !fieldErrors.dueDate &&
    !fieldErrors.priority;

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const visibleTasks = useMemo(() => {
    const filtered = tasks.filter((task) => {
      const matchesSearch =
        !normalizedQuery ||
        task.title.toLowerCase().includes(normalizedQuery) ||
        task.subject.toLowerCase().includes(normalizedQuery);

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Completed" && task.completed) ||
        (statusFilter === "Active" && !task.completed);

      const matchesPriority =
        priorityFilter === "All" || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });

    const sorted = [...filtered];

    sorted.sort((a, b) => {
      if (sortOption === "DueAsc") {
        return a.dueDate.localeCompare(b.dueDate);
      }

      if (sortOption === "DueDesc") {
        return b.dueDate.localeCompare(a.dueDate);
      }

      if (sortOption === "Priority") {
        return prioritySortRank[a.priority] - prioritySortRank[b.priority];
      }

      return parseTaskIdAsTimestamp(b.id) - parseTaskIdAsTimestamp(a.id);
    });

    return sorted;
  }, [tasks, normalizedQuery, statusFilter, priorityFilter, sortOption]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid) {
      onValidationError();
      return;
    }

    if (editingTaskId) {
      onUpdateTask(editingTaskId, {
        title,
        subject,
        dueDate: formState.dueDate,
        priority: formState.priority as TaskPriority,
        completed: formState.completed,
      });
      setEditingTaskId(null);
    } else {
      onAddTask({
        title,
        subject,
        dueDate: formState.dueDate,
        priority: formState.priority as TaskPriority,
      });
    }

    setFormState(initialFormState);
  };

  const handleStartEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setConfirmDeleteTaskId(null);
    setFormState({
      title: task.title,
      subject: task.subject,
      dueDate: task.dueDate,
      priority: task.priority,
      completed: task.completed,
    });
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setFormState(initialFormState);
  };

  const handleDeleteClick = (taskId: string) => {
    if (confirmDeleteTaskId === taskId) {
      onDeleteTask(taskId);
      setConfirmDeleteTaskId(null);
      if (editingTaskId === taskId) {
        handleCancelEdit();
      }
      return;
    }

    setConfirmDeleteTaskId(taskId);
  };

  return (
    <div className="mx-auto max-w-448">
      <header className="sd-panel mb-6 px-6 py-5">
        <h2 className="text-2xl font-semibold">Twoje zadania</h2>
        <p className="mt-1.5 text-sm text-white/55">
          Zarządzaj zadaniami i priorytetami
        </p>
      </header>

      <section className="sd-panel p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-violet-200">
            {editingTaskId ? "Edytuj zadanie" : "Dodaj zadanie"}
          </h3>
          <p className="mt-1.5 text-sm text-white/60">
            Dodawaj szkolne zadania do planera.
          </p>
          {editingTaskId ? (
            <p className="mt-2 inline-flex rounded-full border border-violet-300/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-200">
              Tryb edycji
            </p>
          ) : null}
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <label className="sd-label">
            Tytuł
            <input
              type="text"
              value={formState.title}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              className="sd-input"
              placeholder="np. Zakończ karty pracy z chemii"
            />
            {fieldErrors.title ? (
              <p className="sd-error">{fieldErrors.title}</p>
            ) : null}
          </label>

          <label className="sd-label">
            Przedmiot
            <input
              type="text"
              value={formState.subject}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  subject: event.target.value,
                }))
              }
              className="sd-input"
              placeholder="np. Chemia"
            />
            {fieldErrors.subject ? (
              <p className="sd-error">{fieldErrors.subject}</p>
            ) : null}
          </label>

          <label className="sd-label">
            Termin
            <input
              type="date"
              value={formState.dueDate}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  dueDate: event.target.value,
                }))
              }
              className="sd-input"
            />
            {fieldErrors.dueDate ? (
              <p className="sd-error">{fieldErrors.dueDate}</p>
            ) : null}
          </label>

          <label className="sd-label">
            Priorytet
            <select
              value={formState.priority}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  priority: event.target.value as TaskFormState["priority"],
                }))
              }
              className="sd-input"
            >
              <option value="">Wybierz priorytet</option>
              <option value="High">Wysoki</option>
              <option value="Medium">Średni</option>
              <option value="Low">Niski</option>
            </select>
            {fieldErrors.priority ? (
              <p className="sd-error">{fieldErrors.priority}</p>
            ) : null}
          </label>

          <label className="sd-label flex items-center gap-2 md:col-span-2">
            <input
              type="checkbox"
              checked={formState.completed}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  completed: event.target.checked,
                }))
              }
              className="h-4 w-4 rounded border border-white/30 bg-black/20 accent-violet-500"
            />
            Oznacz jako wykonane
          </label>

          <div className="md:col-span-2 mt-1 flex flex-wrap justify-end gap-2.5">
            {editingTaskId ? (
              <Button type="button" onClick={handleCancelEdit}>
                Anuluj edycję
              </Button>
            ) : null}
            <Button type="submit" variant="primary" disabled={!isFormValid}>
              {editingTaskId ? "Zapisz zmiany" : "Dodaj zadanie"}
            </Button>
          </div>
        </form>
      </section>

      <section className="sd-panel mt-6 p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">Lista zadań</h3>
          <span className="text-sm text-white/50">
            {visibleTasks.length} z {tasks.length}
          </span>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-3.5 lg:grid-cols-4">
          <label className="sd-label lg:col-span-2">
            Szukaj
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Szukaj po tytule lub przedmiocie"
              className="sd-input py-2.5"
            />
          </label>

          <label className="sd-label">
            Status
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as TaskStatusFilter)
              }
              className="sd-input py-2.5"
            >
              <option value="All">Wszystkie</option>
              <option value="Completed">Wykonane</option>
              <option value="Active">Aktywne</option>
            </select>
          </label>

          <label className="sd-label">
            Priorytet
            <select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(event.target.value as TaskPriorityFilter)
              }
              className="sd-input py-2.5"
            >
              <option value="All">Wszystkie</option>
              <option value="High">Wysoki</option>
              <option value="Medium">Średni</option>
              <option value="Low">Niski</option>
            </select>
          </label>

          <label className="sd-label lg:col-span-2">
            Sortowanie
            <select
              value={sortOption}
              onChange={(event) =>
                setSortOption(event.target.value as TaskSortOption)
              }
              className="sd-input py-2.5"
            >
              <option value="DueAsc">Termin rosnąco</option>
              <option value="DueDesc">Termin malejąco</option>
              <option value="Priority">Priorytet</option>
              <option value="Recent">Najnowsze</option>
            </select>
          </label>
        </div>

        {tasks.length === 0 ? (
          <EmptyState
            title="Brak zadań"
            description="Dodaj pierwsze zadanie powyżej, aby zacząć planować dzień."
          />
        ) : visibleTasks.length === 0 ? (
          <EmptyState
            title="Brak pasujących zadań"
            description="Spróbuj zmienić szukanie, filtr lub sortowanie."
          />
        ) : (
          <div className="space-y-3.5">
            {visibleTasks.map((task) => (
              <article key={task.id} className="sd-item-card">
                <div className="flex flex-wrap items-start justify-between gap-3.5">
                  <div className="min-w-0">
                    <h4 className="font-medium text-white/95">{task.title}</h4>
                    <p className="mt-1 text-sm text-white/60">{task.subject}</p>
                    <p className="mt-1 text-xs text-white/45">
                      Termin: {task.dueDate}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`sd-badge ${priorityBadgeStyles[task.priority]}`}
                    >
                      {task.priority === "High"
                        ? "Wysoki"
                        : task.priority === "Medium"
                          ? "Średni"
                          : "Niski"}
                    </span>
                    <span
                      className={`sd-badge ${
                        task.completed
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-white/10 text-white/65"
                      }`}
                    >
                      {task.completed ? "Wykonane" : "Niewykonane"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <Button size="sm" onClick={() => onToggleTask(task.id)}>
                    {task.completed
                      ? "Oznacz jako niewykonane"
                      : "Oznacz jako wykonane"}
                  </Button>
                  <Button size="sm" onClick={() => handleStartEdit(task)}>
                    Edytuj
                  </Button>
                  {confirmDeleteTaskId === task.id ? (
                    <>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDeleteClick(task.id)}
                      >
                        Potwierdź usunięcie
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setConfirmDeleteTaskId(null)}
                      >
                        Anuluj
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteClick(task.id)}
                    >
                      Usuń
                    </Button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default TasksPage;
