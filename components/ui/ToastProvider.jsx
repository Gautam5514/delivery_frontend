"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const ToastContext = createContext(null);

const toastMeta = {
  success: {
    title: "Success",
    icon: CheckCircle2,
    accent: "bg-emerald-600",
    iconColor: "text-emerald-600",
  },
  info: {
    title: "Info",
    icon: Info,
    accent: "bg-blue-500",
    iconColor: "text-blue-500",
  },
  warning: {
    title: "Warning",
    icon: AlertTriangle,
    accent: "bg-amber-500",
    iconColor: "text-amber-500",
  },
  error: {
    title: "Error",
    icon: XCircle,
    accent: "bg-red-600",
    iconColor: "text-red-600",
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type = "info", title, message, duration = 4200 }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const safeType = toastMeta[type] ? type : "info";
      const nextToast = {
        id,
        type: safeType,
        title: title || toastMeta[safeType].title,
        message,
      };

      setToasts((current) => [nextToast, ...current].slice(0, 4));
      if (duration > 0) {
        window.setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss]
  );

  const api = useMemo(
    () => ({
      toast: showToast,
      success: (message, options = {}) => showToast({ ...options, type: "success", message }),
      info: (message, options = {}) => showToast({ ...options, type: "info", message }),
      warning: (message, options = {}) => showToast({ ...options, type: "warning", message }),
      error: (message, options = {}) => showToast({ ...options, type: "error", message }),
      dismiss,
    }),
    [dismiss, showToast]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[9999] flex w-[calc(100vw-2rem)] max-w-md flex-col gap-3 sm:right-6 sm:top-6 sm:w-[390px]">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => {
            const meta = toastMeta[toast.type];
            const Icon = meta.icon;

            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, x: 28, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 28, scale: 0.96 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="pointer-events-auto overflow-hidden rounded-2xl border border-white/70 bg-white/95 shadow-[0_18px_45px_-28px_rgba(24,24,27,0.72)] ring-1 ring-zinc-900/5 backdrop-blur-xl"
              >
                <div className="flex min-h-20">
                  <div className={`w-1 shrink-0 ${meta.accent}`} />
                  <div className="flex flex-1 items-center gap-3 px-4 py-4">
                    <Icon className={`h-6 w-6 shrink-0 ${meta.iconColor}`} strokeWidth={1.9} />
                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-black leading-tight text-zinc-900">{toast.title}</p>
                      {toast.message ? (
                        <p className="mt-1 text-sm leading-5 text-zinc-600">{toast.message}</p>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      className="rounded-full p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
                      onClick={() => dismiss(toast.id)}
                      aria-label="Dismiss notification"
                    >
                      <X className="h-5 w-5" strokeWidth={1.8} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
};
