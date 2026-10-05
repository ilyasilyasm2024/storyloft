import { Link, useMatch } from "react-router";
import ThemeToggle from "./ThemeToggle.jsx";
import { BookIcon } from "./Icons.jsx";

/** Global top bar. Hidden on chapter pages, where ReaderToolbar takes over. */
export default function Header() {
  const isReading = useMatch("/story/:storyId/chapter/:chapterNumber");
  if (isReading) return null;

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/70 bg-stone-50/80 backdrop-blur-md dark:border-stone-800/80 dark:bg-stone-950/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-serif text-xl font-semibold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500 text-white shadow-sm shadow-amber-500/40">
            <BookIcon width={18} height={18} />
          </span>
          Storyloft
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
