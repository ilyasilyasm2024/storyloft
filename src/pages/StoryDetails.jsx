import { Link, useParams } from "react-router";
import ChapterList from "../components/ChapterList.jsx";
import SuggestedStories from "../components/SuggestedStories.jsx";
import GenreBadge from "../components/GenreBadge.jsx";
import { ChevronLeftIcon } from "../components/Icons.jsx";
import NotFound from "./NotFound.jsx";
import { getStoryById } from "../data/storiesData.js";
import { FREE_CHAPTER_COUNT } from "../config.js";
import { chapterPath, storyDir } from "../utils/chapters.js";

export default function StoryDetails() {
  const { storyId } = useParams();
  const story = getStoryById(storyId);
  if (!story) return <NotFound message="We couldn't find that story." />;

  return (
    <div className="animate-fade-in">
      {/* Hero with a blurred cover backdrop */}
      <section className="relative overflow-hidden">
        <img
          src={story.cover}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-125 object-cover opacity-30 blur-3xl dark:opacity-25"
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-stone-50 dark:to-stone-950" />

        <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-4 sm:pb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-1 rounded-full py-2 pr-3 text-sm text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white"
          >
            <ChevronLeftIcon width={18} height={18} /> All stories
          </Link>

          <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row sm:items-end sm:gap-10">
            <img
              src={story.cover}
              alt={`Cover of ${story.title}`}
              className="aspect-[2/3] w-44 rounded-2xl object-cover shadow-2xl ring-1 ring-black/10 sm:w-60"
            />

            <div className="text-center sm:text-left">
              <GenreBadge genre={story.genre} />
              <h1 dir={storyDir(story)} className="mt-3 text-balance font-serif text-3xl font-semibold leading-tight sm:text-5xl">
                {story.title}
              </h1>
              <p className="mt-2 text-stone-600 dark:text-stone-300">
                by <span className="font-semibold text-stone-900 dark:text-white">{story.author}</span>
              </p>

              <ul dir={storyDir(story)} className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start" aria-label="Tags">
                {story.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-stone-600 ring-1 ring-stone-200 dark:bg-stone-900/70 dark:text-stone-300 dark:ring-stone-700"
                  >
                    #{tag}
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-sm text-stone-500 dark:text-stone-400">
                {story.chapters.length} chapters · {FREE_CHAPTER_COUNT} free
              </p>

              <Link
                to={chapterPath(story.id, 1)}
                className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-amber-500 px-8 py-3.5 font-semibold text-white shadow-lg shadow-amber-500/30 transition hover:bg-amber-600 active:scale-[0.98] sm:w-auto"
              >
                Start Reading
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Left: suggestions sidebar (lg+). Right: description + table of contents. */}
      <div className="mx-auto max-w-6xl px-4 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10">
        <SuggestedStories storyId={story.id} className="hidden lg:sticky lg:top-20 lg:block lg:self-start" />

        <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <section>
            <h2 className="font-serif text-xl font-semibold">About this story</h2>
            <p dir={storyDir(story)} className="mt-3 leading-relaxed text-stone-700 dark:text-stone-300">{story.description}</p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold">Table of Contents</h2>
            <ChapterList story={story} />
          </section>
        </div>

        {/* Phones / tablets: suggestions as a scrollable row below the chapters */}
        <SuggestedStories storyId={story.id} variant="row" limit={6} className="mt-12 lg:hidden" />
      </div>
    </div>
  );
}
