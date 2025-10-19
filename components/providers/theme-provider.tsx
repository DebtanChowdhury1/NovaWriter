// Client wrapper around next-themes ThemeProvider with sensible defaults.
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      storageKey="ai-writer-theme"
      disableTransitionOnChange
      value={{
        light: "nova-light",
        dark: "nova-dark",
      }}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
