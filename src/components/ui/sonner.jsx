"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--primary)",
        "--normal-border": "var(--border)",
      }}
      toastOptions={{
        classNames: {
          description: "text-foreground!",
          title: "text-primary font-medium",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
