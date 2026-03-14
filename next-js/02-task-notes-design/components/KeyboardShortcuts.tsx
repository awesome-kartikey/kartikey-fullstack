"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function KeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName;
      if (activeTag === "INPUT" || activeTag === "TEXTAREA") return;

      if (e.key.toLowerCase() === "n") {
        e.preventDefault();
        router.push("/tasks/new");
      }

      if (e.key.toLowerCase() === "t") {
        e.preventDefault();
        router.push("/tasks");
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return null;
}
