// Loaded by pages/[locale]/text/mabadi.astro (moved out of the page so browsers cache it; see CLAUDE.md).
// A link to a sentence (#s12) opens the part and chapter it sits in.
(() => {
  const open = () => {
    const el = location.hash && document.getElementById(location.hash.slice(1));
    if (!el) return;
    for (let d = el.closest("details"); d; d = d.parentElement && d.parentElement.closest("details")) d.open = true;
    el.scrollIntoView();
  };
  open();
  addEventListener("hashchange", open);
})();

