"use client";

import * as React from "react";
import type { ToastType, Toast } from "../app/components/ui/toast";

export type ToastContextType = {
  addToast: (message: string, type?: ToastType) => void;
  dismiss: (toastId?: string) => void;
  toasts: Toast[];
};

const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 3000;

type Action =
  | { type: "ADD_TOAST"; toast: Toast }
  | { type: "DISMISS_TOAST"; toastId?: string }
  | { type: "REMOVE_TOAST"; toastId?: string };

function reducer(state: Toast[], action: Action): Toast[] {
  switch (action.type) {
    case "ADD_TOAST":
      return [action.toast, ...state].slice(0, TOAST_LIMIT);
    case "DISMISS_TOAST":
      return state.map((t) =>
        !action.toastId || t.id === action.toastId ? { ...t, open: false } : t
      );
    case "REMOVE_TOAST":
      return action.toastId ? state.filter((t) => t.id !== action.toastId) : [];
    default:
      return state;
  }
}

export const ToastContext = React.createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, dispatch] = React.useReducer(reducer, []);

  const addToast = React.useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = { id, message, type, open: true };
    dispatch({ type: "ADD_TOAST", toast });

    setTimeout(() => {
      dispatch({ type: "DISMISS_TOAST", toastId: id });
      setTimeout(() => dispatch({ type: "REMOVE_TOAST", toastId: id }), 200);
    }, TOAST_REMOVE_DELAY);
  }, []);

  const dismiss = React.useCallback((toastId?: string) => {
    dispatch({ type: "DISMISS_TOAST", toastId });
    setTimeout(() => dispatch({ type: "REMOVE_TOAST", toastId }), 200);
  }, []);

  const value = React.useMemo(
    () => ({ addToast, dismiss, toasts }),
    [addToast, dismiss, toasts]
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}
