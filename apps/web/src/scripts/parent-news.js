// The news of naḥw and ṣarf from The Mantiqi, the parent site (config/site.ts PARENT): read in the browser from its RSS
// feed, which it serves to thenahwi.com (CORS in The Mantiqi's vercel.json), keeping the items of one field. Each
// [data-parent-news] block lists up to data-max items; while loading, or when there are none or the feed cannot be
// reached, its own text stays (the link to The Mantiqi's news is always there). No content of the parent is copied into
// this site's pages, so search engines find the news once, where it is gathered.
(() => {
  const blocks = [...document.querySelectorAll("[data-parent-news]")];
  if (!blocks.length) return;
  const { feed, field } = blocks[0].dataset;
  const date = (s) => {
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString(document.documentElement.lang || "en", { year: "numeric", month: "long", day: "numeric" });
  };
  fetch(feed, { mode: "cors" })
    .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
    .then((xml) => {
      const doc = new DOMParser().parseFromString(xml, "application/xml");
      const items = [...doc.querySelectorAll("item")]
        .filter((it) => [...it.querySelectorAll("category")].some((c) => c.textContent.trim() === field))
        .map((it) => ({
          title: it.querySelector("title")?.textContent.trim() ?? "",
          link: it.querySelector("link")?.textContent.trim() ?? "",
          date: it.querySelector("pubDate")?.textContent.trim() ?? "",
          // The description is "<gist> — <original title>. <summary>": the gist is enough here.
          gist: (it.querySelector("description")?.textContent ?? "").split(" — ")[0].trim(),
        }))
        .filter((x) => x.title && /^https?:\/\//.test(x.link));
      for (const block of blocks) {
        const list = block.querySelector("[data-parent-news-list]");
        const state = block.querySelector("[data-parent-news-state]");
        const shown = items.slice(0, Number(block.dataset.max) || 20);
        if (!shown.length) { if (state) state.textContent = block.dataset.none || ""; continue; }
        for (const x of shown) {
          const li = document.createElement("li");
          const when = document.createElement("span");
          when.className = "kb-date";
          when.textContent = date(x.date);
          const h = document.createElement("h3");
          const a = document.createElement("a");
          a.href = x.link; a.rel = "noopener"; a.target = "_blank"; a.textContent = x.title;
          h.append(a);
          li.append(when, h);
          if (x.gist) { const p = document.createElement("p"); p.className = "kb-news-gist"; p.textContent = x.gist; li.append(p); }
          list.append(li);
        }
        list.hidden = false;
        if (state) state.hidden = true;
      }
    })
    .catch(() => { for (const b of blocks) { const s = b.querySelector("[data-parent-news-state]"); if (s) s.textContent = b.dataset.none || ""; } });
})();
