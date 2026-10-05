/** Color per genre. Add an entry here when you introduce a new genre. */
const GENRE_STYLES = {
  Fantasy: "bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-200",
  Mystery: "bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-200",
  Romance: "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-200",
  "Sci-Fi": "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200",
};
const FALLBACK = "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200";

export default function GenreBadge({ genre, className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${GENRE_STYLES[genre] ?? FALLBACK} ${className}`}
    >
      {genre}
    </span>
  );
}
