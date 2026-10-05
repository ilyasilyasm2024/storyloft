import { GA_MEASUREMENT_ID } from "../config.js";

/**
 * Google Analytics 4 (gtag.js) for a single-page app.
 * Disabled in development so local testing doesn't pollute the statistics.
 *
 * Custom events sent by the app (see ChapterPage, ReaderView, UnlockLocker):
 *   chapter_view      – a chapter page was opened          { story_id, story_title, chapter_number, chapter_locked }
 *   chapter_complete  – the reader scrolled to the end     { story_id, story_title, chapter_number }
 *   unlock_click      – a click on "افتح الفصل"            { story_id, story_title, chapter_number, click_number }
 *   chapter_unlocked  – all unlock clicks completed        { story_id, story_title, chapter_number }
 */
const enabled = Boolean(GA_MEASUREMENT_ID) && import.meta.env.PROD;

export function initAnalytics() {
  if (!enabled || window.gtag) return;

  window.dataLayer = window.dataLayer || [];
  // gtag must push the `arguments` object itself, not an array.
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  // Page views are sent manually on each route change (see trackPageView).
  window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

export function trackEvent(name, params = {}) {
  if (!enabled) return;
  window.gtag?.("event", name, params);
}

export function trackPageView(path) {
  // Wait one tick so the new page has already set document.title.
  setTimeout(() => {
    trackEvent("page_view", {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, 0);
}
