// Loaded by components/study/TrackLevel.astro and PrimerBook.astro (moved out of the page so browsers cache it; see CLAUDE.md).
(() => {
  const s = window.__study;
  const first = document.querySelector("[data-slug]");
  const box = document.querySelector("[data-l2-locked]");
  if (s && first && !s.info(first.dataset.slug).open) {
    box.hidden = false;
    // Name what opens it: the first reading, or the book before it in its madrasa path.
    const id = s.info(first.dataset.slug).track;
    const need = id && s.tracks[id].a.find((dep) => !s.bookDone(dep));
    const p = box.querySelector("[data-lock-book]");
    if (p && need && need !== "terms") p.lastChild.textContent = p.dataset.lockBook.replace("{book}", s.tracks[need]?.nm || need);
  }
  // The preview button opens one of this level's preview lessons at random.
  const pv = document.querySelector("[data-l2-locked] [data-previews]");
  if (pv) { const list = JSON.parse(pv.dataset.previews); pv.href = list[Math.floor(Math.random() * list.length)]; }
})();

