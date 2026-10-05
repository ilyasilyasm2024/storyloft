/**
 * Runs after `vite build` (see the "build" script in package.json).
 *
 * Facebook, WhatsApp, Telegram and most crawlers don't run JavaScript, so a plain
 * single-page app shows the same empty preview for every link. This script writes a
 * real HTML file for every page, with its own <title>, description, Open Graph image
 * and readable content. React then takes over in the browser as usual.
 *
 * Output (served by Vercel thanks to "cleanUrls" in vercel.json):
 *   dist/index.html                          → /
 *   dist/story/<id>.html                     → /story/<id>
 *   dist/story/<id>/chapter/<n>.html         → /story/<id>/chapter/<n>
 *   dist/sitemap.xml, dist/robots.txt
 *
 * The public site URL comes from SITE_URL, or from Vercel's VERCEL_PROJECT_PRODUCTION_URL
 * (which automatically becomes your custom domain once you add one).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { stories } from "../src/data/storiesData.js";
import { FREE_CHAPTER_COUNT, SITE_NAME } from "../src/config.js";
import { chapterPath, isFreeChapter, splitParagraphs, storyPath } from "../src/utils/chapters.js";

const DIST = "dist";
const SITE_URL = (
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:4173")
).replace(/\/$/, "");

const template = readFileSync(join(DIST, "index.html"), "utf8");
if (!template.includes("<!--seo-->")) throw new Error("index.html is missing the <!--seo--> marker");

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const clip = (s, n = 160) => (s.length > n ? `${s.slice(0, n - 1).trim()}…` : s);
const abs = (path) => (path.startsWith("http") ? path : SITE_URL + path);

/** Picks the most specific share image that exists in public/og. */
function ogImage(storyId, chapterNumber) {
  const candidates = [
    storyId && chapterNumber && `/og/${storyId}-${chapterNumber}.jpg`,
    storyId && `/og/${storyId}.jpg`,
    "/og/default.jpg",
  ].filter(Boolean);
  return candidates.find((p) => existsSync(join(DIST, p))) ?? null;
}

const urls = [];

function writePage({ path, title, description, image, type = "website", body }) {
  const url = SITE_URL + path;
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — روايات عربية`;
  const tags = [
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:locale" content="ar_AR" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:title" content="${esc(title ?? fullTitle)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    image && `<meta property="og:image" content="${abs(image)}" />`,
    image && `<meta property="og:image:width" content="1200" />`,
    image && `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title ?? fullTitle)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    image && `<meta name="twitter:image" content="${abs(image)}" />`,
  ].filter(Boolean);

  const html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(fullTitle)}</title>`)
    .replace("<!--seo-->", tags.join("\n    "))
    // Readable content for crawlers; React replaces it as soon as the app starts.
    .replace('<div id="root"></div>', `<div id="root"><div style="max-width:42rem;margin:0 auto;padding:2rem 1.25rem;line-height:2">${body}</div></div>`);

  const file = path === "/" ? join(DIST, "index.html") : join(DIST, `${path}.html`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  urls.push(url);
}

// Home
writePage({
  path: "/",
  title: null,
  description: `روايات عربية مشوّقة تُقرأ فصلاً بفصل. أول ${FREE_CHAPTER_COUNT} فصول من كل قصة مجانية.`,
  image: ogImage(),
  body:
    `<h1>${SITE_NAME} — قصص تستحق السهر</h1><ul>` +
    stories.map((s) => `<li><a href="${storyPath(s.id)}">${esc(s.title)}</a> — ${esc(s.summary)}</li>`).join("") +
    `</ul>`,
});

for (const story of stories) {
  // Story page
  writePage({
    path: storyPath(story.id),
    title: story.title,
    description: clip(story.description),
    image: ogImage(story.id) ?? story.cover,
    type: "book",
    body:
      `<h1>${esc(story.title)}</h1><p>بقلم ${esc(story.author)} · ${esc(story.genre)}</p><p>${esc(story.description)}</p><h2>الفهرس</h2><ol>` +
      story.chapters.map((c, i) => `<li><a href="${chapterPath(story.id, i + 1)}">${esc(c.title)}</a></li>`).join("") +
      `</ol>`,
  });

  // Chapter pages
  story.chapters.forEach((chapter, i) => {
    const n = i + 1;
    const paragraphs = splitParagraphs(chapter.content);
    // Locked chapters only expose their first paragraph, like the app does.
    const shown = isFreeChapter(n) ? paragraphs : paragraphs.slice(0, 1);
    const nav = [
      n > 1 && `<a href="${chapterPath(story.id, n - 1)}">الفصل السابق</a>`,
      n < story.chapters.length && `<a href="${chapterPath(story.id, n + 1)}">الفصل التالي</a>`,
    ].filter(Boolean).join(" · ");

    writePage({
      path: chapterPath(story.id, n),
      title: `الفصل ${n}: ${chapter.title} · ${story.title}`,
      description: clip(paragraphs[0]),
      image: ogImage(story.id, n) ?? story.cover,
      type: "article",
      body:
        `<p><a href="${storyPath(story.id)}">${esc(story.title)}</a> · الفصل ${n} من ${story.chapters.length}</p>` +
        `<h1>${esc(chapter.title)}</h1>` +
        shown.map((p) => `<p>${esc(p)}</p>`).join("") +
        (isFreeChapter(n) ? "" : `<p><strong>🔒 هذا الفصل مقفول. افتحه على الموقع لتكمل القراءة.</strong></p>`) +
        `<p>${nav}</p>`,
    });
  });
}

writeFileSync(
  join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n") +
    `\n</urlset>\n`,
);
writeFileSync(join(DIST, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

console.log(`prerender: ${urls.length} pages + sitemap.xml + robots.txt for ${SITE_URL}`);
