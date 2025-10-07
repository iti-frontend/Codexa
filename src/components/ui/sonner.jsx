"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      richColors
      style={{
        /* normal/default (kept from your original) */
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",

        /* success (solid) */
        "--success-bg":
          "light-dark(var(--color-emerald-600), var(--color-emerald-600))",
        "--success-text": "var(--color-white)",
        "--success-border":
          "light-dark(var(--color-emerald-600), var(--color-emerald-600))",

        /* error / destructive (solid) */
        "--error-bg":
          "light-dark(var(--destructive), color-mix(in oklab, var(--destructive) 60%, var(--background)))",
        "--error-text": "var(--color-white)",
        "--error-border": "transparent",
      }}
      toastOptions={{
        style: {},
      }}
      {...props}
    />
  );
};

export { Toaster };
