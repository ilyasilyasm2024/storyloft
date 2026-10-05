import { useTheme } from "../hooks/useTheme.js";
import { MoonIcon, SunIcon } from "./Icons.jsx";

/** Round icon button that switches between light and dark mode. */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-stone-600 transition hover:bg-stone-200/70 active:scale-95 dark:text-stone-300 dark:hover:bg-stone-800"
    >
      <span key={theme} className="animate-pop">
        {isDark ? <SunIcon /> : <MoonIcon />}
      </span>
    </button>
  );
}
