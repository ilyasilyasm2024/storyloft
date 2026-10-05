import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import StoryDetails from "./pages/StoryDetails.jsx";
import ChapterPage from "./pages/ChapterPage.jsx";
import NotFound from "./pages/NotFound.jsx";
import { useTheme } from "./hooks/useTheme.js";

/** Scroll to the top whenever the route path changes (e.g. next chapter). */
function ScrollToTop() {
  const { pathname } = useLocation();
  // Block body (not an expression) so the effect never returns scrollTo's result.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  useTheme(); // applies the saved theme to <html> on load

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex min-h-dvh flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/story/:storyId" element={<StoryDetails />} />
            <Route path="/story/:storyId/chapter/:chapterNumber" element={<ChapterPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
