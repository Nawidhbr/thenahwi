// Loaded by pages/[locale]/index.astro (moved out of the page so browsers cache it; see CLAUDE.md).
// Mark what came in since the reader last opened the news page (newsSeen, kept in this browser; see BaseLayout).
try {
  const seen = localStorage.getItem("newsSeen");
  if (seen) for (const li of document.querySelectorAll("[data-latest] [data-date]")) if (li.dataset.date > seen) li.querySelector(".kb-new").hidden = false;
} catch {}

