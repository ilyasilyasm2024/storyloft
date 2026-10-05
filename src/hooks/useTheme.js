import { useCallback, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage.js";

const systemPrefersDark = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;

/** Light/dark theme, persisted and applied to <html class="dark">. */
export function useTheme() {
  const [theme, setTheme] = useLocalStorage("theme", systemPrefersDark() ? "dark" : "light");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#0c0a09" : "#fafaf9");
  }, [theme]);

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    [setTheme],
  );

  return { theme, toggleTheme };
}
