import { useMatch } from "react-router";

export default function Footer() {
  if (useMatch("/story/:storyId/chapter/:chapterNumber")) return null;

  return (
    <footer className="mt-16 border-t border-stone-200/70 py-8 text-center text-sm text-stone-500 dark:border-stone-800/80 dark:text-stone-400">
      © {new Date().getFullYear()} Inkwell · Stories worth staying up for.
    </footer>
  );
}
