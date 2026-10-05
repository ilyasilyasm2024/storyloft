import { useEffect, useState } from "react";
import { useLocalStorage } from "./useLocalStorage.js";

const MIN_FONT = 14;
const MAX_FONT = 28;
const STEP = 2;

/** Reader font size in px, persisted across visits. */
export function useFontSize() {
  const [fontSize, setFontSize] = useLocalStorage("font-size", 18);

  return {
    fontSize,
    canDecrease: fontSize > MIN_FONT,
    canIncrease: fontSize < MAX_FONT,
    decrease: () => setFontSize((s) => Math.max(MIN_FONT, s - STEP)),
    increase: () => setFontSize((s) => Math.min(MAX_FONT, s + STEP)),
  };
}

/** Page scroll progress from 0 to 1 (used for the reading progress bar). */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return progress;
}
