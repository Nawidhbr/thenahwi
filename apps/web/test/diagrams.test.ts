import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Every explanation of the site (the terms, the primer lessons, the commentary lessons) has a diagram, and every
// diagram it uses, with its focus, has a caption of its own in the English dictionary, so that the red mark and the
// words under the figure say the same thing (components/Diagram.astro).
const root = join(__dirname, "../../../packages/content");
const read = (path: string) => JSON.parse(readFileSync(path, "utf8"));
const caps: Record<string, string> = read(join(__dirname, "../src/i18n/en.json")).diagram.cap;

type Use = { where: string; diagram?: { type: string; focus?: string } };
const uses: Use[] = [];
for (const f of readdirSync(join(root, "terms"))) uses.push({ where: `terms/${f}`, diagram: read(join(root, "terms", f)).diagram });
for (const f of readdirSync(join(root, "primers"))) {
  const book = read(join(root, "primers", f));
  for (const part of book.parts) for (const l of part.lessons) uses.push({ where: `${book.id} ${l.n}`, diagram: l.diagram });
}
for (const id of readdirSync(join(root, "commentaries"))) {
  const dir = join(root, "commentaries", id, "explain");
  let files: string[] = [];
  try { files = readdirSync(dir); } catch { continue; }
  for (const f of files) uses.push({ where: `${id} ${f}`, diagram: read(join(dir, f)).diagram });
}

describe("diagrams in the explanations", () => {
  it("every term and lesson has one", () => {
    expect(uses.filter((u) => !u.diagram).map((u) => u.where)).toEqual([]);
  });
  it("every type and focus used has its own caption", () => {
    const missing = uses
      .filter((u) => u.diagram)
      .map((u) => `${u.diagram!.type}.${u.diagram!.focus ?? "all"}`)
      .filter((key) => !caps[key]);
    expect([...new Set(missing)]).toEqual([]);
  });
});
