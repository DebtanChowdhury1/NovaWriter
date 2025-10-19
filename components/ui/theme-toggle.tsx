"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { MoonStar, SunMedium } from "lucide-react";
import { cn } from "@/lib/utils";

const LIGHT_THEME = "light";
const DARK_THEME = "dark";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const activeTheme = theme ?? resolvedTheme ?? LIGHT_THEME;
  const isDark = activeTheme === DARK_THEME;

  return (
    <button
      type="button"
      className={cn(
        "btn btn-ghost btn-sm rounded-full border border-base-300 normal-case",
        className,
      )}
      onClick={() => setTheme(isDark ? LIGHT_THEME : DARK_THEME)}
      aria-label="Toggle theme"
    >
      {mounted && isDark ? (
        <MoonStar className="h-4 w-4" />
      ) : (
        <SunMedium className="h-4 w-4" />
      )}
      <span className="ml-2 hidden text-xs font-medium sm:inline">
        {isDark && mounted ? "Dark" : "Light"} mode
      </span>
    </button>
  );
}
