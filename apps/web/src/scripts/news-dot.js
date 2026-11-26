// Loaded by BaseLayout.astro (moved out of the page so browsers cache it; see CLAUDE.md).
(() => {
  const { latestNews, onNews, newLabel } = JSON.parse(document.currentScript.dataset.vars);
  // "New since your last visit", kept in this browser only: the date of the newest news item the reader has seen.
  // Visiting the news page marks everything as seen; until then News carries a red dot.
  try {
    const seen = localStorage.getItem("newsSeen");
    // A first visit counts as having seen everything so far.
    if (onNews || !seen) localStorage.setItem("newsSeen", latestNews);
    else if (latestNews && seen < latestNews) {
      for (const a of document.querySelectorAll("[data-news-link]")) { a.classList.add("has-new"); a.setAttribute("aria-label", `${a.textContent.trim()} (${newLabel})`); }
    }
  } catch {}

})();
