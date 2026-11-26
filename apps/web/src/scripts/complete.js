// Loaded by pages/[locale]/complete/[part].astro (moved out of the page so browsers cache it; see CLAUDE.md).
(() => {
  const { names, locale } = JSON.parse(document.currentScript.dataset.vars);
  (() => {
    let visited = [];
    try { visited = JSON.parse(localStorage.getItem("visited") || "[]"); } catch {}
    if (!Array.isArray(visited)) visited = [];
    const el = document.querySelector("[data-part-count]");
    const slugs = el.dataset.slugs.split(" ");
    const read = slugs.filter((s) => visited.includes(s));
    el.textContent = el.dataset.read.replace("{read}", read.length).replace("{total}", slugs.length);
    const missing = slugs.filter((s) => !visited.includes(s));
    if (missing.length > 0 && missing.length < slugs.length) {
      const box = document.querySelector("[data-missing]");
      missing.forEach((s, i) => {
        if (i > 0) box.append(", ");
        const a = document.createElement("a");
        a.href = `/${locale}/terms/${s}/`;
        a.textContent = names[s];
        box.append(a);
      });
      box.parentElement.hidden = false;
    }
  })();

})();
