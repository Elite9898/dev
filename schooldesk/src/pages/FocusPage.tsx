import { useEffect, useMemo, useRef, useState } from "react";
import Button from "../components/ui/Button";
import {
  clampFocusDurationMinutes,
  getConfiguredTimeByMode,
  MAX_FOCUS_DURATION_MINUTES,
  MIN_FOCUS_DURATION_MINUTES,
  type FocusMode,
  type FocusSettings,
} from "../data/focus";

type FocusPageProps = {
  currentMode: FocusMode;
  focusSettings: FocusSettings;
  completedSessions: number;
  onModeChange: (mode: FocusMode) => void;
  onFocusSettingsChange: (settings: FocusSettings) => void;
  onCompleteStudySession: () => void;
  startStudyShortcutNonce?: number;
  onTimerRuntimeChange?: (runtime: {
    isRunning: boolean;
    mode: FocusMode;
  }) => void;
};

const formatTimer = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
};

function FocusPage({
  currentMode,
  focusSettings,
  completedSessions,
  onModeChange,
  onFocusSettingsChange,
  onCompleteStudySession,
  startStudyShortcutNonce = 0,
  onTimerRuntimeChange,
}: FocusPageProps) {
  const [timeLeft, setTimeLeft] = useState(() =>
    getConfiguredTimeByMode(currentMode, focusSettings),
  );
  const [isRunning, setIsRunning] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const lastHandledShortcutNonceRef = useRef(0);

  useEffect(() => {
    setTimeLeft(getConfiguredTimeByMode(currentMode, focusSettings));
    setStatusMessage("");
  }, [currentMode, focusSettings]);

  useEffect(() => {
    onTimerRuntimeChange?.({ isRunning, mode: currentMode });
  }, [isRunning, currentMode, onTimerRuntimeChange]);

  useEffect(() => {
    if (
      startStudyShortcutNonce === 0 ||
      startStudyShortcutNonce === lastHandledShortcutNonceRef.current
    ) {
      return;
    }

    lastHandledShortcutNonceRef.current = startStudyShortcutNonce;

    if (isRunning && currentMode === "study") {
      setStatusMessage("Sesja nauki już trwa.");
      return;
    }

    const studySeconds = getConfiguredTimeByMode("study", focusSettings);

    setTimeLeft(studySeconds);
    setStatusMessage("Rozpoczęto sesję nauki ze skrótu bocznego.");

    if (currentMode !== "study") {
      onModeChange("study");
    }

    setIsRunning(true);
  }, [
    startStudyShortcutNonce,
    isRunning,
    currentMode,
    focusSettings,
    onModeChange,
  ]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          window.clearInterval(intervalId);
          setIsRunning(false);

          if (currentMode === "study") {
            onCompleteStudySession();
            setStatusMessage("Sesja nauki zakończona. Świetna robota!");
          } else {
            setStatusMessage("Przerwa zakończona. Czas na kolejną sesję?");
          }

          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isRunning, currentMode, onCompleteStudySession]);

  const modeLabel = currentMode === "study" ? "Tryb nauki" : "Tryb przerwy";
  const motivationText = useMemo(() => {
    if (completedSessions >= 8) {
      return "Świetna regularność. Utrzymaj tempo!";
    }

    if (completedSessions >= 4) {
      return "Bardzo dobry postęp. Jeszcze kilka sesji i cel osiągnięty.";
    }

    if (completedSessions >= 1) {
      return "Dobry start. Trzymaj skupienie i dokładaj kolejne sesje.";
    }

    return "Rozpocznij pierwszą sesję i buduj regularność nauki.";
  }, [completedSessions]);

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(getConfiguredTimeByMode(currentMode, focusSettings));
    setStatusMessage("");
  };

  const handleDurationChange = (
    key: "studyDuration" | "breakDuration",
    rawValue: string,
  ) => {
    const parsed = Number(rawValue);

    if (!Number.isFinite(parsed)) {
      return;
    }

    onFocusSettingsChange({
      ...focusSettings,
      [key]: clampFocusDurationMinutes(parsed),
    });
  };

  const durationHint = `Dozwolony zakres: ${MIN_FOCUS_DURATION_MINUTES}-${MAX_FOCUS_DURATION_MINUTES} minut.`;
  const modeDuration = getConfiguredTimeByMode(currentMode, focusSettings);
  const startButtonLabel =
    !isRunning && timeLeft < modeDuration && timeLeft > 0 ? "Wznów" : "Start";

  const handleStartOrResume = () => {
    if (isRunning) {
      return;
    }

    if (timeLeft <= 0) {
      setTimeLeft(modeDuration);
    }

    setIsRunning(true);
  };

  const handlePause = () => {
    if (!isRunning) {
      return;
    }

    setIsRunning(false);
  };

  return (
    <div className="mx-auto max-w-448">
      <header className="sd-panel mb-6 px-6 py-5">
        <h2 className="text-2xl font-semibold">Tryb skupienia</h2>
        <p className="mt-1.5 text-sm text-white/55">
          Korzystaj z cykli Pomodoro, aby uczyć się skutecznie i robić krótkie
          przerwy.
        </p>
      </header>

      <section className="sd-panel p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">Licznik sesji</h3>
          <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-medium text-violet-200">
            {modeLabel}
          </span>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="sd-label">
            Czas nauki (minuty)
            <input
              type="number"
              min={MIN_FOCUS_DURATION_MINUTES}
              max={MAX_FOCUS_DURATION_MINUTES}
              value={focusSettings.studyDuration}
              disabled={isRunning}
              onChange={(event) =>
                handleDurationChange("studyDuration", event.target.value)
              }
              className="sd-input disabled:opacity-60"
            />
            <p className="mt-1 text-xs text-white/45">{durationHint}</p>
          </label>

          <label className="sd-label">
            Czas przerwy (minuty)
            <input
              type="number"
              min={MIN_FOCUS_DURATION_MINUTES}
              max={MAX_FOCUS_DURATION_MINUTES}
              value={focusSettings.breakDuration}
              disabled={isRunning}
              onChange={(event) =>
                handleDurationChange("breakDuration", event.target.value)
              }
              className="sd-input disabled:opacity-60"
            />
            <p className="mt-1 text-xs text-white/45">{durationHint}</p>
          </label>
        </div>

        <div className="sd-panel-muted px-6 py-8 text-center sm:py-9">
          <p className="text-6xl font-semibold tracking-[0.06em]">
            {formatTimer(timeLeft)}
          </p>
          <p className="mt-3 text-sm text-white/55">
            {currentMode === "study"
              ? "Skup się na jednym zadaniu"
              : "Zrób krótki odpoczynek"}
          </p>
          {statusMessage ? (
            <p className="mt-3 text-sm font-medium text-emerald-300">
              {statusMessage}
            </p>
          ) : null}
        </div>

        <div className="mt-5 flex flex-wrap gap-2.5">
          <Button
            onClick={handleStartOrResume}
            variant="primary"
            disabled={isRunning}
          >
            {startButtonLabel}
          </Button>
          <Button onClick={handlePause} disabled={!isRunning}>
            Pauza
          </Button>
          <Button onClick={handleReset}>Resetuj</Button>
        </div>

        <div className="mt-6 flex flex-wrap gap-2.5">
          <Button
            onClick={() => onModeChange("study")}
            variant={currentMode === "study" ? "primary" : "secondary"}
            disabled={isRunning}
          >
            Nauka
          </Button>
          <Button
            onClick={() => onModeChange("break")}
            variant={currentMode === "break" ? "primary" : "secondary"}
            disabled={isRunning}
          >
            Przerwa
          </Button>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="sd-panel p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-violet-200">
            Statystyki skupienia
          </h3>
          <p className="mt-4 text-4xl font-semibold tracking-tight">
            {completedSessions}
          </p>
          <p className="mt-1.5 text-sm text-white/58">Ukończone sesje nauki</p>
          <p className="mt-4 text-sm leading-6 text-white/68">
            {motivationText}
          </p>
        </div>

        <div className="rounded-3xl border border-white/14 bg-linear-to-br from-violet-500/20 to-fuchsia-500/10 p-5 shadow-lg shadow-black/20 sm:p-6">
          <h3 className="text-lg font-semibold">Jak to działa</h3>
          <p className="mt-2 text-sm leading-6 text-white/68">
            Używaj ustawionego czasu nauki i przerwy. Każda zakończona sesja
            zwiększa licznik i pomaga śledzić postępy.
          </p>
          <p className="mt-4 text-sm text-white/70">
            Cel na dziś: wykonaj co najmniej 4 sesje nauki.
          </p>
        </div>
      </section>
    </div>
  );
}

export default FocusPage;
