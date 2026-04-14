import { useMemo, useState, type FormEvent } from "react";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import type { Note } from "../data/notes";

type NotesPageProps = {
  notes: Note[];
  onAddNote: (newNote: Omit<Note, "id" | "updatedAt">) => void;
  onUpdateNote: (
    id: string,
    updatedNote: Omit<Note, "id" | "updatedAt">,
  ) => void;
  onDeleteNote: (id: string) => void;
  onValidationError: () => void;
};

type NoteFormState = {
  title: string;
  content: string;
};

const initialFormState: NoteFormState = {
  title: "",
  content: "",
};

const formatUpdatedAt = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function NotesPage({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onValidationError,
}: NotesPageProps) {
  const [formState, setFormState] = useState<NoteFormState>(initialFormState);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [confirmDeleteNoteId, setConfirmDeleteNoteId] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const title = formState.title.trim();
  const content = formState.content.trim();

  const fieldErrors = {
    title: title ? "" : "Pole tytuł jest wymagane.",
    content: content ? "" : "Pole treść jest wymagane.",
  };

  const isFormValid = !fieldErrors.title && !fieldErrors.content;

  const sortedNotes = useMemo(
    () => [...notes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [notes],
  );

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const visibleNotes = useMemo(() => {
    if (!normalizedQuery) {
      return sortedNotes;
    }

    return sortedNotes.filter(
      (note) =>
        note.title.toLowerCase().includes(normalizedQuery) ||
        note.content.toLowerCase().includes(normalizedQuery),
    );
  }, [sortedNotes, normalizedQuery]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid) {
      onValidationError();
      return;
    }

    if (editingNoteId) {
      onUpdateNote(editingNoteId, { title, content });
    } else {
      onAddNote({ title, content });
    }

    setFormState(initialFormState);
    setEditingNoteId(null);
  };

  const handleEdit = (note: Note) => {
    setEditingNoteId(note.id);
    setConfirmDeleteNoteId(null);
    setFormState({ title: note.title, content: note.content });
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setFormState(initialFormState);
  };

  const handleDeleteClick = (noteId: string) => {
    if (confirmDeleteNoteId === noteId) {
      onDeleteNote(noteId);
      setConfirmDeleteNoteId(null);
      if (editingNoteId === noteId) {
        handleCancelEdit();
      }
      return;
    }

    setConfirmDeleteNoteId(noteId);
  };

  return (
    <div className="mx-auto max-w-448">
      <header className="sd-panel mb-6 px-6 py-5">
        <h2 className="text-2xl font-semibold">Notatki</h2>
        <p className="mt-1.5 text-sm text-white/55">
          Trzymaj szybkie notatki i przypomnienia do nauki.
        </p>
      </header>

      <section
        className={`sd-panel p-5 sm:p-6 ${
          editingNoteId ? "border-violet-400/35" : "border-white/10"
        }`}
      >
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-violet-200">
            {editingNoteId ? "Edytuj notatkę" : "Dodaj notatkę"}
          </h3>
          <p className="mt-1.5 text-sm text-white/60">
            Zapisuj wzory, podsumowania i pomysły podczas nauki.
          </p>
          {editingNoteId ? (
            <p className="mt-2 inline-flex rounded-full border border-violet-300/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-200">
              Tryb edycji
            </p>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
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
              placeholder="np. Najważniejsze reakcje z chemii"
            />
            {fieldErrors.title ? (
              <p className="sd-error">{fieldErrors.title}</p>
            ) : null}
          </label>

          <label className="sd-label">
            Treść
            <textarea
              value={formState.content}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  content: event.target.value,
                }))
              }
              rows={5}
              className="sd-input"
              placeholder="Wpisz treść notatki..."
            />
            {fieldErrors.content ? (
              <p className="sd-error">{fieldErrors.content}</p>
            ) : null}
          </label>

          <div className="mt-1 flex flex-wrap items-center justify-end gap-2.5">
            {editingNoteId ? (
              <Button type="button" onClick={handleCancelEdit}>
                Anuluj edycję
              </Button>
            ) : null}
            <Button type="submit" variant="primary" disabled={!isFormValid}>
              {editingNoteId ? "Zapisz zmiany" : "Dodaj notatkę"}
            </Button>
          </div>
        </form>
      </section>

      <section className="sd-panel mt-6 p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">Lista notatek</h3>
          <span className="text-sm text-white/50">
            {visibleNotes.length} z {notes.length}
          </span>
        </div>

        <label className="sd-label mb-5 block">
          Szukaj
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Szukaj po tytule lub treści"
            className="sd-input py-2.5"
          />
        </label>

        {notes.length === 0 ? (
          <EmptyState
            title="Brak notatek"
            description="Dodaj pierwszą notatkę, aby mieć wzory i przypomnienia pod ręką."
          />
        ) : visibleNotes.length === 0 ? (
          <EmptyState
            title="Brak pasujących notatek"
            description="Nie znaleziono notatek. Spróbuj innych słów kluczowych."
          />
        ) : (
          <div className="space-y-3.5">
            {visibleNotes.map((note) => (
              <article key={note.id} className="sd-item-card">
                <div className="flex flex-wrap items-start justify-between gap-3.5">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-white/95">{note.title}</h4>
                    <p className="mt-1 text-xs text-white/45">
                      Zaktualizowano: {formatUpdatedAt(note.updatedAt)}
                    </p>
                    <p className="mt-2 text-sm text-white/62">
                      {note.content.length > 140
                        ? `${note.content.slice(0, 140)}...`
                        : note.content}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <Button size="sm" onClick={() => handleEdit(note)}>
                      Edytuj
                    </Button>
                    {confirmDeleteNoteId === note.id ? (
                      <>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteClick(note.id)}
                        >
                          Potwierdź usunięcie
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setConfirmDeleteNoteId(null)}
                        >
                          Anuluj
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDeleteClick(note.id)}
                      >
                        Usuń
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default NotesPage;
