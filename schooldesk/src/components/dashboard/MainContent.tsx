import EmptyState from "../ui/EmptyState";
import Button from "../ui/Button";

export type TaskItem = {
  name: string;
  time: string;
  status: "High" | "Medium" | "Low";
  completed?: boolean;
};

type MainContentProps = {
  overviewTitle: string;
  overviewSubtitle: string;
  addTaskLabel: string;
  onAddTaskClick?: () => void;
  progressValues: number[];
  progressLabels?: string[];
  subjectsTitle: string;
  subjects: string[];
  weeklyConsistencyValues: number[];
  tasksTitle: string;
  tasksSubtitle: string;
  viewAllLabel: string;
  onViewAllTasksClick?: () => void;
  emptyTasksMessage?: string;
  tasks: TaskItem[];
};

function MainContent({
  overviewTitle,
  overviewSubtitle,
  addTaskLabel,
  onAddTaskClick,
  progressValues,
  progressLabels,
  subjectsTitle,
  subjects,
  weeklyConsistencyValues,
  tasksTitle,
  tasksSubtitle,
  viewAllLabel,
  onViewAllTasksClick,
  emptyTasksMessage,
  tasks,
}: MainContentProps) {
  const resolvedProgressLabels =
    progressLabels && progressLabels.length === progressValues.length
      ? progressLabels
      : progressValues.map((_, index) => `Sekcja ${index + 1}`);

  return (
    <div className="space-y-6 xl:space-y-7">
      <div className="sd-panel p-5 sm:p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">{overviewTitle}</h3>
            <p className="mt-1.5 text-sm text-white/55">{overviewSubtitle}</p>
          </div>
          <Button onClick={onAddTaskClick} variant="primary">
            {addTaskLabel}
          </Button>
        </div>

        <div className="grid gap-4 xl:grid-cols-2 xl:gap-5">
          <div className="sd-panel-muted p-5 sm:p-6">
            <p className="text-sm font-medium text-white/60">Postęp nauki</p>
            <div className="mt-6 space-y-4">
              {progressValues.map((value, index) => (
                <div key={resolvedProgressLabels[index]}>
                  <div className="mb-2 flex justify-between text-sm text-white/60">
                    <span>{resolvedProgressLabels[index]}</span>
                    <span>{value}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/10">
                    <div
                      className="h-2.5 rounded-full bg-violet-400 transition-all duration-300"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sd-panel-muted p-5 sm:p-6">
            <p className="text-sm font-medium text-white/60">{subjectsTitle}</p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {subjects.map((subject, index) => (
                <div
                  key={subject}
                  className={`rounded-2xl border border-white/10 px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 ${
                    index % 2 === 0
                      ? "bg-violet-500/20 text-violet-200"
                      : "bg-white/10 text-white/75"
                  }`}
                >
                  {subject}
                </div>
              ))}
            </div>

            <div className="mt-8">
              <p className="mb-3 text-sm font-medium text-white/60">
                Regularność tygodnia
              </p>
              <div className="flex h-40 items-end gap-3">
                {weeklyConsistencyValues.map((bar, index) => (
                  <div
                    key={index}
                    className={`w-full rounded-t-2xl transition-all duration-300 ${
                      index === 3 ? "bg-violet-500" : "bg-white/10"
                    }`}
                    style={{ height: `${bar}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sd-panel p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">{tasksTitle}</h3>
            <p className="mt-1.5 text-sm text-white/55">{tasksSubtitle}</p>
          </div>
          <Button onClick={onViewAllTasksClick}>{viewAllLabel}</Button>
        </div>

        {tasks.length === 0 ? (
          <EmptyState
            compact
            title="Brak zadań"
            description={emptyTasksMessage ?? "Brak dostępnych zadań."}
          />
        ) : (
          <div className="space-y-3.5">
            {tasks.map((task) => (
              <div
                key={`${task.name}-${task.time}`}
                className="sd-item-card flex flex-wrap items-center justify-between gap-3.5"
              >
                <div className="min-w-0">
                  <h4
                    className={`font-medium text-white/95 ${task.completed ? "line-through text-white/55" : ""}`}
                  >
                    {task.name}
                  </h4>
                  <p className="text-sm text-white/45">{task.time}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`sd-badge ${
                      task.completed
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-white/10 text-white/70"
                    }`}
                  >
                    {task.completed ? "Wykonane" : "Otwarte"}
                  </span>
                  <span
                    className={`sd-badge ${
                      task.status === "High"
                        ? "bg-red-500/15 text-red-300"
                        : task.status === "Medium"
                          ? "bg-amber-500/15 text-amber-300"
                          : "bg-emerald-500/15 text-emerald-300"
                    }`}
                  >
                    {task.status === "High"
                      ? "Wysoki"
                      : task.status === "Medium"
                        ? "Średni"
                        : "Niski"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MainContent;
