import * as React from "react";
import { CheckCircle2, CircleAlert, X } from "lucide-react";

type ToastVariant = "success" | "error";

type ToastItem = {
  id: number;
  title: string;
  variant: ToastVariant;
};

type ToastInput = Omit<ToastItem, "id">;

const listeners = new Set<(toast: ToastInput) => void>();

const emitToast = (toast: ToastInput) => {
  listeners.forEach((listener) => listener(toast));
};

export const toast = {
  success: (title: string) => emitToast({ title, variant: "success" }),
  error: (title: string) => emitToast({ title, variant: "error" }),
};

export function ToastViewport() {
  const [items, setItems] = React.useState<ToastItem[]>([]);

  React.useEffect(() => {
    const listener = (nextToast: ToastInput) => {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      setItems((current) => [...current, { ...nextToast, id }]);

      window.setTimeout(() => {
        setItems((current) => current.filter((item) => item.id !== id));
      }, 3500);
    };

    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(92vw,24rem)] flex-col gap-3">
      {items.map((item) => {
        const isSuccess = item.variant === "success";

        return (
          <div
            key={item.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-[0_16px_40px_rgba(9,2,36,0.12)] backdrop-blur ${
              isSuccess
                ? "border-emerald-200 bg-white text-emerald-900"
                : "border-rose-200 bg-white text-rose-900"
            }`}
            role="status"
            aria-live="polite"
          >
            <div
              className={`mt-0.5 rounded-full p-1 ${
                isSuccess ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
              }`}
            >
              {isSuccess ? <CheckCircle2 className="size-4" /> : <CircleAlert className="size-4" />}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium leading-6">{item.title}</p>
            </div>

            <button
              type="button"
              onClick={() => setItems((current) => current.filter((toastItem) => toastItem.id !== item.id))}
              className="cursor-pointer rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label="Cerrar notificacion"
            >
              <X className="size-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
