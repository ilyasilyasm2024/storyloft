import { Link } from "react-router";
import GenreBadge from "./GenreBadge.jsx";
import { storyDir, storyPath } from "../utils/chapters.js";

/** Cover card used in the home page grid. */
export default function StoryCard({ story }) {
  return (
    <Link
      to={storyPath(story.id)}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200/70 transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/50 dark:bg-stone-900 dark:ring-stone-800"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-stone-200 dark:bg-stone-800">
        <img
          src={story.cover}
          alt={`Cover of ${story.title}`}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/50 to-transparent" />
        <GenreBadge genre={story.genre} className="absolute left-2.5 top-2.5 shadow-sm" />
        <span className="absolute bottom-2.5 left-2.5 text-xs font-medium text-white/90">
          {story.chapters.length} chapters
        </span>
      </div>

      <div dir={storyDir(story)} className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
        <h3 className="line-clamp-2 font-serif text-[15px] font-semibold leading-snug sm:text-lg">
          {story.title}
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400">by {story.author}</p>
        <p className="mt-1 line-clamp-3 text-[13px] leading-relaxed text-stone-600 dark:text-stone-300 sm:text-sm">
          {story.summary}
        </p>
      </div>
    </Link>
  );
}
