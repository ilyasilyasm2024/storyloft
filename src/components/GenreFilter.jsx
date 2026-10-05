/** Horizontally scrollable genre chips on mobile, wrapping on larger screens. */
export default function GenreFilter({ genres, selected, onSelect }) {
  const options = ["All", ...genres];

  return (
    <div
      role="radiogroup"
      aria-label="Filter by genre"
      className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-1 sm:mx-0 sm:flex-wrap sm:px-0"
    >
      {options.map((genre) => {
        const active = genre === selected;
        return (
          <button
            key={genre}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onSelect(genre)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition active:scale-95 ${
              active
                ? "bg-stone-900 text-white shadow-md dark:bg-amber-400 dark:text-stone-950"
                : "bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-100 dark:bg-stone-900 dark:text-stone-300 dark:ring-stone-800 dark:hover:bg-stone-800"
            }`}
          >
            {genre}
          </button>
        );
      })}
    </div>
  );
}
