// Prints the conjugation of a sound triliteral verb from the engine, for lessons and tables (never type a form by
// hand): node --experimental-strip-types scripts/tasrif.ts <root, e.g. نصر> <pattern 1–10> [bāb: nasara|daraba|
// fataha|samia|karuma|hasiba] [--short]. Prints JSON.
import { conjugate, rootOf, short, type Bab, type Pattern } from "../packages/engine/src/tasrif.ts";

const [root, pat, third, fourth] = process.argv.slice(2);
if (!root || !pat) {
  console.error("usage: tasrif.ts <root> <pattern> [bab] [--short]");
  process.exit(2);
}
const pattern = Number(pat) as Pattern;
const bab = third && third !== "--short" ? (third as Bab) : undefined;
const v = { root: rootOf(root), pattern, bab };
const wantShort = [third, fourth].includes("--short");
console.log(JSON.stringify(wantShort ? short(v) : conjugate(v), null, 1));
