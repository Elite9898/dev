import { useEffect } from "react";
import Button from "./Button";

export type ToastType = "success" | "error" | "info";

export type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
};

type ToastProps = {
  toast: ToastItem;
  durationMs?: number;
  onDismiss: (id: string) => void;
};

const typeStyles: Record<ToastType, string> = {
  success: "border-emerald-400/35 bg-emerald-500/10 text-emerald-100",
  error: "border-red-400/35 bg-red-500/10 text-red-100",
  info: "border-violet-400/35 bg-violet-500/10 text-violet-100",
};

const typeDotStyles: Record<ToastType, string> = {
  success: "bg-emerald-300",
  error: "bg-red-300",
  info: "bg-violet-300",
};

function Toast({ toast, durationMs = 3600, onDismiss }: ToastProps) {
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      onDismiss(toast.id);
    }, durationMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [toast.id, durationMs, onDismiss]);

  return (
    <article
      className={`w-full rounded-2xl border px-4 py-3 shadow-lg shadow-black/30 backdrop-blur-xl transition-all duration-200 ${typeStyles[toast.type]}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${typeDotStyles[toast.type]}`}
          aria-hidden="true"
        />
        <p className="min-w-0 flex-1 text-sm leading-5">{toast.message}</p>
        <Button size="sm" onClick={() => onDismiss(toast.id)}>
          Zamknij
        </Button>
      </div>
    </article>
  );
}

export default Toast;
