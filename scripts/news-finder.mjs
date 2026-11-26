#!/usr/bin/env node
/**
 * The news finder: every Saturday (GitHub Actions, .github/workflows/news-finder.yml) it looks for new work on naḥw
 * and ṣarf and their neighbouring sciences, scores it, and lists the candidates for review — nothing goes on the site by
 * itself. A reviewer writes the item (a plain headline of at most 70 characters, a one-sentence gist, our own summary, field, kind) into packages/content/background/news.json.
 *
 * Sources (no keys needed; OpenAlex only with OPENALEX_KEY, since it refuses searches without one):
 *   - Crossref: new journal articles, chapters, books and theses (most journals, DergiPark included), one request at a
 *     time (asked too fast, it answered every search with 429 and the finder found nothing for weeks)
 *   - OpenAlex: the same, with abstracts and more of the world's repositories
 *   - Google News (RSS search, the last DAYS days): mainstream reports, events and announcements, and the same kept to
 *     the sites of trusted institutions (al-Azhar, Diyanet, İSAM, NU, the mufti offices: googleNewsSites)
 *   - The feeds in scripts/news-sources.json: podcasts, YouTube channels, blogs, journals' own RSS
 *
 * The issue has three parts: candidates on naḥw and ṣarf from vetted sources; work of vetted sources on the neighbouring
 * sciences (balāgha, lugha, manṭiq, uṣūl al-fiqh, tafsīr); and, for the owner only, what is on naḥw or ṣarf but does
 * not come from a vetted institution. At its end it says how each kind of source did.
 *
 * The score (see TERMS below): words that are about naḥw and ṣarf themselves weigh most, the names of their books and
 * grammarians next, the neighbouring sciences least; other grammars (English, programming) and other senses of نحو and
 * ṣarf ("towards", exchange, spending) count against.
 * Words in the title count double. A candidate needs a score of at least MIN_SCORE and at least one strong word.
 *
 * Output: news-candidates.md (the issue text) and news-candidates.json, in the working directory.
 * Usage: node scripts/news-finder.mjs [--days 8]
 */
import { readFileSync, writeFileSync } from "node:fs";

const DAYS = Number(process.argv[process.argv.indexOf("--days") + 1]) || 8;
const MIN_SCORE = 5;
const MAILTO = "info@thenahwi.com";
const UA = `TheNahwiNewsFinder/1.0 (https://thenahwi.com; mailto:${MAILTO})`;
const since = new Date(Date.now() - DAYS * 864e5).toISOString().slice(0, 10);
// Newly indexed is not newly published: older work indexed again is left out (a publication date within half a year).
const recent = new Date(Date.now() - 183 * 864e5).toISOString().slice(0, 10);

// Weighted words. Matching is on folded text (lower case, no diacritics), as whole words or prefixes where marked*.
const TERMS = {
  // The bare words: "grammar" alone is any grammar (English, a programming language), and نحو is also "towards", so they
  // need company.
  word: ["nahw", "nahwu", "nahiv", "sarf", "sharaf", "grammar", "morphology", "syntax", "نحو", "صرف", "грамматик*"],
  strong: [
    "ilm al-nahw", "ilm al-sarf", "ilmu nahwu", "ilmu sharaf", "ilmu shorof", "ilmu saraf", "nahiv ilm*", "sarf ilm*", "arapça dil bilgisi", "arapça gramer*", "klasik arap dili",
    "arabic grammar", "arabic grammarians", "arabic morphology", "arabic syntax", "classical arabic grammar", "medieval arabic grammar", "arabic linguistic tradition", "grammaire arabe", "arabische grammatik", "арабская грамматика",
    "sibawayh*", "sibawayh's kitab", "al-kitab of sibawayh", "alfiyya*", "alfiyah", "alfiye", "ajurrumiyya", "ajrumiyyah", "ajrumiya", "jurumiyah", "ecrumiyye", "qatr al-nada", "shudhur al-dhahab", "mughni al-labib", "awdah al-masalik",
    "al-kafiya", "kafiye", "kafiya of ibn al-hajib", "al-shafiya", "shafiye", "hidayat al-nahw", "nahw mir", "mizan al-sarf", "sarf mir", "panj ganj", "ilm al-sigha", "fusul-i akbari",
    "al-amthila", "emsile", "amtsilah tasrifiyah", "amtsilati", "al-bina", "bina", "maqsud", "izzi", "tasrif al-izzi", "marah al-arwah", "awamil", "avamil", "izhar al-asrar", "izhar", "molla cami", "al-fawaid al-diyaiyya", "sharh ibn aqil", "lamiyyat al-afal", "shadha al-arf",
    "irab", "i'rab", "tasrif", "taṣrīf", "verb conjugation arabic", "arabic verb forms", "arabic root and pattern",
    // Arabic
    "علم النحو", "علم الصرف", "النحو العربي", "الصرف العربي", "النحاة", "النحويين", "الصرفيين", "أصول النحو", "تاريخ النحو", "المدارس النحوية", "سيبويه", "كتاب سيبويه",
    "ألفية ابن مالك", "الألفية", "الآجرومية", "الأجرومية", "قطر الندى", "شذور الذهب", "مغني اللبيب", "أوضح المسالك", "شرح ابن عقيل", "الكافية", "الشافية", "شرح الرضي", "التصريف", "الإعراب", "إعراب القرآن", "الأمثلة", "البناء", "المقصود", "العزي", "مراح الأرواح", "العوامل", "الفوائد الضيائية", "شذا العرف", "لامية الأفعال",
    // Persian and Urdu
    "صرف و نحو", "صرف ونحو", "نحو میر", "صرف میر", "میزان الصرف", "ہدایۃ النحو", "هدایة النحو", "پنج گنج", "علم الصیغہ", "فصول اکبری", "شرح جامی", "نحو عربی", "صرف عربی", "دستور زبان عربی",
  ],
  books: [
    "sibawayh", "khalil", "kisai", "farra", "mubarrad", "ibn al-sarraj", "zajjaji", "ibn jinni", "zamakhshari", "ibn al-hajib", "ibn malik", "ibn hisham", "ibn aqil", "ibn ajurrum", "radi al-din", "astarabadi",
    "zanjani", "jami", "birgivi", "suyuti", "ushmuni", "azhari", "hamalawi", "abd al-qahir", "jurjani", "taftazani", "basra", "kufa", "basran", "kufan",
    "dars-i nizami", "dars-e nizami", "madrasa", "medrese", "pesantren", "kitab kuning", "santri", "pondok", "al-azhar", "deoband",
    "سيبويه", "الخليل", "الكسائي", "الفراء", "المبرد", "ابن جني", "الزمخشري", "ابن الحاجب", "ابن مالك", "ابن هشام", "ابن عقيل", "ابن آجروم", "الرضي", "الزنجاني", "الجامي", "السيوطي", "الأشموني", "البصريين", "الكوفيين", "الأزهر", "درس نظامی",
  ],
  neighbours: [
    "balagha", "belagat", "ilm al-maani", "lugha", "lexicography", "arabic language", "bahasa arab", "arapça", "quranic arabic", "tajwid", "tafsir", "usul al-fiqh", "mantiq", "arabic philology", "arabic linguistics",
    "البلاغة", "علم المعاني", "اللغة العربية", "فقه اللغة", "المعجم", "اللسانيات", "التفسير", "أصول الفقه", "المنطق",
  ],
  against: [
    "programming", "compiler", "syntax error", "syntax highlighting", "parser", "context-free", "neural", "machine learning", "deep learning", "large language model", "nlp", "tokeniz*", "chatbot",
    "english grammar", "grammar check*", "grammarly", "sql", "javascript", "python", "graph grammar", "morphology of the", "cell morphology", "plant morphology", "urban morphology", "tumor", "tumour",
    "sarf edilen", "sarf etmek", "sarfiyat", "enerji sarf*", "nahw al-gharb", "نحو الغرب", "نحو المستقبل", "نحو تحقيق", "نحو بناء", "صرف العملة", "سعر الصرف", "الصرف الصحي", "صرافی", "نرخ ارز",
  ],
};
const WEIGHT = { word: 3, strong: 4, books: 2, neighbours: 1, against: -5 };
// Folding: Latin accents and ʿayn/hamza signs drop; in Arabic script the vowel marks, hamza seats and tatweel drop, and the
// Persian and Arabic forms of yāʾ and kāf are made one, so Persian and Arabic spellings match each other.
const fold = (s) =>
  String(s ?? "")
    .normalize("NFKD")
    .replace(/[̀-ͯʿʾ‘’'ʿʾ]/g, "")
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200C/g, " ")
    .toLowerCase();
const compiled = Object.entries(TERMS).flatMap(([k, list]) =>
  list.map((t) => {
    const f = fold(t);
    const pre = f.endsWith("*");
    const body = (pre ? f.slice(0, -1) : f).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Arabic script has no \b: match it as plain text, but not when ة or ه follows (a different word).
    const re = /[؀-ۿ]/.test(body) ? new RegExp(`${body}${pre ? "" : "(?![ةه])"}`, "g") : new RegExp(`(?<![a-z0-9])${body}${pre ? "" : "(?![a-z0-9])"}`, "g");
    return { k, t, re };
  }),
);
function score(title, text) {
  const T = fold(title), X = fold(text);
  let s = 0;
  const hits = new Set();
  let strong = false, word = false, context = false;
  for (const { k, t, re } of compiled) {
    const n = (T.match(re)?.length ?? 0) * 2 + (X.match(re)?.length ?? 0);
    if (!n) continue;
    s += WEIGHT[k] * Math.min(n, 3);
    hits.add(t);
    if (k === "strong") strong = true;
    if (k === "word") word = true;
    if (k === "books" || k === "neighbours") context = true;
  }
  // A candidate needs a word that is about naḥw or ṣarf itself, or the bare word with a book, grammarian or neighbouring science.
  return { score: s, hits: [...hits], strong: strong || (word && context) };
}

// The neighbouring sciences (the news covers them too): an article from a vetted journal or feed that is plainly about
// balāgha, lugha, manṭiq, uṣūl al-fiqh or tafsīr, without a word on naḥw or ṣarf, is listed in a
// section of its own. Title words count double; it needs NEIGHBOUR_MIN.
const NEIGHBOUR_MIN = 3;
const NEIGHBOUR = {
  balagha: ["ilm al-balagha", "balagha", "balaghah", "belagat", "ilm al-maani", "ilm al-bayan", "ilm al-badi", "abd al-qahir", "dalail al-ijaz", "talkhis al-miftah", "علم البلاغة", "البلاغة العربية", "علم المعاني", "علم البيان", "عبد القاهر", "دلائل الإعجاز", "تلخيص المفتاح"],
  lugha: ["arabic lexicography", "arabic philology", "fiqh al-lugha", "lisan al-arab", "al-qamus", "arabic dictionary", "arapça sözlük", "فقه اللغة", "المعجم العربي", "لسان العرب", "القاموس المحيط", "مجمع اللغة العربية"],
  mantiq: ["ilm al-mantiq", "islamic logic", "arabic logic", "isaghuji", "sullam al-munawraq", "ilmu mantiq", "mantık ilm*", "علم المنطق", "إيساغوجي", "السلم المنورق"],
  usul: ["usul al-fiqh", "ushul fiqh", "fıkıh usul*", "أصول الفقه", "دلالات الألفاظ"],
  tafsir: ["irab al-quran", "quranic grammar", "tafsir", "tefsir", "i'rab al-qur'an", "إعراب القرآن", "التفسير", "معاني القرآن"],
};
const neighbourRes = Object.entries(NEIGHBOUR).flatMap(([field, list]) =>
  list.map((t) => {
    const f = fold(t);
    const pre = f.endsWith("*");
    const body = (pre ? f.slice(0, -1) : f).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = /[؀-ۿ]/.test(body) ? new RegExp(body, "g") : new RegExp(`(?<![a-z0-9])${body}${pre ? "" : "(?![a-z0-9])"}`, "g");
    return { field, t, re };
  }),
);
function neighbourScore(title, text) {
  const T = fold(title), X = fold(text);
  const by = {};
  const hits = new Set();
  for (const { field, t, re } of neighbourRes) {
    const n = (T.match(re)?.length ?? 0) * 2 + Math.min(X.match(re)?.length ?? 0, 2);
    if (!n) continue;
    by[field] = (by[field] ?? 0) + n;
    hits.add(t);
  }
  const [field, best] = Object.entries(by).sort((a, b) => b[1] - a[1])[0] ?? ["", 0];
  const total = Object.values(by).reduce((a, b) => a + b, 0);
  return { score: total, field, best, hits: [...hits] };
}

// The fields of the site, guessed from the words (the reviewer decides).
const FIELD_WORDS = { sarf: ["sarf", "sharaf", "shorof", "morpholog", "tasrif", "conjugat", "amthila", "emsile", "izzi", "صرف", "تصريف"], balagha: ["balagha", "belagat", "rhetoric", "بلاغة"], lugha: ["lexicograph", "dictionary", "philolog", "معجم", "فقه اللغة"], mantiq: ["mantiq", "mantık", "logic", "منطق"], usul: ["usul al-fiqh", "fıkıh usul", "legal theory", "أصول الفقه"], tafsir: ["tafsir", "tefsir", "exegesis", "تفسير"] };
const guessField = (text) => {
  const X = fold(text);
  if (/nahw|nahiv|syntax|irab|alfiy|ajurrum|نحو|إعراب|اعراب/.test(X) && !FIELD_WORDS.sarf.some((w) => X.includes(fold(w)))) return "nahw";
  return Object.entries(FIELD_WORDS).find(([, ws]) => ws.some((w) => X.includes(fold(w))))?.[0] ?? "nahw";
};

const pause = (ms) => new Promise((r) => setTimeout(r, ms));
// A busy service (429, or 5xx) is asked again after a wait (its Retry-After, else 5, 15, 40 seconds); the finder
// once lost every Crossref search to 429 because it asked too fast.
const get = async (url, as = "json") => {
  for (let i = 0; ; i++) {
    let r;
    try { r = await fetch(url, { headers: { "User-Agent": UA, Accept: as === "json" ? "application/json" : "*/*" }, signal: AbortSignal.timeout(45000) }); }
    catch (e) { if (i < 2) { await pause(5000); continue; } throw new Error(`${e.name} ${url}`); }
    if ((r.status === 429 || r.status >= 500) && i < 3) {
      const after = Number(r.headers.get("retry-after"));
      await pause(Math.min(after > 0 ? after * 1000 : [5000, 15000, 40000][i], 60000));
      continue;
    }
    if (!r.ok) throw new Error(`${r.status} ${url}`);
    return as === "json" ? r.json() : r.text();
  }
};
// How each kind of source did this week, for the end of the issue: results, and the asks that failed.
const tally = {};
const count = (src, n, failed = false) => {
  const t = (tally[src] ??= { asks: 0, results: 0, failed: 0 });
  t.asks++;
  t.results += n;
  if (failed) t.failed++;
};
const strip = (s) => String(s ?? "").replace(/<[^>]+>/g, " ").replace(/&[a-z]+;|&#\d+;/g, " ").replace(/\s+/g, " ").trim();

const QUERIES = [
  "arabic grammar", "arabic morphology", "arabic syntax", "classical arabic grammar", "arabic grammatical tradition", "sibawayh", "ibn malik alfiyya", "ibn hisham grammar", "ajurrumiyya", "ibn al-hajib kafiya", "radi al-astarabadi",
  "arabic verb morphology", "tasrif", "basran kufan grammar", "dars-i nizami arabic", "ilmu nahwu", "ilmu sharaf", "nahiv", "arapça dil bilgisi", "emsile",
  "علم النحو", "علم الصرف", "النحو العربي", "ألفية ابن مالك", "الآجرومية", "سيبويه", "شرح ابن عقيل", "صرف و نحو",
];

const CROSSREF_FIELDS = "DOI,title,abstract,author,container-title,type,issued,URL,publisher,ISSN";
const fromCrossref = (w, source = "Crossref") => {
  const d = w.issued?.["date-parts"]?.[0] ?? [];
  return {
    source,
    url: w.DOI ? `https://doi.org/${w.DOI}` : w.URL,
    title: strip(w.title?.[0]),
    text: strip(w.abstract),
    who: (w.author ?? []).map((a) => [a.given, a.family].filter(Boolean).join(" ")).slice(0, 4).join(", "),
    where: strip(w["container-title"]?.[0] ?? w.publisher),
    date: d.length ? d.map((x, i) => (i ? String(x).padStart(2, "0") : x)).join("-") : "",
    kind: /book/.test(w.type ?? "") && !/chapter/.test(w.type ?? "") ? "edition" : "study",
    issns: w.ISSN ?? [],
    publisher: strip(w.publisher),
  };
};

// Crossref: the searches, then the journals of news-sources.json by ISSN (every new article, scored like the rest),
// one request at a time with a short gap, in the polite pool (mailto).
async function crossref(list) {
  const out = [];
  for (const q of QUERIES) {
    await pause(700);
    const url = `https://api.crossref.org/works?query=${encodeURIComponent(q)}&filter=from-index-date:${since}&rows=40&select=${CROSSREF_FIELDS}&mailto=${MAILTO}`;
    try {
      const items = (await get(url)).message.items ?? [];
      for (const w of items) out.push(fromCrossref(w));
      count("Crossref searches", items.length);
    } catch (e) { count("Crossref searches", 0, true); console.warn("crossref", q, e.message); }
  }
  for (const jn of list ?? []) {
    await pause(700);
    const url = `https://api.crossref.org/journals/${encodeURIComponent(jn.issn)}/works?filter=from-index-date:${since},from-pub-date:${recent}&rows=100&select=${CROSSREF_FIELDS}&mailto=${MAILTO}`;
    try {
      const items = (await get(url)).message.items ?? [];
      for (const w of items) out.push({ ...fromCrossref(w, jn.name), field: jn.field, vetted: jn.by });
      count("Journals (Crossref)", items.length);
    } catch (e) { count("Journals (Crossref)", 0, true); console.warn("journal", jn.name, e.message); }
  }
  return out;
}

async function openalex() {
  const out = [];
  // OpenAlex refuses searches without a key (403, or 429 at once): without OPENALEX_KEY it is left out, in one line.
  if (!process.env.OPENALEX_KEY) { console.log("OpenAlex left out: no OPENALEX_KEY."); tally["OpenAlex (no key)"] = { asks: 0, results: 0, failed: 0 }; return out; }
  const key = `&api_key=${process.env.OPENALEX_KEY}`;
  for (const q of QUERIES) {
    await pause(400); // OpenAlex asks for a few requests a second at most.
    const url = `https://api.openalex.org/works?search=${encodeURIComponent(q)}&filter=from_created_date:${since}&per-page=40&mailto=${MAILTO}${key}`;
    try {
      const j = await get(url);
      for (const w of j.results ?? []) {
        const inv = w.abstract_inverted_index;
        const abs = inv ? Object.entries(inv).flatMap(([word, pos]) => pos.map((p) => [p, word])).sort((a, b) => a[0] - b[0]).map((x) => x[1]).join(" ") : "";
        out.push({
          source: "OpenAlex",
          url: w.doi ?? w.primary_location?.landing_page_url ?? w.id,
          title: strip(w.title),
          text: abs,
          who: (w.authorships ?? []).map((a) => a.author?.display_name).filter(Boolean).slice(0, 4).join(", "),
          where: w.primary_location?.source?.display_name ?? "",
          date: w.publication_date ?? "",
          kind: w.type === "book" ? "edition" : "study",
          issns: w.primary_location?.source?.issn ?? [],
          publisher: w.primary_location?.source?.host_organization_name ?? "",
        });
      }
      count("OpenAlex", (j.results ?? []).length);
    } catch (e) { count("OpenAlex", 0, true); console.warn("openalex", q, e.message); }
  }
  return out;
}

// DOAJ, the index of open-access journals: the journals of Iran, the Arab world, Indonesia, Malaysia and Central Asia
// that Crossref does not hold (Iranian DOIs go through mEDRA). Searches in their languages, and journals by ISSN.
const fromDoaj = (r, source) => {
  const b = r.bibjson ?? {};
  const doi = (b.identifier ?? []).find((i) => i.type?.toLowerCase() === "doi")?.id;
  return {
    source,
    url: doi ? `https://doi.org/${doi}` : (b.link ?? [])[0]?.url,
    title: strip(b.title),
    text: strip(b.abstract),
    who: (b.author ?? []).map((a) => a.name).filter(Boolean).slice(0, 4).join(", "),
    where: strip(b.journal?.title),
    date: b.year ? `${b.year}${b.month ? `-${String(b.month).padStart(2, "0")}` : ""}` : "",
    kind: "study",
    issns: b.journal?.issns ?? [],
    publisher: strip(b.journal?.publisher),
  };
};

async function doaj(cfg) {
  const out = [];
  const asks = [...(cfg?.queries ?? []).map((q) => ({ q, name: "DOAJ" })), ...(cfg?.journals ?? []).map((j) => ({ q: `issn:${j.issn}`, name: `${j.name} (DOAJ)`, field: j.field, by: j.by }))];
  for (const a of asks) {
    await pause(600); // DOAJ allows two requests a second.
    try {
      const j = await get(`https://doaj.org/api/search/articles/${encodeURIComponent(a.q)}?pageSize=100&sort=created_date%3Adesc`);
      const fresh = (j.results ?? []).filter((r) => (r.created_date ?? "").slice(0, 10) >= since);
      for (const r of fresh) out.push({ ...fromDoaj(r, a.name), field: a.field, vetted: a.by });
      count("DOAJ", fresh.length);
    } catch (e) { count("DOAJ", 0, true); console.warn("doaj", a.q, e.message); }
  }
  return out;
}

// RSS and Atom: Google News searches and the feeds of news-sources.json.
const items = (xml) =>
  [...xml.matchAll(/<(item|entry)\b[\s\S]*?<\/\1>/g)].map(([x]) => {
    const tag = (n) => x.match(new RegExp(`<${n}\\b[^>]*>([\\s\\S]*?)</${n}>`))?.[1]?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1") ?? "";
    const link = x.match(/<link\b[^>]*href="([^"]+)"/)?.[1] ?? tag("link");
    const date = tag("pubDate") || tag("published") || tag("updated");
    const site = x.match(/<source\b[^>]*url="([^"]+)"/)?.[1] ?? "";
    return { title: strip(tag("title")), text: strip(tag("description") || tag("summary") || tag("media:description")), url: strip(link), site, date: date ? new Date(date).toISOString().slice(0, 10) : "", who: strip(tag("source") || tag("author")) };
  });

let cfg = { feeds: [], googleNews: [], journals: [] };
try { cfg = JSON.parse(readFileSync(new URL("./news-sources.json", import.meta.url), "utf8")); } catch {}

async function feeds() {
  const out = [];
  for (const q of cfg.googleNews ?? []) {
    await pause(1000);
    try {
      const list = items(await get(`https://news.google.com/rss/search?q=${encodeURIComponent(q.q)}${q.q.includes("when:") ? "" : `+when:${DAYS}d`}&hl=${q.hl ?? "en"}&gl=${q.gl ?? "US"}&ceid=${q.gl ?? "US"}:${q.hl ?? "en"}`, "text"));
      for (const it of list) out.push({ ...it, source: "Google News", kind: "event" });
      count("Google News", list.length);
    } catch (e) { count("Google News", 0, true); console.warn("google news", q.q, e.message); }
  }
  // The same, kept to the site of each trusted institution in googleNewsSites, one site at a time (Google gives a
  // hundred results a search, not newest first, so a search over several sites loses the week's new pages): their own
  // pages on naḥw, ṣarf and their neighbours, which a general search buries under other news.
  for (const g of cfg.googleNewsSites ?? []) {
    for (const h of g.sites) {
      await pause(1000);
      const q = `${g.q} site:${h} when:${DAYS}d`;
      try {
        const list = items(await get(`https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=${g.hl ?? "en"}&gl=${g.gl ?? "US"}&ceid=${g.gl ?? "US"}:${g.hl ?? "en"}`, "text"));
        for (const it of list) out.push({ ...it, source: "Google News (trusted sites)", kind: "event" });
        count("Google News, trusted sites", list.length);
      } catch (e) { count("Google News, trusted sites", 0, true); console.warn("google news site", h, e.message); }
    }
  }
  for (const f of cfg.feeds ?? []) {
    try {
      const list = items(await get(f.url, "text"));
      for (const it of list) out.push({ ...it, source: f.name, kind: f.kind ?? "media", field: f.field, always: f.always, vetted: f.by });
      count("Feeds", list.length);
    } catch (e) { count("Feeds", 0, true); console.warn("feed", f.name, e.message); }
  }
  return out.filter((x) => !x.date || x.date >= since);
}

const newsRaw = JSON.parse(readFileSync(new URL("../packages/content/background/news.json", import.meta.url), "utf8"));
const news = Array.isArray(newsRaw) ? newsRaw : newsRaw.items;
const known = new Set(news.map((n) => n.url.replace(/\/+$/, "").toLowerCase()));
const knownTitles = new Set(news.map((n) => fold(n.title).slice(0, 60)));

// What earlier issues already listed is not offered again (feeds such as DergiPark's give no dates, so their
// last issue would otherwise come back every week). Read from GitHub when the workflow passes its token.
async function shownBefore() {
  const repo = process.env.GITHUB_REPOSITORY;
  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  const urls = new Set();
  if (!repo || !token) return urls;
  try {
    for (let page = 1; page <= 6; page++) {
      const r = await fetch(`https://api.github.com/repos/${repo}/issues?state=all&per_page=100&page=${page}`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "User-Agent": UA } });
      if (!r.ok) throw new Error(`${r.status} issues`);
      const list = await r.json();
      for (const is of list) if (/^News candidates/.test(is.title ?? "")) for (const m of (is.body ?? "").matchAll(/^\s+(https?:\/\/\S+) · /gm)) urls.add(m[1].replace(/\/+$/, "").toLowerCase());
      if (list.length < 100) break;
    }
  } catch (e) { console.warn("earlier issues", e.message); }
  return urls;
}

// The strict check: only what comes from a Sunni Islamic institution. Vetted sources (news-sources.json, each with the
// institution in "by") pass; a result of the general searches passes only when its journal's ISSN, its site or its
// publisher is a trusted one (news-sources.json "trust"). The institution is checked, never a person.
const T = cfg.trust ?? {};
const normIssn = (i) => String(i).toUpperCase().replace(/[^0-9X]/g, "");
const trustIssn = new Set([...(T.issn ?? []), ...(cfg.journals ?? []).map((j) => j.issn), ...(cfg.doaj?.journals ?? []).map((j) => j.issn)].map(normIssn));
const trustPub = (T.publishers ?? []).map((r) => new RegExp(r, "iu"));
const notPub = (T.notPublishers ?? []).map((r) => new RegExp(r, "iu"));
const hostOf = (u) => { try { const x = new URL(u); return (x.hostname.replace(/^www\./, "") + x.pathname).toLowerCase(); } catch { return ""; } };
function trustedBy(c) {
  if (c.vetted) return c.vetted;
  const iss = (c.issns ?? []).map(normIssn).find((i) => trustIssn.has(i));
  if (iss) return `ISSN ${iss.slice(0, 4)}-${iss.slice(4)}`;
  for (const u of [c.site, c.url]) {
    const h = hostOf(u);
    const domain = h.split("/")[0];
    const hit = h && (T.hosts ?? []).find((t) => h === t || h.startsWith(`${t}/`) || (!t.includes("/") && (domain === t || domain.endsWith(`.${t}`))));
    if (hit) return hit;
  }
  const pub = `${c.publisher ?? ""} ${c.where ?? ""}`;
  if (trustPub.some((r) => r.test(pub)) && !notPub.some((r) => r.test(pub))) return (c.publisher || c.where || "").slice(0, 80);
  return null;
}

const [shown, ...found] = await Promise.all([shownBefore(), crossref(cfg.journals), openalex(), doaj(cfg.doaj), feeds()]);
const all = found.flat();
for (const u of shown) known.add(u);
console.log(`${shown.size} links from earlier issues left out.`);
const seen = new Set();
const candidates = [];
const neighbours = [];
const held = [];
let untrusted = 0;
const skip = (cfg.skipHosts ?? []).map((h) => h.toLowerCase());
for (const c of all) {
  if (!c.title || !c.url) continue;
  if ([c.site, c.url].some((u) => skip.some((h) => hostOf(u).split("/")[0] === h))) continue;
  if (c.date && c.date.length >= 4 && c.date.padEnd(10, "-12-31").slice(0, 10) < recent) continue;
  const key = c.url.replace(/\/+$/, "").toLowerCase();
  const tkey = fold(c.title).slice(0, 60);
  if (known.has(key) || knownTitles.has(tkey) || seen.has(key) || seen.has(tkey)) continue;
  seen.add(key); seen.add(tkey);
  const s = score(c.title, `${c.text} ${c.where ?? ""}`);
  const by = trustedBy(c);
  // A feed marked "always" (a podcast or channel on naḥw or ṣarf itself) needs no words; the rest must earn their place.
  if (c.always || (s.score >= MIN_SCORE && s.strong)) {
    if (by) candidates.push({ ...c, by, score: s.score, hits: s.hits, field: c.field ?? guessField(`${c.title} ${c.text}`), section: c.kind === "study" ? "academic" : c.kind === "edition" ? "publications" : "talks" });
    else { untrusted++; held.push({ ...c, score: s.score, hits: s.hits }); }
    continue;
  }
  // Not about naḥw or ṣarf: a vetted source's work on a neighbouring science still has a place of its own.
  if (!by || s.score < 0) continue;
  const n = neighbourScore(c.title, `${c.text} ${c.where ?? ""}`);
  if (n.score >= NEIGHBOUR_MIN) neighbours.push({ ...c, by, score: n.score, hits: n.hits, field: c.field && !["nahw", "sarf"].includes(c.field) ? c.field : n.field, section: "neighbours" });
}
candidates.sort((a, b) => b.score - a.score);
neighbours.sort((a, b) => b.score - a.score);
held.sort((a, b) => b.score - a.score);

const shownNeighbours = neighbours.slice(0, 25);
const shownHeld = held.slice(0, 10);
const listed = [...candidates, ...shownNeighbours, ...shownHeld];
writeFileSync("news-candidates.json", JSON.stringify(listed, null, 2) + "\n");
const SECTION = { academic: "Academic", publications: "Publications", talks: "Talks & media" };
const line = (c, from) => `- [ ] **${c.title.replace(/[[\]]/g, "")}** — ${[c.who, c.where, c.date].filter(Boolean).join(" · ")}  \n  ${c.url} · ${c.source} · from: ${from} · score ${c.score} · ${c.field ?? guessField(`${c.title} ${c.text}`)} · _${c.hits.slice(0, 5).join(", ")}_`;
const sources = Object.entries(tally).map(([k, t]) => `${k}: ${t.results} results from ${t.asks} asks${t.failed ? `, ${t.failed} failed` : ""}`);
const md = [
  `News candidates since ${since}: ${candidates.length} on naḥw and ṣarf, ${shownNeighbours.length} on its neighbouring sciences (from ${all.length} results; ${untrusted} on naḥw or ṣarf not from a vetted Sunni Islamic institution, listed at the end for the owner).`,
  "",
  "Tick what belongs on the site; a reviewer writes it into `packages/content/background/news.json` with a plain headline (at most 70 characters), a one-sentence gist and our own summary. Nothing is published by itself.",
  "",
  ...["academic", "publications", "talks"].flatMap((sec) => {
    const list = candidates.filter((c) => c.section === sec);
    if (!list.length) return [];
    return [`### ${SECTION[sec]} (${list.length})`, "", ...list.slice(0, 40).map((c) => line(c, c.by)), ""];
  }),
  ...(shownNeighbours.length
    ? [`### Neighbouring sciences (${shownNeighbours.length}${neighbours.length > shownNeighbours.length ? ` of ${neighbours.length}` : ""})`, "", "From vetted sources, on balāgha, lugha, manṭiq, uṣūl al-fiqh or tafsīr: only what a reader of naḥw and ṣarf would care about belongs on the site.", "", ...shownNeighbours.map((c) => line(c, c.by)), ""]
    : []),
  ...(shownHeld.length
    ? [`### Not from a vetted institution (${shownHeld.length}): for the owner to judge`, "", "On naḥw or ṣarf, but the source is not on the list of Sunni Islamic institutions: never add one of these; at most name it under \"Waiting for your approval\" with its institution.", "", ...shownHeld.map((c) => line(c, `not vetted (${(c.publisher || c.where || c.site || "").slice(0, 60) || "unknown"})`)), ""]
    : []),
  "---",
  `Sources this week: ${sources.join("; ")}.`,
].join("\n");
writeFileSync("news-candidates.md", md);
console.log(md.split("\n")[0]);
console.log(sources.join("\n"));
