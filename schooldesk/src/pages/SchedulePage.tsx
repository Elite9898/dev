import { useMemo, useState, type FormEvent } from "react";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import { type Lesson, type LessonDay, weekDays } from "../data/schedule";

type SchedulePageProps = {
  lessons: Lesson[];
  onAddLesson: (newLesson: Omit<Lesson, "id">) => void;
  onUpdateLesson: (id: string, updatedLesson: Omit<Lesson, "id">) => void;
  onDeleteLesson: (id: string) => void;
  onValidationError: (message: string) => void;
};

type LessonFormState = {
  day: "" | LessonDay;
  subject: string;
  startTime: string;
  endTime: string;
  room: string;
};

const initialFormState: LessonFormState = {
  day: "",
  subject: "",
  startTime: "",
  endTime: "",
  room: "",
};

const dayLabelMap: Record<LessonDay, string> = {
  Monday: "Poniedziałek",
  Tuesday: "Wtorek",
  Wednesday: "Środa",
  Thursday: "Czwartek",
  Friday: "Piątek",
};

function SchedulePage({
  lessons,
  onAddLesson,
  onUpdateLesson,
  onDeleteLesson,
  onValidationError,
}: SchedulePageProps) {
  const [formState, setFormState] = useState<LessonFormState>(initialFormState);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [confirmDeleteLessonId, setConfirmDeleteLessonId] = useState<
    string | null
  >(null);
  const [dayFilter, setDayFilter] = useState<"All" | LessonDay>("All");

  const subject = formState.subject.trim();
  const room = formState.room.trim();

  const fieldErrors = {
    day: formState.day ? "" : "Pole dzień jest wymagane.",
    subject: subject ? "" : "Pole przedmiot jest wymagane.",
    startTime: formState.startTime
      ? ""
      : "Pole godzina rozpoczęcia jest wymagane.",
    endTime: formState.endTime ? "" : "Pole godzina zakończenia jest wymagane.",
    room: room ? "" : "Pole sala jest wymagane.",
    timeRange:
      formState.startTime &&
      formState.endTime &&
      formState.endTime <= formState.startTime
        ? "Godzina zakończenia musi być późniejsza niż rozpoczęcia."
        : "",
  };

  const isFormValid =
    !fieldErrors.day &&
    !fieldErrors.subject &&
    !fieldErrors.startTime &&
    !fieldErrors.endTime &&
    !fieldErrors.room &&
    !fieldErrors.timeRange;

  const groupedLessons = useMemo(() => {
    const grouped: Record<LessonDay, Lesson[]> = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
    };

    lessons.forEach((lesson) => {
      grouped[lesson.day].push(lesson);
    });

    weekDays.forEach((day) => {
      grouped[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
    });

    return grouped;
  }, [lessons]);

  const visibleDays = dayFilter === "All" ? weekDays : [dayFilter];
  const visibleLessonsCount = visibleDays.reduce(
    (total, day) => total + groupedLessons[day].length,
    0,
  );
  const visibleDaysWithLessons = visibleDays.filter(
    (day) => groupedLessons[day].length > 0,
  );

  const formatLessonCountLabel = (count: number) => {
    if (count === 1) {
      return "lekcja";
    }

    if (count % 10 >= 2 && count % 10 <= 4 && (count < 10 || count > 20)) {
      return "lekcje";
    }

    return "lekcji";
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid) {
      onValidationError(
        fieldErrors.timeRange
          ? fieldErrors.timeRange
          : "Uzupełnij wszystkie wymagane pola lekcji.",
      );
      return;
    }

    if (editingLessonId) {
      onUpdateLesson(editingLessonId, {
        day: formState.day as LessonDay,
        subject,
        startTime: formState.startTime,
        endTime: formState.endTime,
        room,
      });
      setEditingLessonId(null);
    } else {
      onAddLesson({
        day: formState.day as LessonDay,
        subject,
        startTime: formState.startTime,
        endTime: formState.endTime,
        room,
      });
    }

    setFormState(initialFormState);
  };

  const handleStartEdit = (lesson: Lesson) => {
    setEditingLessonId(lesson.id);
    setConfirmDeleteLessonId(null);
    setFormState({
      day: lesson.day,
      subject: lesson.subject,
      startTime: lesson.startTime,
      endTime: lesson.endTime,
      room: lesson.room,
    });
  };

  const handleCancelEdit = () => {
    setEditingLessonId(null);
    setFormState(initialFormState);
  };

  const handleDeleteClick = (lessonId: string) => {
    if (confirmDeleteLessonId === lessonId) {
      onDeleteLesson(lessonId);
      setConfirmDeleteLessonId(null);
      if (editingLessonId === lessonId) {
        handleCancelEdit();
      }
      return;
    }

    setConfirmDeleteLessonId(lessonId);
  };

  return (
    <div className="mx-auto max-w-448">
      <header className="sd-panel mb-6 px-6 py-5">
        <h2 className="text-2xl font-semibold">Plan lekcji</h2>
        <p className="mt-1.5 text-sm text-white/55">
          Zarządzaj lekcjami i godzinami zajęć.
        </p>
      </header>

      <section className="sd-panel p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-violet-200">
            {editingLessonId ? "Edytuj lekcję" : "Dodaj lekcję"}
          </h3>
          <p className="mt-1.5 text-sm text-white/60">
            Dodawaj lekcje i trzymaj plan tygodnia pod kontrolą.
          </p>
          {editingLessonId ? (
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
            Dzień
            <select
              value={formState.day}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  day: event.target.value as LessonFormState["day"],
                }))
              }
              className="sd-input"
            >
              <option value="">Wybierz dzień</option>
              {weekDays.map((day) => (
                <option key={day} value={day}>
                  {dayLabelMap[day]}
                </option>
              ))}
            </select>
            {fieldErrors.day ? (
              <p className="sd-error">{fieldErrors.day}</p>
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
              placeholder="np. Geografia"
            />
            {fieldErrors.subject ? (
              <p className="sd-error">{fieldErrors.subject}</p>
            ) : null}
          </label>

          <label className="sd-label">
            Godzina rozpoczęcia
            <input
              type="time"
              value={formState.startTime}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  startTime: event.target.value,
                }))
              }
              className="sd-input"
            />
            {fieldErrors.startTime ? (
              <p className="sd-error">{fieldErrors.startTime}</p>
            ) : null}
          </label>

          <label className="sd-label">
            Godzina zakończenia
            <input
              type="time"
              value={formState.endTime}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  endTime: event.target.value,
                }))
              }
              className="sd-input"
            />
            {fieldErrors.endTime || fieldErrors.timeRange ? (
              <p className="sd-error">
                {fieldErrors.endTime || fieldErrors.timeRange}
              </p>
            ) : null}
          </label>

          <label className="sd-label md:col-span-2">
            Sala
            <input
              type="text"
              value={formState.room}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  room: event.target.value,
                }))
              }
              className="sd-input"
              placeholder="np. B12"
            />
            {fieldErrors.room ? (
              <p className="sd-error">{fieldErrors.room}</p>
            ) : null}
          </label>

          <div className="md:col-span-2 mt-1 flex flex-wrap justify-end gap-2.5">
            {editingLessonId ? (
              <Button type="button" onClick={handleCancelEdit}>
                Anuluj edycję
              </Button>
            ) : null}
            <Button type="submit" variant="primary" disabled={!isFormValid}>
              {editingLessonId ? "Zapisz zmiany" : "Dodaj lekcję"}
            </Button>
          </div>
        </form>
      </section>

      <section className="mt-6 space-y-4">
        <div className="sd-panel p-4">
          <label className="sd-label">
            Filtruj po dniu tygodnia
            <select
              value={dayFilter}
              onChange={(event) =>
                setDayFilter(event.target.value as "All" | LessonDay)
              }
              className="sd-input py-2.5"
            >
              <option value="All">Wszystkie dni</option>
              {weekDays.map((day) => (
                <option key={day} value={day}>
                  {dayLabelMap[day]}
                </option>
              ))}
            </select>
          </label>
        </div>

        {lessons.length === 0 ? (
          <EmptyState
            title="Brak lekcji"
            description="Dodaj swój plan lekcji."
          />
        ) : visibleLessonsCount === 0 ? (
          <EmptyState
            title="Brak lekcji w wybranym dniu"
            description="Spróbuj innego filtra albo dodaj nową lekcję."
          />
        ) : (
          visibleDaysWithLessons.map((day) => (
            <div key={day} className="sd-panel p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold">{dayLabelMap[day]}</h3>
                <span className="text-sm text-white/50">
                  {groupedLessons[day].length}{" "}
                  {formatLessonCountLabel(groupedLessons[day].length)}
                </span>
              </div>

              <div className="space-y-3.5">
                {groupedLessons[day].map((lesson) => (
                  <article key={lesson.id} className="sd-item-card">
                    <div className="flex flex-wrap items-start justify-between gap-3.5">
                      <div className="min-w-0 flex-1">
                        <h4 className="wrap-break-word font-medium text-white/95">
                          {lesson.subject}
                        </h4>
                        <p className="mt-1 text-sm text-white/60">
                          {lesson.startTime} - {lesson.endTime}
                        </p>
                        <p className="mt-1 text-xs text-white/45">
                          Sala: {lesson.room}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        <Button
                          size="sm"
                          onClick={() => handleStartEdit(lesson)}
                        >
                          Edytuj
                        </Button>
                        {confirmDeleteLessonId === lesson.id ? (
                          <>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleDeleteClick(lesson.id)}
                            >
                              Potwierdź usunięcie
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => setConfirmDeleteLessonId(null)}
                            >
                              Anuluj
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteClick(lesson.id)}
                          >
                            Usuń
                          </Button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default SchedulePage;
