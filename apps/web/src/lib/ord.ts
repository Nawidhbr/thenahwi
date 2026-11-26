/** An ordinal for century labels: "13th" in English; the plain number in the other languages, whose dictionaries carry their own wording. */
export const ord = (n: number, locale = "en") => (locale === "en" ? `${n}${n % 10 === 1 && n !== 11 ? "st" : n % 10 === 2 && n !== 12 ? "nd" : n % 10 === 3 && n !== 13 ? "rd" : "th"}` : String(n));
