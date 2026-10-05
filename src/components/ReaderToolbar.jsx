import { Link } from "react-router";
import ThemeToggle from "./ThemeToggle.jsx";
import { ChevronLeftIcon } from "./Icons.jsx";
import { useScrollProgress } from "../hooks/useReaderPrefs.js";
import { storyPath } from "../utils/chapters.js";

/** Sticky reading bar: back link, font size controls, theme toggle, progress bar. */
export default function ReaderToolbar({ story, chapterNumber, font }) {
  const progress = useScrollProgress();
  const btn =
    "grid h-10 w-10 place-items-center rounded-full font-serif font-semibold text-stone-600 transition hover:bg-stone-200/70 active:scale-95 disabled:pointer-events-none disabled:opacity-30 dark:text-stone-300 dark:hover:bg-stone-800";

  return (
    <div className="sticky top-0 z-30 border-b border-stone-200/70 bg-stone-50/85 backdrop-blur-md dark:border-stone-800/80 dark:bg-stone-950/85">
      <div className="mx-auto flex h-14 max-w-3xl items-center gap-1 px-2 sm:px-4">
        <Link
          to={storyPath(story.id)}
          className="flex min-w-0 flex-1 items-center gap-1 rounded-full py-2 pr-2 text-sm text-stone-600 transition hover:text-stone-900 dark:text-stone-300 dark:hover:text-white"
        >
          <ChevronLeftIcon className="shrink-0" />
          <span className="min-w-0">
            <span className="block truncate font-medium">{story.title}</span>
            <span className="block text-xs text-stone-400">Chapter {chapterNumber}</span>
          </span>
        </Link>

        <div className="flex items-center" role="group" aria-label="Font size">
          <button type="button" className={`${btn} text-sm`} onClick={font.decrease} disabled={!font.canDecrease} aria-label="Decrease font size">
            A−
          </button>
          <span className="w-7 text-center text-xs tabular-nums text-stone-400" aria-live="polite">
            {font.fontSize}
          </span>
          <button type="button" className={`${btn} text-lg`} onClick={font.increase} disabled={!font.canIncrease} aria-label="Increase font size">
            A+
          </button>
        </div>

        <ThemeToggle />
      </div>

      {/* Reading progress */}
      <div className="h-0.5 bg-transparent">
        <div className="h-full origin-left bg-amber-500 transition-transform duration-150" style={{ transform: `scaleX(${progress})` }} />
      </div>
    </div>
  );
}
