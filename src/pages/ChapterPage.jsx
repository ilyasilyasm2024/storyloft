import { useEffect } from "react";
import { useParams } from "react-router";
import ReaderView from "../components/ReaderView.jsx";
import UnlockLocker from "../components/UnlockLocker.jsx";
import NotFound from "./NotFound.jsx";
import { getStoryById } from "../data/storiesData.js";
import { useUnlockedChapters } from "../hooks/useUnlockedChapters.js";
import { ADSTERRA_DIRECT_LINK } from "../config.js";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { trackEvent } from "../utils/analytics.js";

/** Decides between the open reader and the locked reader + UnlockLocker. */
export default function ChapterPage() {
  const { storyId, chapterNumber } = useParams();
  const { isUnlocked, unlock } = useUnlockedChapters();

  const story = getStoryById(storyId);
  const number = Number(chapterNumber);
  const valid = Boolean(story) && Number.isInteger(number) && number >= 1 && number <= story.chapters.length;
  const locked = valid && !isUnlocked(story.id, number);
  // Shared analytics parameters for every event about this chapter.
  const eventParams = valid ? { story_id: story.id, story_title: story.title, chapter_number: number } : null;

  useDocumentTitle(valid ? `${story.chapters[number - 1].title} · ${story.title}` : "صفحة غير موجودة");

  // One chapter_view per chapter opened. `locked` is read at that moment on purpose,
  // so unlocking doesn't count as a second view.
  useEffect(() => {
    if (eventParams) trackEvent("chapter_view", { ...eventParams, chapter_locked: locked });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyId, number]);

  if (!valid) return <NotFound message="هذا الفصل غير موجود." />;

  return (
    <ReaderView story={story} chapterNumber={number} locked={locked}>
      {locked && (
        <UnlockLocker
          key={`${story.id}-${number}`} // reset the click counter per chapter
          directLink={ADSTERRA_DIRECT_LINK}
          onUnlock={() => unlock(story.id, number)}
          eventParams={eventParams}
        />
      )}
    </ReaderView>
  );
}
