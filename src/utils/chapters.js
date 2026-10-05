import { FREE_CHAPTER_COUNT } from "../config.js";

/** Chapters 1–4 are free to read. */
export const isFreeChapter = (chapterNumber) => chapterNumber <= FREE_CHAPTER_COUNT;

/** Key used to remember an unlocked chapter in localStorage. */
export const unlockKey = (storyId, chapterNumber) => `${storyId}:${chapterNumber}`;

export const storyPath = (storyId) => `/story/${storyId}`;
export const chapterPath = (storyId, chapterNumber) => `/story/${storyId}/chapter/${chapterNumber}`;

/** Splits chapter text on blank lines into clean paragraphs. */
export function splitParagraphs(content = "") {
  const paragraphs = content
    .trim()
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  return paragraphs.length ? paragraphs : ["This chapter is coming soon."];
}
