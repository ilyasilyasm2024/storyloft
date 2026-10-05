import { Link } from "react-router";
import GenreBadge from "./GenreBadge.jsx";
import { getSuggestedStories } from "../data/storiesData.js";
import { storyPath } from "../utils/chapters.js";

/**
 * "You might also like" list of other stories.
 *   variant="sidebar" – compact vertical list for the left column (large screens)
 *   variant="row"     – horizontally scrollable cover row (phones / tablets)
 */
export default function SuggestedStories({ storyId, variant = "sidebar", limit = 4, className = "" }) {
  const suggestions = getSuggestedStories(storyId, limit);
  if (suggestions.length === 0) return null;

  const heading = (
    <h2 className="mb-3 text-sm font-bold text-stone-500 dark:text-stone-400">
      قد يعجبك أيضاً
    </h2>
  );

  if (variant === "row") {
    return (
      <section className={className} aria-label="قصص مقترحة">
        {heading}
        <div className="no-scrollbar -mx-4 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 pb-2">
          {suggestions.map((story) => (
            <Link key={story.id} to={storyPath(story.id)} className="group w-32 shrink-0 snap-start sm:w-36">
              <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-stone-200 shadow-sm ring-1 ring-stone-200/70 dark:bg-stone-800 dark:ring-stone-800">
                <img
                  src={story.cover}
                  alt={`غلاف ${story.title}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <GenreBadge genre={story.genre} overlay className="absolute start-2 top-2 text-[10px]" />
              </div>
              <p className="mt-2 line-clamp-2 font-serif text-sm font-semibold leading-snug">{story.title}</p>
              <p className="text-xs text-stone-500 dark:text-stone-400">{story.author}</p>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  return (
    <aside className={className} aria-label="قصص مقترحة">
      {heading}
      <ul className="space-y-1">
        {suggestions.map((story) => (
          <li key={story.id}>
            <Link
              to={storyPath(story.id)}
              className="group flex gap-3 rounded-xl p-2 transition hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-stone-200/70 dark:hover:bg-stone-900 dark:hover:ring-stone-800"
            >
              <img
                src={story.cover}
                alt=""
                loading="lazy"
                className="aspect-[2/3] w-14 shrink-0 rounded-lg object-cover shadow-sm ring-1 ring-black/5"
              />
              <span className="min-w-0 py-0.5">
                <span className="line-clamp-2 font-serif text-sm font-semibold leading-snug group-hover:text-amber-700 dark:group-hover:text-amber-400">
                  {story.title}
                </span>
                <span className="mt-0.5 block truncate text-xs text-stone-500 dark:text-stone-400">{story.author}</span>
                <GenreBadge genre={story.genre} className="mt-1.5 text-[10px]" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
