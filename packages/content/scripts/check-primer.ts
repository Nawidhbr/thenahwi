// Checks one primer file (or a translation of one) against the schema without writing anything, so a book can be
// checked while another process builds: node --experimental-strip-types scripts/check-primer.ts primers/<id>.json
// [--translation]. Prints the errors, or "OK" with the number of lessons; exits 1 on an error.
import { readFileSync } from "node:fs";
import { Primer, PrimerTranslation } from "../src/schema.ts";

const [file, flag] = process.argv.slice(2);
if (!file) {
  console.error("usage: check-primer.ts <file> [--translation]");
  process.exit(2);
}
const data = JSON.parse(readFileSync(file, "utf8"));
const res = (flag === "--translation" ? PrimerTranslation : Primer).safeParse(data);
if (!res.success) {
  for (const i of res.error.issues.slice(0, 40)) console.error(`${i.path.join(".")}: ${i.message}`);
  process.exit(1);
}
if (flag !== "--translation") {
  const p = res.data as Primer;
  const lessons = p.parts.flatMap((x) => x.lessons);
  const ns = lessons.map((l) => l.n);
  const problems: string[] = [];
  ns.forEach((n, i) => n !== i + 1 && problems.push(`lesson numbers must run 1, 2, 3 … without gaps (found ${n} at ${i + 1})`));
  for (const l of lessons) {
    const ids = l.quiz.map((q) => q.id);
    if (new Set(ids).size !== ids.length) problems.push(`lesson ${l.n}: quiz ids repeat`);
    for (const q of l.quiz) {
      if (!q.id.startsWith(`${p.id}-${l.n}-`)) problems.push(`lesson ${l.n}: quiz id ${q.id} must start with ${p.id}-${l.n}-`);
      if (q.answer >= q.options.length) problems.push(`lesson ${l.n}: ${q.id} answer out of range`);
    }
    if (l.ask && l.ask > l.quiz.length) problems.push(`lesson ${l.n}: ask ${l.ask} > ${l.quiz.length} questions`);
    if (p.textEdition && !p.textEdition.selection && l.text.length === 0) problems.push(`lesson ${l.n}: no passage of the original`);
  }
  if (problems.length) {
    for (const x of problems.slice(0, 40)) console.error(x);
    process.exit(1);
  }
  console.log(`OK: ${p.id}, ${lessons.length} lessons`);
} else console.log("OK");
