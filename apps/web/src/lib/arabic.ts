/** Arabic diacritics (tashkīl), tatweel and similar marks. */
const MARKS = /[ً-ٰٟـ]/g;

/**
 * The first letter of the term's head word, without the article and diacritics,
 * used on the term's tile (الجِنْس → ج, دَلَالَةُ المُطَابَقَة → د).
 */
export function initialLetter(arabic: string): string {
  const head = (arabic.split(/\s+/)[0] ?? "").replace(MARKS, "");
  const word = head.startsWith("ال") && head.length > 2 ? head.slice(2) : head;
  return word.charAt(0);
}
