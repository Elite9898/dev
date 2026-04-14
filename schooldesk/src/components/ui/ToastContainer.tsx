import Toast, { type ToastItem } from "./Toast";

type ToastContainerProps = {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
};

function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 w-[min(92vw,24rem)] space-y-2 sm:bottom-5 sm:right-5 lg:bottom-6 lg:right-6">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
