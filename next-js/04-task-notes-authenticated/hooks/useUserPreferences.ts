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
  const [preferences, setPreferences] =
    useState<UserPreferences>(defaultPreferences);

  useEffect(() => {
    const saved = localStorage.getItem("userPreferences");
    const savedColor = localStorage.getItem("selectedColor");
    
    if (saved) {
      try {
        const parsed = { ...defaultPreferences, ...JSON.parse(saved) };
        setPreferences(parsed);
        document.documentElement.classList.toggle(
          "dark",
          parsed.theme === "dark",
        );
      } catch (error) {
        console.error("Failed to parse user preferences:", error);
      }
    }

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
  }, []);

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
