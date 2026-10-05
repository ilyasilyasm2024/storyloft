/**
 * ─────────────────────────────────────────────────────────────
 *  STORIES DATA
 * ─────────────────────────────────────────────────────────────
 *  To add a story, create src/data/stories/<id>.js (copy bint-elkhaddama.js)
 *  and add it to the array below. Writing guide: STORY_RULES.md
 *
 *  Story fields:
 *    id          – unique, URL-safe slug (used in the URL)
 *    title       – story title
 *    author      – author name
 *    genre       – primary genre (shown as badge, used for filtering)
 *    tags        – extra genre tags shown on the details page
 *    cover       – cover image URL (portrait, ~2:3 ratio, 800×1200 recommended)
 *    summary     – 1–2 sentence teaser for the home page card
 *    description – full description for the story details page
 *    lang        – language code of the text (the whole site is Arabic / right-to-left)
 *    chapters    – EXACTLY 12 items: { title, content }
 *
 *  Chapter content is plain text. Separate paragraphs with a blank line.
 *  Chapters 1–4 are free; 5–12 are locked (see src/config.js).
 * ─────────────────────────────────────────────────────────────
 */

import { CHAPTERS_PER_STORY } from "../config.js";
import bintElkhaddama from "./stories/bint-elkhaddama.js";

export const stories = [
  bintElkhaddama,
  // Add new stories here: import them from ./stories/<id>.js like the one above.
];

/* ─────────────────────────── Helpers ─────────────────────────── */

export const getStoryById = (id) => stories.find((story) => story.id === id);

/** Unique primary genres, alphabetically sorted (used by the genre filter). */
export const getAllGenres = () => [...new Set(stories.map((s) => s.genre))].sort();

/**
 * Other stories ranked by similarity: same genre scores 2, each shared tag scores 1.
 * Ties keep the order of the `stories` array.
 */
export function getSuggestedStories(storyId, limit = 4) {
  const current = getStoryById(storyId);
  if (!current) return stories.slice(0, limit);

  const score = (s) =>
    (s.genre === current.genre ? 2 : 0) + s.tags.filter((t) => current.tags.includes(t)).length;

  return stories
    .filter((s) => s.id !== storyId)
    .map((s) => ({ story: s, score: score(s) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ story }) => story);
}

/** Warns in the console (dev only) if any story breaks the data rules. */
export function validateStories() {
  const ids = new Set();
  for (const story of stories) {
    if (ids.has(story.id)) console.warn(`[storiesData] Duplicate story id: "${story.id}"`);
    ids.add(story.id);

    if (story.chapters?.length !== CHAPTERS_PER_STORY) {
      console.warn(
        `[storiesData] "${story.title}" has ${story.chapters?.length ?? 0} chapters; expected exactly ${CHAPTERS_PER_STORY}.`,
      );
    }
  }
}
