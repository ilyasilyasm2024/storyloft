import { useParams } from "react-router";
import ReaderView from "../components/ReaderView.jsx";
import UnlockLocker from "../components/UnlockLocker.jsx";
import NotFound from "./NotFound.jsx";
import { getStoryById } from "../data/storiesData.js";
import { useUnlockedChapters } from "../hooks/useUnlockedChapters.js";
import { ADSTERRA_DIRECT_LINK } from "../config.js";

/** Decides between the open reader and the locked reader + UnlockLocker. */
export default function ChapterPage() {
  const { storyId, chapterNumber } = useParams();
  const { isUnlocked, unlock } = useUnlockedChapters();

  const story = getStoryById(storyId);
  const number = Number(chapterNumber);
  if (!story || !Number.isInteger(number) || number < 1 || number > story.chapters.length) {
    return <NotFound message="هذا الفصل غير موجود." />;
  }

  const locked = !isUnlocked(story.id, number);

  return (
    <ReaderView story={story} chapterNumber={number} locked={locked}>
      {locked && (
        <UnlockLocker
          key={`${story.id}-${number}`} // reset the click counter per chapter
          directLink={ADSTERRA_DIRECT_LINK}
          onUnlock={() => unlock(story.id, number)}
        />
      )}
    </ReaderView>
  );
}
