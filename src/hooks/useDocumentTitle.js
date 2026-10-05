import { useEffect } from "react";
import { SITE_NAME } from "../config.js";

/** Sets the browser tab title ("<title> — Storyloft"); also used as the page name in analytics. */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — روايات عربية`;
  }, [title]);
}
