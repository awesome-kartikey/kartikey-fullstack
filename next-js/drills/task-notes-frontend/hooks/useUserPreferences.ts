// hooks/useUserPreferences.ts
"use client";

import { useState, useEffect } from "react";

interface UserPreferences {
  theme: "light" | "dark";
  compactMode: boolean;
  showCompletedTasks: boolean;
  taskSortOrder: "date" | "priority" | "title";
}

const defaultPreferences: UserPreferences = {
  theme: "light",
  compactMode: false,
  showCompletedTasks: true,
  taskSortOrder: "date",
};

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    if (typeof window === "undefined") return defaultPreferences;
    const saved = localStorage.getItem("userPreferences");
    if (saved) {
      try {
        return { ...defaultPreferences, ...JSON.parse(saved) };
      } catch {
        return defaultPreferences;
      }
    }
    return defaultPreferences;
  });

  useEffect(() => {
    // Apply theme and colors on mount
    document.documentElement.classList.toggle(
      "dark",
      preferences.theme === "dark",
    );

    const savedColor = localStorage.getItem("selectedColor");
    if (savedColor) {
      const themeColors = [
        { name: "Blue", value: "221.2 83.2% 53.3%" },
        { name: "Green", value: "142 76% 36%" },
        { name: "Purple", value: "262 83% 58%" },
        { name: "Orange", value: "24 95% 53%" },
      ];
      const color = themeColors.find((c) => c.name === savedColor);
      if (color) {
        document.documentElement.style.setProperty("--primary", color.value);
      }
    }
  }, [preferences.theme]);

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K],
  ) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    localStorage.setItem("userPreferences", JSON.stringify(newPreferences));
  };

  return {
    preferences,
    updatePreference,
  };
}
