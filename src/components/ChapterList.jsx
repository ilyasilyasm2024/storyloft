import { Link } from "react-router";
import { useUnlockedChapters } from "../hooks/useUnlockedChapters.js";
import { chapterPath, isFreeChapter } from "../utils/chapters.js";

/** FREE / LOCKED / UNLOCKED pill shown next to each chapter. */
function AccessBadge({ free, unlocked }) {
  if (free)
    return (
      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold tracking-wide text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
        FREE
      </span>
    );
  if (unlocked)
    return (
      <span className="rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-bold tracking-wide text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
        🔓 UNLOCKED
      </span>
    );
  return (
    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold tracking-wide text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">
      🔒 LOCKED
    </span>
  );
}

/** Table of contents for a story. */
export default function ChapterList({ story }) {
  const { isUnlocked } = useUnlockedChapters();

  return (
    <ol className="divide-y divide-stone-100 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200/70 dark:divide-stone-800 dark:bg-stone-900 dark:ring-stone-800">
      {story.chapters.map((chapter, index) => {
        const number = index + 1;
        const free = isFreeChapter(number);

        return (
          <li key={number}>
            <Link
              to={chapterPath(story.id, number)}
              className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-stone-50 active:bg-stone-100 dark:hover:bg-stone-800/60 dark:active:bg-stone-800"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-stone-100 text-sm font-semibold tabular-nums text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                {number}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-medium uppercase tracking-wider text-stone-400">
                  Chapter {number}
                </span>
                <span className="block truncate font-medium">{chapter.title}</span>
              </span>
              <AccessBadge free={free} unlocked={!free && isUnlocked(story.id, number)} />
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
