"use client";

import { useState } from "react";

// HSL values matching our globals.css structure
const themeColors =[
  { name: "Blue", value: "221.2 83.2% 53.3%" },
  { name: "Green", value: "142 76% 36%" },
  { name: "Purple", value: "262 83% 58%" },
  { name: "Orange", value: "24 95% 53%" },
];

export function ColorPicker() {
  const [selected, setSelected] = useState(themeColors[0]);

  const applyColor = (color: typeof themeColors[0]) => {
    setSelected(color);
    // This dynamically overrides the --primary CSS variable in the browser!
    document.documentElement.style.setProperty("--primary", color.value);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-500 mr-2">Theme:</span>
      {themeColors.map((color) => (
        <button
          key={color.name}
          onClick={() => applyColor(color)}
          className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${
            selected.name === color.name ? "border-slate-900 dark:border-white" : "border-transparent"
          }`}
          style={{ backgroundColor: `hsl(${color.value})` }}
          aria-label={`Change theme to ${color.name}`}
        />
      ))}
    </div>
  );
}