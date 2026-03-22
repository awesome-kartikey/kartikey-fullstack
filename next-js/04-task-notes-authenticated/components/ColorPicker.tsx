"use client";

import { useEffect, useState } from "react";

// HSL values matching our globals.css structure
const themeColors = [
  { name: "Blue", value: "221.2 83.2% 53.3%" },
  { name: "Green", value: "142 76% 36%" },
  { name: "Purple", value: "262 83% 58%" },
  { name: "Orange", value: "24 95% 53%" },
];

export function ColorPicker() {
  const [selected, setSelected] = useState(themeColors[0]);

  useEffect(() => {
    const savedName = localStorage.getItem("selectedColor");
    if (savedName) {
      const savedColor = themeColors.find((c) => c.name === savedName);
      if (savedColor) {
        setSelected(savedColor);
        document.documentElement.style.setProperty(
          "--primary",
          savedColor.value,
        );
      }
    }
  }, []);

  const applyColor = (color: (typeof themeColors)[0]) => {
    setSelected(color);
    // This dynamically overrides the --primary CSS variable in the browser!
    document.documentElement.style.setProperty(
      "--primary",
      color.value,
    );
    localStorage.setItem("selectedColor", color.name);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Accent</span>
      <div className="flex items-center gap-2">
        {themeColors.map((color) => (
          <button
            key={color.name}
            onClick={() => applyColor(color)}
            className={`w-4 h-4 rounded-full transition-all duration-300 hover:scale-125 focus:outline-none ${
              selected.name === color.name
                ? "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110"
                : "hover:ring-1 hover:ring-muted-foreground/40"
            }`}
            style={{ backgroundColor: `hsl(${color.value})` }}
            aria-label={`Change theme to ${color.name}`}
          />
        ))}
      </div>
    </div>
  );
}
