/** An ordinal for century labels: "13th" in English; the plain number in the other languages, whose dictionaries carry their own wording. */
// French: 1er, 2e, 3e … (the dictionary writes "{n} siècle"); the other languages: the plain number.
export const ord = (n: number, locale = "en") => (locale === "fr" ? (n === 1 ? "1er" : `${n}e`) : locale === "en" ? `${n}${n % 10 === 1 && n !== 11 ? "st" : n % 10 === 2 && n !== 12 ? "nd" : n % 10 === 3 && n !== 13 ? "rd" : "th"}` : String(n));
