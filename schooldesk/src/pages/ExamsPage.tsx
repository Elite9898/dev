import { useMemo, useState, type FormEvent } from "react";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import type { Exam, ExamImportance } from "../data/exams";

type ExamsPageProps = {
  exams: Exam[];
  onAddExam: (newExam: Omit<Exam, "id">) => void;
  onUpdateExam: (id: string, updatedExam: Omit<Exam, "id">) => void;
  onDeleteExam: (id: string) => void;
  onValidationError: () => void;
};

type ExamFormState = {
  subject: string;
  date: string;
  topic: string;
  importance: "" | ExamImportance;
};

type ExamImportanceFilter = "All" | ExamImportance;
type ExamSortOption = "DateAsc" | "DateDesc";

const initialFormState: ExamFormState = {
  subject: "",
  date: "",
  topic: "",
  importance: "",
};

const importanceBadgeStyles: Record<ExamImportance, string> = {
  High: "bg-red-500/15 text-red-300",
  Medium: "bg-amber-500/15 text-amber-300",
  Low: "bg-emerald-500/15 text-emerald-300",
};

function ExamsPage({
  exams,
  onAddExam,
  onUpdateExam,
  onDeleteExam,
  onValidationError,
}: ExamsPageProps) {
  const [formState, setFormState] = useState<ExamFormState>(initialFormState);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  const [confirmDeleteExamId, setConfirmDeleteExamId] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [importanceFilter, setImportanceFilter] =
    useState<ExamImportanceFilter>("All");
  const [sortOption, setSortOption] = useState<ExamSortOption>("DateAsc");

  const subject = formState.subject.trim();
  const topic = formState.topic.trim();

  const fieldErrors = {
    subject: subject ? "" : "Pole przedmiot jest wymagane.",
    date: formState.date ? "" : "Pole data jest wymagane.",
    topic: topic ? "" : "Pole zakres jest wymagane.",
    importance: formState.importance ? "" : "Pole ważność jest wymagane.",
  };

  const isFormValid =
    !fieldErrors.subject &&
    !fieldErrors.date &&
    !fieldErrors.topic &&
    !fieldErrors.importance;

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const visibleExams = useMemo(() => {
    const filtered = exams.filter((exam) => {
      const matchesSearch =
        !normalizedQuery ||
        exam.subject.toLowerCase().includes(normalizedQuery) ||
        exam.topic.toLowerCase().includes(normalizedQuery);

      const matchesImportance =
        importanceFilter === "All" || exam.importance === importanceFilter;

      return matchesSearch && matchesImportance;
    });

    const sorted = [...filtered];
    sorted.sort((a, b) =>
      sortOption === "DateAsc"
        ? a.date.localeCompare(b.date)
        : b.date.localeCompare(a.date),
    );

    return sorted;
  }, [exams, normalizedQuery, importanceFilter, sortOption]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid) {
      onValidationError();
      return;
    }

    if (editingExamId) {
      onUpdateExam(editingExamId, {
        subject,
        date: formState.date,
        topic,
        importance: formState.importance as ExamImportance,
      });
      setEditingExamId(null);
    } else {
      onAddExam({
        subject,
        date: formState.date,
        topic,
        importance: formState.importance as ExamImportance,
      });
    }

    setFormState(initialFormState);
  };

  const handleStartEdit = (exam: Exam) => {
    setEditingExamId(exam.id);
    setConfirmDeleteExamId(null);
    setFormState({
      subject: exam.subject,
      date: exam.date,
      topic: exam.topic,
      importance: exam.importance,
    });
  };

  const handleCancelEdit = () => {
    setEditingExamId(null);
    setFormState(initialFormState);
  };

  const handleDeleteClick = (examId: string) => {
    if (confirmDeleteExamId === examId) {
      onDeleteExam(examId);
      setConfirmDeleteExamId(null);
      if (editingExamId === examId) {
        handleCancelEdit();
      }
      return;
    }

    setConfirmDeleteExamId(examId);
  };

  return (
    <div className="mx-auto max-w-448">
      <header className="sd-panel mb-6 px-6 py-5">
        <h2 className="text-2xl font-semibold">Sprawdziany</h2>
        <p className="mt-1.5 text-sm text-white/55">
          Śledź ważne terminy i przygotuj się odpowiednio wcześniej.
        </p>
      </header>

      <section className="sd-panel p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-violet-200">
            {editingExamId ? "Edytuj sprawdzian" : "Dodaj sprawdzian"}
          </h3>
          <p className="mt-1.5 text-sm text-white/60">
            Zapisz przedmiot, datę, zakres i ważność sprawdzianu.
          </p>
          {editingExamId ? (
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
            Data
            <input
              type="date"
              value={formState.date}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  date: event.target.value,
                }))
              }
              className="sd-input"
            />
            {fieldErrors.date ? (
              <p className="sd-error">{fieldErrors.date}</p>
            ) : null}
          </label>

          <label className="sd-label">
            Zakres
            <input
              type="text"
              value={formState.topic}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  topic: event.target.value,
                }))
              }
              className="sd-input"
              placeholder="np. Budowa atomu"
            />
            {fieldErrors.topic ? (
              <p className="sd-error">{fieldErrors.topic}</p>
            ) : null}
          </label>

          <label className="sd-label">
            Ważność
            <select
              value={formState.importance}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  importance: event.target.value as ExamFormState["importance"],
                }))
              }
              className="sd-input"
            >
              <option value="">Wybierz ważność</option>
              <option value="High">Wysoka</option>
              <option value="Medium">Średnia</option>
              <option value="Low">Niska</option>
            </select>
            {fieldErrors.importance ? (
              <p className="sd-error">{fieldErrors.importance}</p>
            ) : null}
          </label>

          <div className="md:col-span-2 mt-1 flex flex-wrap justify-end gap-2.5">
            {editingExamId ? (
              <Button type="button" onClick={handleCancelEdit}>
                Anuluj edycję
              </Button>
            ) : null}
            <Button type="submit" variant="primary" disabled={!isFormValid}>
              {editingExamId ? "Zapisz zmiany" : "Dodaj sprawdzian"}
            </Button>
          </div>
        </form>
      </section>

      <section className="sd-panel mt-6 p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">Lista sprawdzianów</h3>
          <span className="text-sm text-white/50">
            {visibleExams.length} z {exams.length}
          </span>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-3.5 lg:grid-cols-4">
          <label className="sd-label lg:col-span-2">
            Szukaj
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Szukaj po przedmiocie lub zakresie"
              className="sd-input py-2.5"
            />
          </label>

          <label className="sd-label">
            Ważność
            <select
              value={importanceFilter}
              onChange={(event) =>
                setImportanceFilter(event.target.value as ExamImportanceFilter)
              }
              className="sd-input py-2.5"
            >
              <option value="All">Wszystkie</option>
              <option value="High">Wysoka</option>
              <option value="Medium">Średnia</option>
              <option value="Low">Niska</option>
            </select>
          </label>

          <label className="sd-label">
            Sortowanie
            <select
              value={sortOption}
              onChange={(event) =>
                setSortOption(event.target.value as ExamSortOption)
              }
              className="sd-input py-2.5"
            >
              <option value="DateAsc">Data rosnąco</option>
              <option value="DateDesc">Data malejąco</option>
            </select>
          </label>
        </div>

        {exams.length === 0 ? (
          <EmptyState
            title="Brak sprawdzianów"
            description="Dodaj pierwszy sprawdzian, aby pilnować terminów."
          />
        ) : visibleExams.length === 0 ? (
          <EmptyState
            title="Brak pasujących sprawdzianów"
            description="Spróbuj zmienić szukanie, filtr lub sortowanie."
          />
        ) : (
          <div className="space-y-3.5">
            {visibleExams.map((exam) => (
              <article key={exam.id} className="sd-item-card">
                <div className="flex flex-wrap items-start justify-between gap-3.5">
                  <div className="min-w-0">
                    <h4 className="font-medium text-white/95">
                      {exam.subject}
                    </h4>
                    <p className="mt-1 text-sm text-white/60">{exam.topic}</p>
                    <p className="mt-1 text-xs text-white/45">
                      Data: {exam.date}
                    </p>
                  </div>

                  <span
                    className={`sd-badge ${importanceBadgeStyles[exam.importance]}`}
                  >
                    {exam.importance === "High"
                      ? "Wysoka"
                      : exam.importance === "Medium"
                        ? "Średnia"
                        : "Niska"}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <Button size="sm" onClick={() => handleStartEdit(exam)}>
                    Edytuj
                  </Button>
                  {confirmDeleteExamId === exam.id ? (
                    <>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDeleteClick(exam.id)}
                      >
                        Potwierdź usunięcie
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setConfirmDeleteExamId(null)}
                      >
                        Anuluj
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteClick(exam.id)}
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

export default ExamsPage;
