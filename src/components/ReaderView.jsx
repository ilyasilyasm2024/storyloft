import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import ReaderToolbar from "./ReaderToolbar.jsx";
import ChapterNav from "./ChapterNav.jsx";
import SuggestedStories from "./SuggestedStories.jsx";
import { useFontSize } from "../hooks/useReaderPrefs.js";
import { useUnlockedChapters } from "../hooks/useUnlockedChapters.js";
import { chapterPath, splitParagraphs } from "../utils/chapters.js";

/**
 * The reading interface.
 * When `locked` is true, only a blurred teaser is rendered (the full text never
 * reaches the DOM) and `children` (the UnlockLocker overlay) sits on top of it.
 */
export default function ReaderView({ story, chapterNumber, locked, children }) {
  const chapter = story.chapters[chapterNumber - 1];
  const total = story.chapters.length;
  const font = useFontSize();
  const { isUnlocked } = useUnlockedChapters();
  const navigate = useNavigate();
  const paragraphs = useMemo(() => splitParagraphs(chapter.content), [chapter.content]);

  // Keyboard shortcuts for desktop readers. The app is right-to-left,
  // so → goes back to the previous chapter and ← goes forward.
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.("input, textarea") || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowRight" && chapterNumber > 1) navigate(chapterPath(story.id, chapterNumber - 1));
      if (e.key === "ArrowLeft" && chapterNumber < total) navigate(chapterPath(story.id, chapterNumber + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, story.id, chapterNumber, total]);

  const textClass = "font-serif leading-[2.1] text-stone-800 dark:text-stone-200";

  return (
    <div className="pb-16">
      <ReaderToolbar story={story} chapterNumber={chapterNumber} font={font} />

      <article lang={story.lang ?? "ar"} className="mx-auto max-w-2xl px-5 pt-10 sm:px-6 sm:pt-14">
        <header className="mb-10 text-center">
          <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
            الفصل {chapterNumber} من {total}
          </p>
          <h1 className="mt-3 text-balance font-serif text-3xl font-bold leading-snug sm:text-4xl">{chapter.title}</h1>
          <p className="mt-3 text-sm text-stone-500 dark:text-stone-400">
            {story.title} · {story.author}
          </p>
          <div className="mx-auto mt-6 h-px w-16 bg-stone-300 dark:bg-stone-700" />
        </header>

        <div className="relative">
          {locked ? (
            // Teaser only: first paragraph, blurred and non-interactive.
            <div aria-hidden="true" className="pointer-events-none min-h-[30rem] select-none blur-[5px]">
              <p className={textClass} style={{ fontSize: font.fontSize }}>
                {paragraphs[0]}
              </p>
            </div>
          ) : (
            <div
              key={`${story.id}-${chapterNumber}`}
              className={`animate-fade-in space-y-[1.15em] transition-[font-size] duration-200 ${textClass}`}
              style={{ fontSize: font.fontSize }}
            >
              {paragraphs.map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </div>
          )}

          {children}
        </div>
      </article>

      <ChapterNav story={story} chapterNumber={chapterNumber} isUnlocked={isUnlocked} />

      {/* Wide screens: fixed in the empty left margin beside the text column. */}
      <SuggestedStories storyId={story.id} className="fixed left-6 top-24 hidden w-56 xl:block 2xl:left-12 2xl:w-64" />

      {/* Smaller screens: scrollable row at the end of the chapter. */}
      <SuggestedStories storyId={story.id} variant="row" limit={6} className="mx-auto mt-14 max-w-2xl px-4 sm:px-6 xl:hidden" />
    </div>
  );
}
