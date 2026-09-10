import { useCallback, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const KEY = "myp.theme";

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
}

export function ThemeToggle({ defaultDark = false }: { defaultDark?: boolean }) {
  const [dark, setDark] = useState(defaultDark);

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = saved ? saved === "dark" : defaultDark || prefers;
    setDark(initial);
    applyTheme(initial);
    return () => applyTheme(false);
  }, [defaultDark]);

  const toggle = useCallback(() => {
    setDark((d) => {
      const next = !d;
      localStorage.setItem(KEY, next ? "dark" : "light");
      applyTheme(next);
      return next;
    });
  }, []);

  return (
    <button
      onClick={toggle}
      role="switch"
      aria-checked={dark}
      aria-label="Toggle dark mode"
      className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
    >
      {dark ? <Moon className="h-3.5 w-3.5 text-primary" /> : <Sun className="h-3.5 w-3.5 text-primary" />}
      {dark ? "Dark" : "Light"}
      <span
        className={`relative h-4 w-7 rounded-full transition-colors ${dark ? "bg-primary" : "bg-muted"}`}
      >
        <span
          className={`absolute top-0.5 h-3 w-3 rounded-full bg-card shadow transition-all ${
            dark ? "left-3.5" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}
