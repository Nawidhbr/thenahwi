// Loaded by the primer lesson pages: "Copy" puts a passage of the original on the clipboard (see CLAUDE.md, Scripts).
(() => {
  for (const b of document.querySelectorAll("[data-copy]")) {
    const label = b.textContent;
    b.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(b.dataset.copy);
        b.textContent = b.dataset.done || label;
        setTimeout(() => { b.textContent = label; }, 1600);
      } catch {}
    });
  }
})();
