/**
 * Global app configuration.
 *
 * ADSTERRA_DIRECT_LINK is the smart link opened in a new tab on each "Unlock" click.
 * It is public by nature (the browser opens it), so it lives here, not in .env.
 */
// export const ADSTERRA_DIRECT_LINK = "link";
export const ADSTERRA_DIRECT_LINK = "https://asiafilm.org/4/f4e48e43684000a4801a658365ad7036";

/** Every story must contain exactly this many chapters. */
export const CHAPTERS_PER_STORY = 12;

/** Chapters 1..FREE_CHAPTER_COUNT are free; the rest are locked. */
export const FREE_CHAPTER_COUNT = 4;

/** How many "Unlock Chapter" clicks a locked chapter requires. */
export const CLICKS_TO_UNLOCK = 3;

/** Site name, used in browser tab titles. */
export const SITE_NAME = "Storyloft";

/**
 * Google Analytics 4 measurement ID. Set to "" to turn tracking off.
 * Tracking only runs in production builds (the deployed site), never in `npm run dev`.
 */
export const GA_MEASUREMENT_ID = "G-X6EW2NXRWF";
