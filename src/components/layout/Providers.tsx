"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "var(--font-sans)",
            fontSize: "14px",
            background: "#1c1917",
            color: "#fafaf9",
            border: "1px solid #292524",
            borderRadius: "8px",
          },
          success: {
            iconTheme: { primary: "#22c55e", secondary: "#fafaf9" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#fafaf9" },
          },
        }}
      />
    </SessionProvider>
  );
}
