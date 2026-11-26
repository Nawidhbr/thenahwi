// How the browser's progress and the account's copy are merged (lib/account-sync.ts). Plain functions, tested in
// test/sync-merge.test.js. The rule is the database's (merge_scores, merge_visited): the highest score per key wins
// and a step once seen stays seen, so signing in on any device never loses progress.

const KEY = /^[a-z0-9-]{1,80}$/;

/** The browser's scores as the database accepts them: valid keys, numbers between 0 and 10. */
export function cleanScores(scores) {
  const out = {};
  if (!scores || typeof scores !== "object" || Array.isArray(scores)) return out;
  for (const [k, v] of Object.entries(scores)) {
    if (KEY.test(k) && typeof v === "number" && Number.isFinite(v)) out[k] = Math.min(10, Math.max(0, v));
  }
  return out;
}

/** The browser's seen steps as the database accepts them: valid keys, each once. */
export function cleanVisited(visited) {
  if (!Array.isArray(visited)) return [];
  return [...new Set(visited.filter((k) => typeof k === "string" && KEY.test(k)))];
}

/**
 * The browser's scores after the account's rows ({ key, score }) come back: for every key the higher of the two.
 * Keys the database refused (bad keys) stay in the browser as they were.
 */
export function mergeScores(local, rows) {
  const out = { ...(local && typeof local === "object" && !Array.isArray(local) ? local : {}) };
  for (const r of rows || []) {
    const v = Number(r?.score);
    if (!r || typeof r.key !== "string" || !Number.isFinite(v)) continue;
    if (typeof out[r.key] !== "number" || v > out[r.key]) out[r.key] = v;
  }
  return out;
}

/** The browser's seen steps after the account's keys come back: both together, in the browser's order first. */
export function mergeVisited(local, keys) {
  const out = Array.isArray(local) ? [...local] : [];
  const seen = new Set(out);
  for (const k of keys || []) if (typeof k === "string" && !seen.has(k)) { seen.add(k); out.push(k); }
  return out;
}

/** The madrasa path: the browser's choice wins and is saved to the account; without one, the account's is taken. */
export function mergeMadrasa(local, remote) {
  const ok = (m) => m === "indian" || m === "ottoman" || m === "north-african";
  if (ok(local)) return { local, save: local !== remote };
  if (ok(remote)) return { local: remote, save: false };
  return { local: null, save: false };
}

/** What the browser keeps of the account's licences: paid if one has begun and not ended, until the latest end (null: no end). */
export function licenceOf(rows, now) {
  const live = (rows || []).filter((r) => r && Date.parse(r.starts_at) <= now && (r.ends_at == null || Date.parse(r.ends_at) > now));
  if (!live.length) return { paid: false, until: null };
  if (live.some((r) => r.ends_at == null)) return { paid: true, until: null };
  return { paid: true, until: live.map((r) => r.ends_at).sort().at(-1) };
}
