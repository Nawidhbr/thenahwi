// Loaded by the scholars list and the library (pages/[locale]/scholars/, books/): a text search and dropdowns
// (`data-facet`), matched against each item's data-q and the data attribute of the same name (space-separated values).
(() => {
  const input = document.querySelector("[data-kb-filter]");
  const none = document.querySelector("[data-kb-none]");
  const shownLine = document.querySelector("[data-kb-shown]");
  const clear = document.querySelector("[data-kb-clear]");
  // Matching and the red marks follow the site search (window.__hl, see HighlightLib).
  const H = window.__hl;
  const bars = [...document.querySelectorAll("[data-facet]")];
  const keys = bars.map((b) => b.dataset.facet);
  const items = [...document.querySelectorAll("[data-q]")].map((li) => ({ li, q: li.dataset.q, ...Object.fromEntries(keys.map((k) => [k, (li.dataset[k] ?? "").split(" ")])) }));
  // The chosen period, role and handbook; kept in the address (#period=early&role=glossator) so a filtered list can be linked.
  const state = Object.fromEntries(keys.map((k) => [k, ""]));
  const fromHash = () => { const h = new URLSearchParams(location.hash.slice(1)); for (const k of Object.keys(state)) state[k] = h.get(k) ?? ""; };
  const toHash = () => { const h = new URLSearchParams(); for (const [k, v] of Object.entries(state)) if (v) h.set(k, v); const s = h.toString(); history.replaceState(null, "", s ? `#${s}` : location.pathname); };
  const apply = () => {
    const ts = H.terms(input.value);
    const q = ts.length > 0;
    let shown = 0;
    for (const it of items) {
      H.clear(it.li);
      const ok = (!q || H.matches(it.q, ts)) && keys.every((k) => !state[k] || it[k].includes(state[k]));
      it.li.hidden = !ok;
      if (ok) { shown++; if (q) H.mark(it.li, ts); }
    }
    for (const g of document.querySelectorAll("[data-kb-group]")) g.hidden = !g.querySelector("li:not([hidden])");
    for (const sel of bars) { sel.value = state[sel.dataset.facet]; sel.parentElement.classList.toggle("is-set", !!sel.value); }
    none.hidden = shown > 0;
    const filtered = q || keys.some((k) => state[k]);
    shownLine.textContent = filtered && shown > 0 ? shownLine.dataset.tpl.replace("{n}", shown).replace("{m}", items.length) : "";
    clear.hidden = !filtered;
  };
  for (const sel of bars)
    sel.addEventListener("change", () => {
      state[sel.dataset.facet] = sel.value;
      toHash();
      apply();
    });
  clear.addEventListener("click", () => {
    for (const k of Object.keys(state)) state[k] = "";
    input.value = "";
    toHash();
    apply();
  });
  input.addEventListener("input", apply);
  fromHash();
  apply();
})();

