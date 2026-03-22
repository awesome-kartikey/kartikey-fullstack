// components/ThemeToggle.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useUserPreferences } from "@/hooks/useUserPreferences";

export function ThemeToggle() {
  // const [theme, setTheme] = useState<"light" | "dark">("light");
  const { preferences, updatePreference } = useUserPreferences();

  // useEffect(() => {
  //   // Get saved theme or default to light
  //   const savedTheme =
  //     (localStorage.getItem("theme") as "light" | "dark") || "light";
  //   setTheme(savedTheme);
  //   document.documentElement.classList.toggle("dark", savedTheme === "dark");
  // }, []);

  const toggleTheme = () => {
    const newTheme = preferences.theme === "light" ? "dark" : "light";
    updatePreference("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 border-border/40 hover:bg-muted/50 transition-colors"
    >
      {preferences.theme === "light" ? (
        <Moon className="h-4 w-4 text-foreground" />
      ) : (
        <Sun className="h-4 w-4 text-primary" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
