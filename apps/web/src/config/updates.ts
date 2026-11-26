/**
 * The log of what has been added to The Nahwi (/<locale>/updates/, under About): books and texts, courses and
 * levels, languages, the encyclopedia and the site's tools. Newest first. Add an entry when something a reader would
 * notice goes live; keep it to one line of title and one or two sentences. Written in English, like all content;
 * `href` is the path after the locale.
 */
export type UpdateKind = "text" | "course" | "language" | "encyclopedia" | "feature";

export interface Update {
  date: string;
  kind: UpdateKind;
  title: string;
  body: string;
  href?: string;
}

export const UPDATES: Update[] = [
  { date: "2026-11-26", kind: "course", title: "al-Mabādiʾ: the foundations of ṣarf and naḥw", body: "The first book of every path, term by term: the two sciences, the kinds of word, root and pattern, the tenses, the derived nouns, iʿrāb and the sentence, each with its Arabic, an explanation, a diagram and a short test.", href: "/study/mabadi/" },
  { date: "2026-11-26", kind: "encyclopedia", title: "The encyclopedia of naḥw and ṣarf", body: "Six handbooks with their commentaries, a library by century, thirteen grammarians, the curricula of the Indian, Ottoman and Azhari madrasas, and a free glossary of the terms.", href: "/" },
  { date: "2026-11-26", kind: "feature", title: "Conjugation drills", body: "The practice pages now draw on a taṣrīf engine: questions on the persons, the imperative, the verbal noun and the participles, generated and checked by the same rules as the conjugation tables.", href: "/practice/" },
];
