import React from 'react';
import { useToastStore } from '../stores/useToastStore';
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const toastConfig = {
  critical: {
    bg: 'bg-rose-50 border-rose-200 text-rose-900',
    icon: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
  },
  warning: {
    bg: 'bg-amber-50 border-amber-200 text-amber-900',
    icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
  },
  info: {
    bg: 'bg-blue-50 border-blue-200 text-blue-900',
    icon: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
  },
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <aside
      aria-label="Notificaciones del sistema"
      className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        const config = toastConfig[toast.type];
        return (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-xs transition-all animate-bounce-short ${config.bg}`}
          >
            {config.icon}
            <div className="flex-1 text-xs">
              <h4 className="font-bold">{toast.title}</h4>
              <p className="mt-0.5 opacity-90">{toast.description}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-700 transition"
              aria-label="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </aside>
  );
};