"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/context/theme-context";

interface ThemeToggleProps {
  className?: string;
  compact?: boolean;
}

export function ThemeToggle({ className = "", compact = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid layout shift before hydration
  if (!mounted) {
    return (
      <div
        className={`w-8 h-8 rounded-lg border border-[#E2E0D7] dark:border-[#2C3833] bg-[#FAF8F5] dark:bg-[#1D2421] opacity-60 ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center rounded-lg border border-[#E2E0D7] dark:border-[#2C3833] bg-[#FAF8F5] dark:bg-[#1D2421] text-[#3F4744] dark:text-[#B2BCB8] hover:text-[#181C1B] dark:hover:text-white hover:border-[#C5C2B2] dark:hover:border-[#405049] transition-all cursor-pointer shadow-2xs ${
        compact ? "w-8 h-8" : "px-2.5 py-1.5 gap-1.5 text-xs font-medium"
      } ${className}`}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-90 duration-200" />
      ) : (
        <Moon className="w-4 h-4 text-[#153E35] animate-in spin-in-90 duration-200" />
      )}
      {!compact && (
        <span className="hidden sm:inline font-medium">
          {isDark ? "Light" : "Dark"}
        </span>
      )}
    </button>
  );
}
