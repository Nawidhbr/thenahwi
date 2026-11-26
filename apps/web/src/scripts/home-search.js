// Loaded by pages/[locale]/index.astro (moved out of the page so browsers cache it; see CLAUDE.md).
// The search field opens the site search with what was typed.
(() => {
  const form = document.querySelector("[data-kb-search]");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = form.querySelector("input").value;
    document.getElementById("search-open")?.click();
    setTimeout(() => {
      const input = document.getElementById("search-input");
      if (!input) return;
      input.value = q;
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }, 30);
  });
})();

