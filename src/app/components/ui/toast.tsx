"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { X } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useToast } from "@/src/hooks/use-toast";

export type ToastType = "success" | "error" | "info";

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
  open: boolean;
};

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  return (
    <ToastPrimitives.Provider swipeDirection="right">
      {toasts.map((toast) => (
        <ToastPrimitives.Root
          key={toast.id}
          open={toast.open}
          onOpenChange={(open) => !open && dismiss(toast.id)}
          className={cn(
            "group pointer-events-auto relative flex w-full max-w-sm items-center justify-between space-x-4 overflow-hidden rounded-lg border p-4 pr-8 shadow-lg transition-all",
            toast.type === "success"
              ? "border-green-500 bg-green-50 text-green-900"
              : toast.type === "error"
              ? "border-red-500 bg-red-50 text-red-900"
              : "border-blue-500 bg-blue-50 text-blue-900"
          )}
        >
          <ToastPrimitives.Title className="font-semibold">
            {toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}
          </ToastPrimitives.Title>
          <ToastPrimitives.Description>{toast.message}</ToastPrimitives.Description>

          <ToastPrimitives.Close
            className="absolute right-2 top-2 rounded-md p-1 text-gray-500 hover:bg-gray-200 focus:outline-none"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </ToastPrimitives.Close>
        </ToastPrimitives.Root>
      ))}

      <ToastPrimitives.Viewport className="fixed bottom-4 right-4 flex flex-col gap-2" />
    </ToastPrimitives.Provider>
  );
}
