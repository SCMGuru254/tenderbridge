import { create } from 'zustand';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'destructive';
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToast = create<ToastState>((set: any) => ({
  toasts: [],
  addToast: (toast: Omit<Toast, 'id'>) => set((state: ToastState) => ({
    toasts: [...state.toasts, { ...toast, id: Math.random().toString() }]
  })),
  removeToast: (id: string) => set((state: ToastState) => ({
    toasts: state.toasts.filter((t: Toast) => t.id !== id)
  }))
}));