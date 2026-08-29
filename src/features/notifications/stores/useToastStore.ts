import { create } from 'zustand';

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type: 'critical' | 'warning' | 'info';
  timestamp: number;
}

interface ToastState {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `${Date.now()}-${Math.random()}`;
    set((state) => ({
      // Mantener máximo 4 toasts simultáneos
      toasts: [...state.toasts.slice(-3), { ...toast, id, timestamp: Date.now() }],
    }));

    // Auto-eliminar a los 5 segundos
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 5000);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));