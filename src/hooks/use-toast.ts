"use client";

import * as React from "react";
import { ToastContext } from "../context/ToastContext";

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
