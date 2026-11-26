// Loaded by BaseLayout.astro (moved out of the page so browsers cache it; see CLAUDE.md).
// Install as an app (settings menu): the browser's own prompt where there is one, else a short how-to.
(() => {
  const box = document.querySelector(".install");
  if (!box) return;
  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  // Already an app: installed from the browser, or one of the store apps (data-app, scripts/head-settings.js).
  if (standalone || document.documentElement.dataset.app) return;
  box.hidden = false;
  let deferred = null;
  addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferred = e; });
  addEventListener("appinstalled", () => { box.hidden = true; });
  const help = box.querySelector(".install-help");
  box.querySelector("[data-install]").addEventListener("click", async () => {
    if (deferred) {
      deferred.prompt();
      await deferred.userChoice.catch(() => {});
      deferred = null;
      return;
    }
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    help.textContent = ios ? help.dataset.ios : help.dataset.other;
    help.hidden = false;
  });
})();

// Pop-ups: word explanations (buttons .gloss) and the lock on second-reading terms.
(() => {
  const pop = document.getElementById("gloss-pop");
  if (!pop || !pop.showPopover) return;
  const $ = (sel) => pop.querySelector(sel);
  const rtl = document.documentElement.dir === "rtl";
  let data = null;
  let anchor = null;
  const load = () => (data ??= fetch(pop.dataset.src).then((r) => r.json()).catch(() => ({})));
  const place = () => {
    if (!anchor) return;
    const r = anchor.getBoundingClientRect();
    const w = pop.offsetWidth, h = pop.offsetHeight, m = 16;
    let left = rtl ? r.right - w : r.left;
    left = Math.max(m, Math.min(left, innerWidth - w - m));
    let top = r.bottom + 8;
    if (top + h > innerHeight - m && r.top - h - 8 > m) top = r.top - h - 8;
    pop.style.left = left + "px";
    pop.style.top = Math.max(m, top) + "px";
  };
  const open = (el, { word, plain, note, href, linkText, arabic }) => {
    if (anchor) anchor.removeAttribute("aria-expanded");
    anchor = el;
    el.setAttribute("aria-expanded", "true");
    $(".gloss-word").textContent = word || "";
    $(".gloss-plain").textContent = plain || "";
    $(".gloss-note").textContent = note || "";
    $(".gloss-note").hidden = !note;
    const link = $(".gloss-link");
    link.hidden = !href;
    if (href) {
      link.href = href;
      $(".gloss-link-text").textContent = linkText || "";
      $(".gloss-link .ar").textContent = arabic || "";
    }
    if (!pop.matches(":popover-open")) pop.showPopover();
    place();
    $(".gloss-close").focus({ preventScroll: true });
  };
  pop.addEventListener("toggle", (e) => {
    if (e.newState === "closed" && anchor) { anchor.removeAttribute("aria-expanded"); anchor.focus({ preventScroll: true }); anchor = null; }
  });
  $("[data-close]").addEventListener("click", () => pop.hidePopover());
  addEventListener("scroll", () => { if (anchor) place(); }, { passive: true });
  addEventListener("resize", () => { if (anchor) place(); });

  document.addEventListener("click", async (e) => {
    const g = e.target.closest(".gloss");
    if (g) {
      e.preventDefault();
      const d = (await load())[g.dataset.g];
      if (!d) return;
      const here = location.pathname === d.h;
      open(g, { word: g.textContent, plain: d.p, note: d.n, href: here ? null : d.h, linkText: d.t, arabic: d.a });
      return;
    }
    // A locked term or practice: explain instead of opening it.
    const link = e.target.closest("a[href]");
    const study = window.__study;
    if (!link || !study) return;
    const url = new URL(link.href, location.href);
    const term = url.pathname.match(/\/terms\/([^/]+)\/$/);
    const practice = url.pathname.match(/\/practice\/([^/]+)\/$/);
    const lesson = url.pathname.match(/\/study\/([^/]+)\/(\d+)\/$/);
    const ds = pop.dataset;
    if (lesson) {
      const [, book, n] = lesson;
      const x = study.info(`${book}-${n}`);
      if (x.open) return;
      e.preventDefault();
      const tr = study.tracks[book];
      const plain = link.querySelector("strong")?.textContent || link.textContent.trim();
      const at = study.path.find((p) => p.s === study.next)?.n || "";
      const b = study.blocker(book);
      if (b && b.terms) {
        open(link, { word: ds.lockTitle, plain, note: ds.lockLevel2.replace("{name}", window.__q(at)), href: url.pathname.replace(/\/study\/.*$/, `/terms/${study.next}/`), linkText: ds.lockCta.replace("{name}", at) });
      } else if (b) {
        // A book of a madrasa path that opens after another book (config/madrasas.ts).
        const need = tr.a.find((dep) => !study.bookDone(dep));
        const nextStep = b.lessons.find((p) => p.s === b.next);
        open(link, { word: ds.lockTitle, plain, note: ds.lockBook.replace("{book}", study.tracks[need]?.nm || need), href: url.pathname.replace(/\/study\/.*$/, `/study/${b.id}/${b.next.split("-").pop()}/`), linkText: ds.lockCta.replace("{name}", nextStep?.n || "") });
      } else {
        const k = tr.lessons.findIndex((p) => p.s === `${book}-${n}`);
        const before = tr.lessons[k - 1]?.n || "";
        const nextStep = tr.lessons.find((p) => p.s === tr.next);
        open(link, { word: ds.lockTitle, plain, note: ds.lockLesson.replace("{name}", window.__q(before)), href: url.pathname.replace(/\/\d+\/$/, `/${tr.next.split("-").pop()}/`), linkText: ds.lockCta.replace("{name}", nextStep?.n || "") });
      }
      return;
    }
    const locked = (term && !study.open.has(term[1])) || (practice && study.gates[practice[1]] && !study.done.has(study.gates[practice[1]]));
    if (!locked) return;
    e.preventDefault();
    const nextName = study.path.find((p) => p.s === study.next)?.n || "";
    // For a term: the lesson right before it is the one to pass first.
    const k = term ? study.path.findIndex((p) => p.s === term[1]) : -1;
    const before = k > 0 ? study.path[k - 1].n : nextName;
    open(link, {
      word: ds.lockTitle,
      plain: link.querySelector("strong")?.textContent || link.textContent.trim(),
      note: term ? ds.lockBody.replace("{name}", window.__q(before)) : ds.lockPractice.replace("{name}", nextName ? window.__q(nextName) : ""),
      href: url.pathname.replace(/\/(terms|practice)\/.*$/, `/terms/${study.next}/`),
      linkText: ds.lockCta.replace("{name}", nextName),
    });
  });
})();


