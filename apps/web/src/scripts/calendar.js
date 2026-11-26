// Loaded by BaseLayout.astro. Dates are written "663/1265" (Hijri/Gregorian) in the content; the reader's calendar
// setting (gear menu, `cal` in localStorage, `data-cal` on <html>; Hijri by default) shows them as
// "663 AH (1265)" or "1265 (663 AH)". Only pairs whose Gregorian year fits the Hijri one are changed, so issue
// numbers and the like ("10/1") stay as they are. Centuries ("8th/14th century") follow the same rule.
(() => {
  const root = document.documentElement;
  const v = JSON.parse(document.currentScript.dataset.vars);
  const greg = () => root.dataset.cal === "greg";
  // Gregorian year of a Hijri year: about h × 0.97 + 622.
  const fits = (h, g) => Math.abs(h * 0.970224 + 621.5643 - g) <= 2.5;
  const YEARS = /(?<![\d/–-])(\d{1,4})(?:[–-](\d{1,4}))?\/(\d{3,4})(?:[–-](\d{1,4}))?(?![\d/])/g;
  const CENT = /\b(\d{1,2})(st|nd|rd|th)\/(\d{1,2})(st|nd|rd|th)(\s+(?:century|centuries))?/g;
  const saved = new Map();
  const full = (a, b) => (b && b.length < a.length ? a.slice(0, a.length - b.length) + b : b);
  const years = (text) =>
    text.replace(YEARS, (m, h1, h2, g1, g2, at, str) => {
      const h1n = +h1, g1n = +g1;
      if (!fits(h1n, g1n)) return m;
      const g2f = g2 && !h2 ? null : g2 && full(g1, g2);
      if (h2 && g2 && !fits(+full(h1, h2), +g2f)) return m;
      const H = `${h1}${h2 ? `–${h2}` : ""} ${v.ah}`;
      const G = `${g1}${g2 ? `–${g2}` : ""}`;
      // Already inside brackets ("(d. 663/1265)"): no second pair, a comma instead.
      const inner = /\([^()]*$/.test(str.slice(0, at));
      return greg() ? (inner ? `${G}, ${H}` : `${G} (${H})`) : inner ? `${H}, ${G}` : `${H} (${G})`;
    });
  const cents = (text) =>
    text.replace(CENT, (m, h, hs, g, gs, word, at, str) => {
      const d = +g - +h;
      if (d < 5 || d > 7) return m;
      const w = word || "";
      const inner = /\([^()]*$/.test(str.slice(0, at));
      return greg() ? (inner ? `${g}${gs}${w}, ${h}${hs} ${v.ah}` : `${g}${gs}${w} (${h}${hs} ${v.ah})`) : inner ? `${h}${hs}${w} ${v.ah}, ${g}${gs}` : `${h}${hs}${w} ${v.ah} (${g}${gs})`;
    });
  const apply = (n) => {
    const orig = saved.has(n) ? saved.get(n) : n.nodeValue;
    const out = cents(years(orig));
    if (out !== orig) { saved.set(n, orig); n.nodeValue = out; }
  };
  const walk = (el) => {
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (/\d(?:st|nd|rd|th)?\/\d/.test(n.nodeValue) || saved.has(n)) && !n.parentElement?.closest("script, style, textarea, input, [data-no-cal]") ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP,
    });
    for (let n = w.nextNode(); n; n = w.nextNode()) apply(n);
  };
  walk(document.body);
  // New text on the page (search results, filtered lists) follows the setting too.
  new MutationObserver((list) => {
    for (const m of list) m.addedNodes.forEach((n) => { if (n.nodeType === 1) walk(n); else if (n.nodeType === 3 && n.parentElement) walk(n.parentElement); });
  }).observe(document.body, { childList: true, subtree: true });

  const button = document.getElementById("cal-toggle");
  if (!button) return;
  const sync = () => button.setAttribute("aria-checked", String(!greg()));
  sync();
  button.addEventListener("click", () => {
    if (greg()) delete root.dataset.cal;
    else root.dataset.cal = "greg";
    try { localStorage.setItem("cal", greg() ? "greg" : "hijri"); } catch {}
    walk(document.body);
    sync();
  });
})();
