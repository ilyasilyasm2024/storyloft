import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { validateStories } from "./data/storiesData.js";
import { initAnalytics } from "./utils/analytics.js";
import "./index.css";

// Catch data mistakes (e.g. a story without exactly 12 chapters) during development.
if (import.meta.env.DEV) validateStories();

// Google Analytics (production only).
initAnalytics();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
