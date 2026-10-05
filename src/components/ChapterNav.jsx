import { Link } from "react-router";
import { ChevronLeftIcon, ChevronRightIcon } from "./Icons.jsx";
import { chapterPath, storyPath } from "../utils/chapters.js";

const card =
  "group flex min-h-16 items-center gap-2 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-stone-200/70 transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] dark:bg-stone-900 dark:ring-stone-800 sm:p-4";

/**
 * Previous / Next chapter buttons.
 * Right-to-left layout: "previous" sits on the right (pointing →), "next" on the left (pointing ←).
 */
export default function ChapterNav({ story, chapterNumber, isUnlocked }) {
  const total = story.chapters.length;
  const prev = chapterNumber > 1 ? chapterNumber - 1 : null;
  const next = chapterNumber < total ? chapterNumber + 1 : null;

  return (
    <nav aria-label="التنقل بين الفصول" className="mx-auto mt-14 grid max-w-2xl grid-cols-2 gap-3 px-4 sm:px-6">
      {prev ? (
        <Link to={chapterPath(story.id, prev)} className={card}>
          <ChevronRightIcon className="shrink-0 text-stone-400 transition group-hover:translate-x-0.5" />
          <span className="min-w-0">
            <span className="block text-xs text-stone-400">الفصل السابق</span>
            <span className="block truncate text-sm font-medium">{story.chapters[prev - 1].title}</span>
          </span>
        </Link>
      ) : (
        <span />
      )}

      {next ? (
        <Link to={chapterPath(story.id, next)} className={`${card} justify-end text-end`}>
          <span className="min-w-0">
            <span className="block text-xs text-stone-400">الفصل التالي {isUnlocked(story.id, next) ? "" : "🔒"}</span>
            <span className="block truncate text-sm font-medium">{story.chapters[next - 1].title}</span>
          </span>
          <ChevronLeftIcon className="shrink-0 text-stone-400 transition group-hover:-translate-x-0.5" />
        </Link>
      ) : (
        <Link to={storyPath(story.id)} className={`${card} justify-end text-end`}>
          <span>
            <span className="block text-xs text-stone-400">النهاية</span>
            <span className="block text-sm font-medium">العودة إلى القصة</span>
          </span>
          <ChevronLeftIcon className="shrink-0 text-stone-400" />
        </Link>
      )}
    </nav>
  );
}
