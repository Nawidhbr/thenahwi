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
  { date: "2026-11-27", kind: "text", title: "Lāmiyyat al-afʿāl, with 20 lessons", body: "Ibn Mālik's poem of 114 verses on the verb, the ṣarf of the North-African path beside al-ʿIzzī: from the Cairo Majmūʿ of 1896, vocalised after the metre and checked against Volck's vowelled edition (Leipzig 1866), in 20 lessons.", href: "/study/lamiyya/" },
  { date: "2026-11-27", kind: "text", title: "Marāḥ al-arwāḥ, with 62 lessons", body: "The last and fullest of the five books of ṣarf of the Ottoman madrasa: the sound verb, then the doubled, hamzated, mithāl, hollow, defective and lafīf verbs with the changes they undergo, transcribed from the Ottoman Majmūʿat al-ṣarf and taught in 62 lessons.", href: "/study/marah/" },
  { date: "2026-11-27", kind: "text", title: "Hidāyat al-naḥw, with 72 lessons", body: "The Arabic handbook of naḥw read before al-Kāfiya in the Dars-i Niẓāmī, transcribed from the Kanpur lithograph of 1300/1883 and taught in 72 lessons: the noun and its iʿrāb, the verb, and the particles, on the Indian path's level 3.", href: "/study/hidaya/" },
  { date: "2026-11-27", kind: "text", title: "Iẓhār al-asrār, with 52 lessons", body: "Imām Birgivī's second book of naḥw, read after his al-ʿAwāmil on the Ottoman path: the governors, the governed and iʿrāb in full, transcribed from the Jawāʾib print of 1302/1885 and taught in 52 lessons.", href: "/study/izhar/" },
  { date: "2026-11-27", kind: "text", title: "Mīzān al-ṣarf and Naḥw-i Mīr, the Persian primers", body: "The first books of ṣarf and naḥw of the Dars-i Niẓāmī, read side by side on the Indian path: Mīzān al-ṣarf (21 lessons, Kanpur 1905) and al-Sayyid al-Sharīf al-Jurjānī's Naḥw-i Mīr (39 lessons, Lucknow 1884), transcribed from Indian lithographs, with translations into English, Arabic, Indonesian, Turkish and Urdu.", href: "/study/mizan/" },
  { date: "2026-11-27", kind: "text", title: "Qaṭr al-nadā and al-ʿAwāmil al-miʾa", body: "Ibn Hishām's Qaṭr al-nadā in 48 lessons, the intermediate naḥw of the North-African path, from an Indian lithograph of 1261/1845; and ʿAbd al-Qāhir al-Jurjānī's hundred governors in 15 lessons, from Lockett's vowelled print (Calcutta 1814), on the Indian path.", href: "/study/qatr/" },
  { date: "2026-11-27", kind: "text", title: "al-ʿIzzī, with 32 lessons", body: "Al-Zanjānī's al-Taṣrīf, the first intermediate book of ṣarf on the Ottoman and North-African paths: the bare and augmented verb, the sound and the weak, transcribed from the Ottoman Majmūʿat al-ṣarf and taught in 32 lessons.", href: "/study/izzi/" },
  { date: "2026-11-27", kind: "feature", title: "Ṣarf and naḥw side by side, in every path", body: "After al-Mabādiʾ every level of the three madrasa paths has two lanes, ṣarf and naḥw, each with its books in order; the Ottoman path reads its first books of ṣarf before naḥw, as its madrasas did.", href: "/study/" },
  { date: "2026-11-27", kind: "feature", title: "Fourteen books in five languages", body: "Under each passage of every book's original you can read our translation in English, Bahasa Indonesia, Türkçe, اردو or فارسی (Arabic instead of Persian for the two Persian primers): choose it in the settings or beside the text.", href: "/study/" },
  { date: "2026-11-27", kind: "encyclopedia", title: "Seventeen new entries in the glossary", body: "The governors, the followers and the words in naṣb: ʿāmil, kāna, inna and ẓanna with their sisters, naʿt, ʿaṭf, tawkīd and badal, the absolute object, ẓarf, ḥāl, tamyīz, exception, lā of the whole kind, the vocative, iḍāfa, and the governors of the present verb.", href: "/glossary/" },
  { date: "2026-11-27", kind: "text", title: "al-Amthila, Bināʾ al-afʿāl, al-Maqṣūd and Birgivī's al-ʿAwāmil", body: "The first books of the Ottoman madrasa, transcribed from Ottoman prints and taught in 20, 16, 30 and 18 lessons: the forms of naṣara set out and conjugated, the building of the verbs, the patterns of the bare and augmented verb, and the sixty governors of naḥw.", href: "/study/amthila/" },
  { date: "2026-11-27", kind: "text", title: "al-Ājurrūmiyya, with 35 lessons", body: "Ibn Ājurrūm's first book of naḥw, transcribed from Perowne's vowelled print (Cambridge 1852), translated, and taught in 35 lessons with diagrams, exercises in writing and a test each: the first book of naḥw of the North-African path.", href: "/study/ajurrumiyya/" },
  { date: "2026-11-26", kind: "course", title: "al-Mabādiʾ: the foundations of ṣarf and naḥw", body: "The first book of every path, term by term: the two sciences, the kinds of word, root and pattern, the tenses, the derived nouns, iʿrāb and the sentence, each with its Arabic, an explanation, a diagram and a short test.", href: "/study/mabadi/" },
  { date: "2026-11-26", kind: "encyclopedia", title: "The encyclopedia of naḥw and ṣarf", body: "Six handbooks with their commentaries, a library by century, thirteen grammarians, the curricula of the Indian, Ottoman and Azhari madrasas, and a free glossary of the terms.", href: "/" },
  { date: "2026-11-26", kind: "feature", title: "Conjugation drills", body: "The practice pages now draw on a taṣrīf engine: questions on the persons, the imperative, the verbal noun and the participles, generated and checked by the same rules as the conjugation tables.", href: "/practice/" },
];
