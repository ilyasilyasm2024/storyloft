import { useState } from "react";
import { CLICKS_TO_UNLOCK } from "../config.js";
import { trackEvent } from "../utils/analytics.js";

/**
 * Overlay that hides a locked chapter until the reader clicks "Unlock" N times.
 * Each click opens `directLink` in a new tab and decrements the counter;
 * at 0 it calls `onUnlock`, and the parent persists the unlocked state.
 *
 * Give it a `key` per chapter so the counter resets when the chapter changes.
 * `eventParams` (story/chapter info) is attached to the analytics events.
 */
export default function UnlockLocker({ directLink, onUnlock, eventParams, requiredClicks = CLICKS_TO_UNLOCK }) {
  const [remaining, setRemaining] = useState(requiredClicks);
  const completed = requiredClicks - remaining;

  const handleUnlockClick = () => {
    // window.open must run synchronously inside the click handler,
    // otherwise popup blockers will stop the new tab from opening.
    window.open(directLink, "_blank", "noopener,noreferrer");

    const next = remaining - 1;
    setRemaining(next);
    trackEvent("unlock_click", { ...eventParams, click_number: requiredClicks - next });
    if (next <= 0) {
      trackEvent("chapter_unlocked", eventParams);
      onUnlock();
    }
  };

  return (
    <div className="absolute inset-0 z-10 flex items-start justify-center bg-linear-to-b from-stone-50/30 via-stone-50/90 to-stone-50 px-1 pt-4 dark:from-stone-950/30 dark:via-stone-950/90 dark:to-stone-950">
      <div
        role="dialog"
        aria-labelledby="locker-title"
        aria-describedby="locker-desc"
        className="animate-pop w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl ring-1 ring-stone-200 dark:bg-stone-900 dark:ring-stone-800 sm:p-8"
      >
        <h2 id="locker-title" className="font-serif text-xl font-semibold sm:text-2xl">
          🔒 هذا الفصل مقفول!
        </h2>
        <p id="locker-desc" className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          أكمل {requiredClicks} نقرات لفتحه.
        </p>

        {/* Step progress */}
        <div className="mt-6 flex gap-2" aria-hidden="true">
          {Array.from({ length: requiredClicks }, (_, i) => (
            <span
              key={i}
              className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
                i < completed ? "bg-amber-500" : "bg-stone-200 dark:bg-stone-700"
              }`}
            />
          ))}
        </div>

        <p aria-live="polite" className="mt-3 text-sm font-medium text-stone-700 dark:text-stone-200">
          النقرات المتبقية:{" "}
          <span key={remaining} className="inline-block animate-pop text-lg font-bold tabular-nums text-amber-600 dark:text-amber-400">
            {remaining}
          </span>
        </p>

        <button
          type="button"
          onClick={handleUnlockClick}
          className="mt-5 w-full rounded-2xl bg-amber-500 px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-amber-500/30 transition hover:bg-amber-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/50 active:scale-[0.98]"
        >
          🔓 افتح الفصل
        </button>

        <p className="mt-3 text-xs leading-relaxed text-stone-400">
          كل نقرة تفتح صفحة الراعي في تبويب جديد. الفصول التي تفتحها تبقى مفتوحة على هذا الجهاز.
        </p>
      </div>
    </div>
  );
}
