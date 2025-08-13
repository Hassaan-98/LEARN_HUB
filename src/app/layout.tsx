import type React from "react";
import "../../src/styles/global.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next"; 
import ClientWrapper from "./ClientWraper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SaaSify - Streamline Your Workflow",
  description:
    "Boost productivity, reduce costs, and scale your business with our all-in-one SaaS platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}