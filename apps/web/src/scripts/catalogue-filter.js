// Loaded by BookCatalogue.astro (moved out of the page so browsers cache it; see CLAUDE.md).
(() => {
  const form = document.querySelector(".cat-filters");
  if (!form) return;
  const items = [...document.querySelectorAll(".cat-item")];
  // The text of an item itself (title, author, tags, note, editions), not of the works written on it.
  const texts = new Map();
  const textOf = (li) => {
    if (!texts.has(li)) texts.set(li, [...li.children].filter((c) => c.tagName !== "UL").map((c) => c.textContent).join(" "));
    return texts.get(li);
  };
  const count = form.querySelector(".cat-count");
  const apply = () => {
    // Matching and the red marks follow the site search (window.__hl, see HighlightLib).
    const H = window.__hl;
    const ts = H.terms(form.querySelector("[data-q]").value);
    const tree = document.querySelector(".book-tree");
    H.clear(tree);
    const f = Object.fromEntries([...form.querySelectorAll("[data-f]")].map((s) => [s.dataset.f, s.value]));
    let n = 0;
    // An item shows when it matches, or when something written on it matches (so the tree stays readable).
    for (const li of items.slice().reverse()) {
      const own = (ts.length === 0 || H.matches(textOf(li), ts)) && Object.entries(f).every(([k, v]) => !v || li.dataset[k] === v);
      if (own) n++;
      const child = [...li.querySelectorAll(":scope > ul > .cat-item")].some((c) => !c.hidden);
      li.hidden = !(own || child);
      li.classList.toggle("cat-dim", !own && child);
    }
    // Mark the words in each matching item (not in the items under it, which are checked on their own);
    // when they occur only in the note or the editions, open "more" so they can be seen.
    if (ts.length)
      for (const li of items) {
        if (li.hidden || li.classList.contains("cat-dim")) continue;
        let head = 0;
        const more = li.querySelector(":scope > details");
        for (const child of li.children) if (child.tagName !== "UL") { const n = H.mark(child, ts).length; if (child !== more) head += n; }
        if (more && !head && more.querySelector("mark.search-hl")) more.open = true;
      }
    count.textContent = n === 1 && count.dataset.countOne ? count.dataset.countOne : count.dataset.count.replace("{n}", n);
  };
  form.addEventListener("input", apply);
  form.addEventListener("submit", (e) => e.preventDefault());
})();

