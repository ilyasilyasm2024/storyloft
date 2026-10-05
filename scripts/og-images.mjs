/**
 * Generates the 1200×630 share images (Facebook, WhatsApp, Telegram, X previews)
 * into public/og/. Run it after adding or editing a story:
 *
 *   npm run og
 *
 * Needs a local Chrome/Chromium (set CHROME_PATH if it isn't /usr/bin/google-chrome).
 * The generated .jpg files are committed; Vercel does not run this script.
 */
import { mkdirSync } from "node:fs";
import puppeteer from "puppeteer-core";
import { stories } from "../src/data/storiesData.js";
import { FREE_CHAPTER_COUNT, SITE_NAME } from "../src/config.js";

const CHROME = process.env.CHROME_PATH || "/usr/bin/google-chrome";
const OUT = "public/og";

const esc = (s = "") => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** One share card: blurred cover background, cover on the right, text on the left. */
const card = ({ cover, kicker, title, subtitle, badge }) => `<!doctype html>
<html lang="ar" dir="rtl"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@600;700&family=Noto+Naskh+Arabic:wght@700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; font-family: Cairo, sans-serif; background: #0c0a09; color: #fff; position: relative; }
  .bg { position: absolute; inset: -60px; background: url("${cover}") center / cover; filter: blur(30px) brightness(.4); }
  .wrap { position: relative; display: flex; align-items: center; gap: 56px; height: 100%; padding: 0 72px; }
  .cover { width: 300px; height: 450px; border-radius: 24px; object-fit: cover; box-shadow: 0 30px 60px rgba(0,0,0,.55); flex: none; }
  .brand { display: flex; align-items: center; gap: 12px; font-size: 28px; font-weight: 700; color: #fbbf24; }
  .brand i { width: 36px; height: 36px; border-radius: 10px; background: #f59e0b; }
  .kicker { margin-top: 26px; font-size: 30px; font-weight: 600; color: #fcd34d; }
  h1 { margin-top: 6px; font-family: "Noto Naskh Arabic", serif; font-size: 80px; line-height: 1.3; }
  .sub { margin-top: 14px; font-size: 29px; line-height: 1.6; color: #e7e5e4; max-width: 700px; }
  .badge { display: inline-block; margin-top: 26px; padding: 8px 28px; border-radius: 999px; background: #f59e0b; color: #1c1917; font-size: 28px; font-weight: 700; }
</style></head>
<body><div class="bg"></div><div class="wrap">
  <img class="cover" src="${cover}">
  <div>
    <div class="brand"><i></i>${esc(SITE_NAME)}</div>
    ${kicker ? `<div class="kicker">${esc(kicker)}</div>` : ""}
    <h1>${esc(title)}</h1>
    ${subtitle ? `<div class="sub">${esc(subtitle)}</div>` : ""}
    ${badge ? `<div class="badge">${esc(badge)}</div>` : ""}
  </div>
</div></body></html>`;

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630 });

async function render(file, data) {
  await page.setContent(card(data), { waitUntil: "load", timeout: 60000 });
  // Make sure the cover image and the Arabic fonts are ready before the screenshot.
  await page.evaluate(async () => {
    await Promise.all([...document.images].map((img) => img.decode().catch(() => {})));
    await document.fonts.ready;
  });
  await page.screenshot({ path: `${OUT}/${file}`, type: "jpeg", quality: 85 });
  console.log("  ✓", file);
}

mkdirSync(OUT, { recursive: true });

await render("default.jpg", {
  cover: stories[0].cover,
  title: "قصص تستحق السهر",
  subtitle: "روايات عربية مشوّقة، فصل يشدّك للي بعده",
  badge: `أول ${FREE_CHAPTER_COUNT} فصول مجاناً`,
});

for (const story of stories) {
  await render(`${story.id}.jpg`, {
    cover: story.cover,
    kicker: `رواية · ${story.genre}`,
    title: story.title,
    subtitle: story.summary,
    badge: `اقرأ أول ${FREE_CHAPTER_COUNT} فصول مجاناً`,
  });
  for (const [i, chapter] of story.chapters.entries()) {
    const n = i + 1;
    await render(`${story.id}-${n}.jpg`, {
      cover: story.cover,
      kicker: `${story.title} · الفصل ${n}`,
      title: chapter.title,
      badge: n <= FREE_CHAPTER_COUNT ? "اقرأ الفصل مجاناً" : "تكملة القصة",
    });
  }
}

await browser.close();
