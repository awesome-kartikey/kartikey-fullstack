// hooks/useUserPreferences.ts
'use client';

import { useState, useEffect } from 'react';

interface UserPreferences {
  theme: 'light' | 'dark';
  compactMode: boolean;
  showCompletedTasks: boolean;
  taskSortOrder: 'date' | 'priority' | 'title';
}

const defaultPreferences: UserPreferences = {
  theme: 'light',
  compactMode: false,
  showCompletedTasks: true,
  taskSortOrder: 'date',
};

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  useEffect(() => {
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
      try {
        setPreferences({ ...defaultPreferences, ...JSON.parse(saved) });
      } catch (error) {
        console.error('Failed to parse user preferences:', error);
      }
    }
  }, []);

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    localStorage.setItem('userPreferences', JSON.stringify(newPreferences));
  };

  return {
    preferences,
    updatePreference,
  };
}