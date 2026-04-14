import EmptyState from "../ui/EmptyState";
import Button from "../ui/Button";

type ProfileDetail = {
  label: string;
  value: string;
};

type ExamItem = {
  name: string;
  time: string;
};

type SchedulePreviewItem = {
  title: string;
  time: string;
  room: string;
};

type RightPanelProps = {
  profileIcon: string;
  userName: string;
  profileSubtitle: string;
  profileDetails: ProfileDetail[];
  examsTitle: string;
  examsTotalLabel: string;
  exams: ExamItem[];
  emptyExamsMessage?: string;
  onAddExamClick?: () => void;
  quickNoteTitle: string;
  quickNoteText: string;
  quickNoteButtonLabel: string;
  onQuickNoteClick?: () => void;
  onStartFocusClick?: () => void;
  schedulePreviewTitle?: string;
  schedulePreviewSubtitle?: string;
  schedulePreviewItems?: SchedulePreviewItem[];
};

function RightPanel({
  profileIcon,
  userName,
  profileSubtitle,
  profileDetails,
  examsTitle,
  examsTotalLabel,
  exams,
  emptyExamsMessage,
  onAddExamClick,
  quickNoteTitle,
  quickNoteText,
  quickNoteButtonLabel,
  onQuickNoteClick,
  onStartFocusClick,
  schedulePreviewTitle,
  schedulePreviewSubtitle,
  schedulePreviewItems,
}: RightPanelProps) {
  return (
    <div className="space-y-6 xl:space-y-7">
      <div className="sd-panel p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-500/20 text-2xl text-violet-200 ring-1 ring-violet-300/20">
            {profileIcon}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{userName}</h3>
            <p className="text-sm text-white/50">{profileSubtitle}</p>
          </div>
        </div>

        <div className="space-y-3.5 text-sm">
          {profileDetails.map((detail, index) => (
            <div
              key={detail.label}
              className={`flex items-center justify-between gap-3 ${
                index !== profileDetails.length - 1
                  ? "border-b border-white/8 pb-3"
                  : ""
              }`}
            >
              <span className="text-white/50">{detail.label}</span>
              <span className="font-medium text-white/90">{detail.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="sd-panel p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3.5">
          <h3 className="text-lg font-semibold">{examsTitle}</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/50">{examsTotalLabel}</span>
            <Button onClick={onAddExamClick} variant="primary" size="sm">
              Dodaj
            </Button>
          </div>
        </div>

        {exams.length === 0 ? (
          <EmptyState
            compact
            title="Brak sprawdzianów"
            description={emptyExamsMessage ?? "Brak dostępnych sprawdzianów."}
          />
        ) : (
          <div className="space-y-3.5">
            {exams.map((exam) => (
              <div key={exam.name} className="sd-item-card">
                <div className="flex items-center justify-between gap-3">
                  <span className="min-w-0 truncate font-medium">
                    {exam.name}
                  </span>
                  <span className="shrink-0 text-sm text-violet-300">
                    {exam.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-white/14 bg-linear-to-br from-violet-500/20 to-fuchsia-500/10 p-5 shadow-lg shadow-black/20 sm:p-6">
        <h3 className="text-lg font-semibold">{quickNoteTitle}</h3>
        <p className="mt-2 wrap-break-word text-sm leading-6 text-white/65">
          {quickNoteText}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <Button onClick={onQuickNoteClick}>{quickNoteButtonLabel}</Button>
          <Button onClick={onStartFocusClick} variant="primary">
            Tryb skupienia
          </Button>
        </div>
      </div>

      {schedulePreviewTitle ? (
        <div className="sd-panel p-5 sm:p-6">
          <div className="mb-5">
            <h3 className="text-lg font-semibold">{schedulePreviewTitle}</h3>
            <p className="mt-1.5 text-sm text-white/55">
              {schedulePreviewSubtitle}
            </p>
          </div>

          {schedulePreviewItems && schedulePreviewItems.length > 0 ? (
            <div className="space-y-3.5">
              {schedulePreviewItems.map((item) => (
                <div
                  key={`${item.title}-${item.time}-${item.room}`}
                  className="sd-item-card"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-white/45">Sala: {item.room}</p>
                    </div>
                    <span className="text-sm text-violet-300">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              compact
              title="Brak lekcji"
              description="Brak zaplanowanych lekcji."
            />
          )}
        </div>
      ) : null}
    </div>
  );
}

export default RightPanel;
