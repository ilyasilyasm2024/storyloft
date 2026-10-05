import { useMemo } from "react";
import { useSearchParams } from "react-router";
import SearchBar from "../components/SearchBar.jsx";
import GenreFilter from "../components/GenreFilter.jsx";
import StoryCard from "../components/StoryCard.jsx";
import { getAllGenres, stories } from "../data/storiesData.js";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";

/** "قصة واحدة" / "قصتان" / "3 قصص" / "11 قصة" — Arabic counting rules. */
const storyCount = (n) => (n === 1 ? "قصة واحدة" : n === 2 ? "قصتان" : n <= 10 ? `${n} قصص` : `${n} قصة`);

export default function Home() {
  // Search + genre live in the URL (?q=&genre=) so they survive Back navigation.
  useDocumentTitle(null);
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const genre = params.get("genre") ?? "All";
  const genres = useMemo(getAllGenres, []);

  const setParam = (key, value, defaultValue = "") => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (!value || value === defaultValue) next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true },
    );
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return stories.filter(
      (s) =>
        (genre === "All" || s.genre === genre) &&
        (!q || [s.title, s.author, s.summary, ...s.tags].some((field) => field.toLowerCase().includes(q))),
    );
  }, [query, genre]);

  return (
    <div className="mx-auto max-w-6xl px-4">
      <section className="pb-6 pt-8 sm:pb-10 sm:pt-14">
        <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
          {storyCount(stories.length)} · فصول جديدة كل أسبوع
        </p>
        <h1 className="mt-2 max-w-2xl text-balance font-serif text-3xl font-bold leading-snug sm:text-5xl">
          قصص تستحق السهر.
        </h1>
        <p className="mt-3 max-w-xl text-stone-600 dark:text-stone-400">
          أول أربعة فصول من كل قصة مجانية. اختر قصتك وابدأ القراءة.
        </p>

        <div className="mt-6 space-y-3">
          <SearchBar value={query} onChange={(v) => setParam("q", v)} />
          <GenreFilter genres={genres} selected={genre} onSelect={(g) => setParam("genre", g, "All")} />
        </div>
      </section>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {filtered.map((story, i) => (
            <div key={story.id} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
              <StoryCard story={story} />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-stone-300 px-6 py-16 text-center dark:border-stone-700">
          <p className="text-4xl">📚</p>
          <p className="mt-3 font-medium">لا توجد قصص تطابق بحثك.</p>
          <button
            type="button"
            onClick={() => setParams({}, { replace: true })}
            className="mt-4 rounded-full bg-stone-900 px-5 py-2 text-sm font-medium text-white dark:bg-amber-400 dark:text-stone-950"
          >
            مسح البحث
          </button>
        </div>
      )}
    </div>
  );
}
