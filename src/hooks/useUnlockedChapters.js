import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage.js";
import { isFreeChapter, unlockKey } from "../utils/chapters.js";

/**
 * Tracks which locked chapters the reader has unlocked.
 * Stored in localStorage as ["storyId:chapterNumber", ...].
 */
export function useUnlockedChapters() {
  const [unlocked, setUnlocked] = useLocalStorage("unlocked-chapters", []);

  /** True when the chapter is free or has been unlocked. */
  const isUnlocked = useCallback(
    (storyId, chapterNumber) =>
      isFreeChapter(chapterNumber) || unlocked.includes(unlockKey(storyId, chapterNumber)),
    [unlocked],
  );

  const unlock = useCallback(
    (storyId, chapterNumber) => {
      const key = unlockKey(storyId, chapterNumber);
      setUnlocked((prev) => (prev.includes(key) ? prev : [...prev, key]));
    },
    [setUnlocked],
  );

  return { isUnlocked, unlock };
}
