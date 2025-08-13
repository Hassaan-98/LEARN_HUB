"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./components/theme-provider";
import { ToastProvider } from "../context/ToastContext";
import { ToastContainer } from "./components/ui/toast";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ToastProvider>
          <ToastContainer />
          <Header />
          {children}
          <Footer />
        </ToastProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}