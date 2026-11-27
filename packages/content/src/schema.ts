import { z } from "zod";

/** The two sciences The Nahwi teaches: ṣarf (morphology) and naḥw (syntax and endings). */
export const Subject = z.enum(["sarf", "nahw"]);

/** Chapters of al-Mabādiʾ (the free first book: the foundations of ṣarf and naḥw), used to group terms and lessons. */
export const Chapter = z.enum([
  "introduction",
  "word",
  "root",
  "verb",
  "sound-weak",
  "derived",
  "irab",
  "sentence",
]);

/** Diagrams the site can draw for a term (see apps/web/src/components/Diagram.astro). */
export const DiagramType = z.enum([
  "sciences",
  "kalima",
  "mizan",
  "fil",
  "sahih",
  "mushtaqq",
  "irab",
  "jumla",
]);
export type DiagramType = z.infer<typeof DiagramType>;

/**
 * A diagram drawn from data in a lesson (apps/web/src/components/LessonFigure.astro): a division tree (`tree`: a
 * label in English, its Arabic, up to three levels below it, at most six branches a node and twelve leaves in all),
 * or a table (`grid`: Arabic forms or examples in rows, each form from the print or from the engine, never typed by
 * hand). `focus` names the label of a tree node drawn in the accent colour.
 */
export type FigureTree = { label: string; ar?: string; children?: FigureTree[] };
export const FigureTree: z.ZodType<FigureTree> = z.lazy(() =>
  z.object({ label: z.string().min(1).max(28), ar: z.string().min(1).max(40).optional(), children: z.array(FigureTree).min(1).max(6).optional() }),
);
export const LessonDiagram = z
  .object({
    type: z.union([DiagramType, z.literal("tree"), z.literal("grid")]),
    focus: z.string().optional(),
    /** A caption under a tree or grid (the built-in diagrams have their own). */
    caption: z.string().optional(),
    after: z.number().int().min(0).optional(),
    /** For type "tree". */
    tree: FigureTree.optional(),
    /** For type "grid": a caption, the column heads (English or Arabic) and the rows (Arabic cells vocalised). */
    grid: z.object({ caption: z.string().optional(), head: z.array(z.string().min(1)).min(1).max(6), rows: z.array(z.array(z.string()).min(1).max(6)).min(1).max(16) }).optional(),
  })
  .refine((d) => (d.type === "tree") === Boolean(d.tree) && (d.type === "grid") === Boolean(d.grid), { message: "a tree diagram needs `tree`, a grid needs `grid`, and only they" });
export type LessonDiagram = z.infer<typeof LessonDiagram>;

/** An exercise to do in writing (a lesson's `tasks`): the task, any Arabic it is about, and a model answer shown on request. */
export const LessonTask = z.object({ prompt: z.string().min(5), arabic: z.string().optional(), answer: z.string().min(1) });
export type LessonTask = z.infer<typeof LessonTask>;

const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "lowercase words joined by hyphens");

export const Term = z.object({
  slug,
  subject: Subject,
  chapter: Chapter,
  /** Position within its chapter, in the order of al-Mabādiʾ. */
  order: z.number().int().positive(),
  /**
   * Study level. 1: the matn with a plain explanation (first reading).
   * 2: the finer points the commentaries add (second reading, with a sharḥ).
   */
  level: z.union([z.literal(1), z.literal(2)]),
  /** Where the term comes from: the first reading itself ("matn"), or the commentaries on the books ("commentaries"). */
  source: z.enum(["matn", "commentaries"]),
  /**
   * For terms from the commentaries: which commentaries treat it, by title as
   * readers know it (e.g. a sharḥ on the al-Mabādiʾ). Shown with the lock on
   * second-reading terms. Empty until filled in by a reviewer.
   */
  commentaries: z.array(z.string().min(1)).default([]),
  /** Vocalised Arabic (with tashkīl). */
  arabic: z.string().min(1),
  /** Transliteration in the site's fixed scheme (e.g. al-ḍamīr, ʿilm). */
  transliteration: z.string().min(1),
  english: z.string().min(1),
  /** Other spellings people search for. */
  alsoKnownAs: z.array(z.string()).default([]),
  /** One-sentence definition: the first line of the page. */
  definition: z.string().min(20).max(320),
  /** Further explanation, plain text paragraphs. */
  explanation: z.array(z.string()).min(1),
  examples: z
    .array(z.object({ arabic: z.string().optional(), english: z.string(), note: z.string().optional() }))
    .default([]),
  related: z.array(slug).default([]),
  /** A diagram that shows the term at a glance; `focus` marks the part this term is about. */
  diagram: z.object({ type: DiagramType, focus: z.string().optional() }).optional(),
  /** Content is only published as reviewed once a qualified teacher has checked it. */
  review: z.object({ status: z.enum(["draft", "reviewed"]), by: z.string().optional(), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional() }),
});

export type Term = z.infer<typeof Term>;
export type Chapter = z.infer<typeof Chapter>;

/** Chapters in the order of al-Mabādiʾ. */
export const CHAPTER_ORDER: readonly Chapter[] = Chapter.options;

/**
 * The parts of al-Mabādiʾ. The introduction names the two sciences and the kinds of word; then ṣarf, the word on its
 * own (its root, pattern and forms), and naḥw, the word in the sentence (its ending and its role).
 */
export type Part = "introduction" | "sarf" | "nahw";

export const PART_ORDER: readonly Part[] = ["introduction", "sarf", "nahw"];

export const PART_TITLES: Record<Part, { english: string; transliteration: string; arabic: string; summary: string }> = {
  introduction: {
    english: "Introduction",
    transliteration: "al-muqaddima",
    arabic: "المُقَدِّمَة",
    summary: "The two sciences, the word and speech, and the three kinds of word.",
  },
  sarf: {
    english: "Morphology",
    transliteration: "al-ṣarf",
    arabic: "الصَّرْف",
    summary: "The word on its own: its root and pattern, the verb's tenses, sound and weak roots, and the nouns derived from a verb.",
  },
  nahw: {
    english: "Syntax",
    transliteration: "al-naḥw",
    arabic: "النَّحْو",
    summary: "The word in the sentence: iʿrāb and bināʾ, the four states, and the nominal and verbal sentence.",
  },
};

export const CHAPTER_PART: Record<Chapter, Part> = {
  introduction: "introduction",
  word: "introduction",
  root: "sarf",
  verb: "sarf",
  "sound-weak": "sarf",
  derived: "sarf",
  irab: "nahw",
  sentence: "nahw",
};

export const CHAPTER_TITLES: Record<Chapter, { english: string; arabic: string }> = {
  introduction: { english: "The two sciences and speech", arabic: "العِلْمَانِ وَالكَلَامُ" },
  word: { english: "The kinds of word", arabic: "أَقْسَامُ الكَلِمَة" },
  root: { english: "Root and pattern", arabic: "الأَصْلُ وَالمِيزَان" },
  verb: { english: "The verb and its tenses", arabic: "الفِعْلُ وَأَزْمِنَتُه" },
  "sound-weak": { english: "Sound and weak", arabic: "الصَّحِيحُ وَالمُعْتَلّ" },
  derived: { english: "Derived nouns", arabic: "المُشْتَقَّات" },
  irab: { english: "Iʿrāb and bināʾ", arabic: "الإِعْرَابُ وَالبِنَاء" },
  sentence: { english: "The sentence", arabic: "الجُمْلَة" },
};

/**
 * The matn, segment by segment. Each segment is one sentence or clause (ʿibāra)
 * of the text with its own translation, linked to the terms it introduces.
 */
export const MatnSegment = z.object({
  /** Stable id within the work, used in URLs: "1", "2", … or "3a". */
  id: z.string().regex(/^[0-9]+[a-z]?$/),
  /** The vocalised Arabic of the segment, exactly as in the edition named for the work. */
  arabic: z.string().min(1),
  /** The Nahwi's own translation. */
  english: z.string().min(1),
  /** Terms this segment introduces or uses, by slug. */
  terms: z.array(slug).default([]),
  /** Page or folio in the edition, for checking against it. */
  page: z.string().optional(),
  review: z.object({ status: z.enum(["draft", "reviewed"]), by: z.string().optional(), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional() }),
});

export const MatnSection = z.object({
  chapter: Chapter,
  segments: z.array(MatnSegment),
});

export const Matn = z.object({
  slug,
  title: z.string(),
  arabicTitle: z.string(),
  author: z.string(),
  /** The printed edition or manuscript the Arabic is taken from. Required before any segment is published. */
  edition: z.object({ title: z.string(), editor: z.string().optional(), place: z.string().optional(), year: z.string().optional() }).nullable(),
  sections: z.array(MatnSection),
});

export type MatnSegment = z.infer<typeof MatnSegment>;
export type MatnSection = z.infer<typeof MatnSection>;
export type Matn = z.infer<typeof Matn>;

/** One multiple-choice exercise. Options are short; the explanation is shown after answering. */
export const Exercise = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  prompt: z.string().min(5),
  /** Arabic shown with the prompt, if any. */
  arabic: z.string().optional(),
  options: z.array(z.string().min(1)).min(2).max(7),
  /** Index of the correct option. */
  answer: z.number().int().min(0),
  explanation: z.string().min(10),
  terms: z.array(slug).default([]),
});

export const ExerciseSet = z.object({
  chapter: Chapter,
  items: z.array(Exercise).min(1),
});

export type Exercise = z.infer<typeof Exercise>;
export type ExerciseSet = z.infer<typeof ExerciseSet>;

/** A translation of a term into another site language. The Arabic and the structure stay those of the source. */
export const TermTranslation = z.object({
  name: z.string().min(1),
  alsoKnownAs: z.array(z.string()).default([]),
  definition: z.string().min(10).max(400),
  explanation: z.array(z.string().min(1)).min(1),
  examples: z.array(z.object({ text: z.string().min(1), note: z.string().optional() })).default([]),
});
export type TermTranslation = z.infer<typeof TermTranslation>;

export const ExerciseTranslation = z.object({
  items: z.record(z.string(), z.object({ prompt: z.string().min(1), options: z.array(z.string().min(1)), explanation: z.string().min(1) })),
});
export type ExerciseTranslation = z.infer<typeof ExerciseTranslation>;

/** Everything translated into one site language. */
export interface LocaleBundle {
  terms: Record<string, TermTranslation>;
  /** Segment id → translation. Empty for Arabic, where the matn is shown on its own. */
  matn: Record<string, string>;
  exercises: Record<string, ExerciseTranslation["items"]>;
}

/**
 * Word explanations for one site language (glossary/<code>.json). Technical
 * words in the running text become tappable; the pop-up gives a plain word or
 * synonym and, where there is one, a link to the term page.
 */
export const GlossaryEntry = z.object({
  /** Stable id, shared across languages for the same concept (use the term slug when there is a term page). */
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  /** The forms as they occur in the text (singular, plural, inflections). Matched as whole words; case and Arabic vowel marks are ignored. */
  forms: z.array(z.string().min(2)).min(1),
  /** The plain word or synonym shown first in the pop-up. */
  plain: z.string().min(1).max(60),
  /** One short sentence of explanation. */
  note: z.string().max(180).optional(),
  /** Slug of the term page, if the concept has one. */
  term: z.string().optional(),
  /** false: not marked on the knowledge-base pages (scholars and articles), where the form mostly has another sense (English "rhetoric" there usually means balāgha, not khaṭāba). */
  kb: z.boolean().optional(),
});
export const Glossary = z.object({
  entries: z.array(GlossaryEntry),
  /** Everyday phrases that contain a pop-up form but do not mean the technical word (Russian «в виду», Turkish «aksi hâlde»): matched before the forms and left unmarked. */
  ignore: z.array(z.string().min(2)).optional(),
});
export type GlossaryEntry = z.infer<typeof GlossaryEntry>;
export type Glossary = z.infer<typeof Glossary>;

/**
 * The short test of one term (quizzes/<slug>.json). Terms are studied one by
 * one: the next term opens once this test scores at least 6 out of 10.
 */
export const Quiz = z.object({
  term: slug,
  items: z.array(Exercise).min(3).max(16),
});
export type Quiz = z.infer<typeof Quiz>;

/**
 * A commentary (sharḥ) on the al-Mabādiʾ, as a second book: its Arabic in blocks,
 * each tied to the matn passages it explains (commentaries/<id>/text.json).
 * Translations per language in commentaries/<id>/<code>.json: block id → text.
 */
export const CommentaryBlock = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  chapter: Chapter,
  /** Matn segment ids this block explains. */
  matn: z.array(z.string()).default([]),
  /** The words of the matn as the commentator quotes them (after qāla), if the block opens with a quotation. */
  quote: z.string().optional(),
  /** A heading the print sets above this block (in a standalone text such as al-Mirqāt: «فصل في الدلالة»). */
  heading: z.string().optional(),
  /** The commentator's own words (after aqūlu), or the text of a standalone book. */
  arabic: z.string().min(1),
  /** Page in the printed edition. */
  page: z.union([z.number(), z.string()]).optional(),
});
export const Commentary = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  arabicTitle: z.string(),
  author: z.string(),
  authorArabic: z.string(),
  died: z.string().optional(),
  /** The work's entry in the library (background/library.json), or a handbook id of `KB_BOOKS`, which then links to the course. */
  library: z.string().optional(),
  /** A mixed commentary (sharḥ mamzūj): the matn's words are woven into the commentator's sentences and marked {…} in `arabic` (and in the translations). */
  mixed: z.boolean().default(false),
  /** "sharh": a commentary on the al-Mabādiʾ (blocks tied to its matn); "matn": a standalone text read on a later level (al-Mirqāt). */
  kind: z.enum(["sharh", "matn"]).default("sharh"),
  /** The level it is read on ("2", or "2A", "2B" if a level ever offers a choice): read lesson by lesson after the levels before it. */
  track: z.string().regex(/^[0-9]+[A-Z]?$/).optional(),
  edition: z.object({ title: z.string(), editor: z.string().optional(), publisher: z.string().optional(), place: z.string().optional(), year: z.string().optional(), source: z.string().optional() }),
  blocks: z.array(CommentaryBlock).min(1),
});
export type CommentaryBlock = z.infer<typeof CommentaryBlock>;

/** The lesson groups of level 2 (lessons.json): which matn segments each lesson covers, the same for every track. */
export const LessonGroup = z.object({ n: z.number().int().min(1), matn: z.array(z.string()).min(1) });
export type LessonGroup = z.infer<typeof LessonGroup>;

/** A book's own lesson plan (commentaries/<id>/lessons.json), for a standalone text: which blocks each lesson holds, and its title per language. */
export const LessonPlan = z.array(z.object({ n: z.number().int().min(1), blocks: z.array(z.string()).min(1), title: z.record(z.string(), z.string()) }));
export type LessonPlan = z.infer<typeof LessonPlan>;

/** A lesson's test (commentaries/<id>/quizzes/<n>.json). */
export const LessonQuiz = z.object({ lesson: z.string().regex(/^[a-z]+-[0-9]+$/), items: z.array(Exercise).min(3).max(16) });
export type LessonQuiz = z.infer<typeof LessonQuiz>;

/**
 * Our explanation of a lesson of a later level (commentaries/<id>/explain/<n>.json), as in the primers: paragraphs,
 * examples after paragraph `after` (0-based; the last if left out), a diagram and the key terms. Translations in
 * i18n/<code>/commentaries/<id>/explain/<n>.json (LessonExplainTranslation); the Arabic is never translated.
 */
export const LessonExplain = z.object({
  body: z.array(z.string().min(1)).min(1),
  examples: z.array(z.object({ arabic: z.string().min(1), en: z.string().min(1), after: z.number().int().min(0).optional() })).default([]),
  diagram: z.object({ type: DiagramType, focus: z.string().optional(), after: z.number().int().min(0).optional() }).optional(),
  terms: z.array(z.object({ arabic: z.string().min(1), transliteration: z.string().min(1), en: z.string().min(1) })).default([]),
});
export type LessonExplain = z.infer<typeof LessonExplain>;
export const LessonExplainTranslation = z.object({
  body: z.array(z.string().min(1)).min(1).optional(),
  examples: z.array(z.string().min(1)).optional(),
  terms: z.array(z.string().min(1)).optional(),
});
export type LessonExplainTranslation = z.infer<typeof LessonExplainTranslation>;

/** One lesson of a track: the commentary's blocks on a group of matn segments, with its test. */
export interface Lesson {
  /** "<commentary>-<n>", e.g. kati-2. */
  id: string;
  n: number;
  /** Its title per language, from the book's own lesson plan (a commentary on the al-Mabādiʾ uses the shared topics instead). */
  title?: Record<string, string>;
  matn: string[];
  blocks: string[];
  quiz?: LessonQuiz;
  /** Our explanation, with examples and a diagram (commentaries/<id>/explain/<n>.json). */
  explain?: LessonExplain;
  /** Its translations per language. */
  explainTranslations?: Record<string, LessonExplainTranslation>;
}

/** A standalone text's own division (commentaries/<id>/outline.json): its parts, each holding a run of lessons, which serve as its chapters. */
export const Outline = z.array(
  z.object({
    tile: z.string().min(1),
    arabic: z.string().min(1),
    transliteration: z.string().min(1),
    title: z.record(z.string(), z.string()),
    lessons: z.array(z.number().int().min(1)).min(1),
  }),
);
export type Outline = z.infer<typeof Outline>;

export type Commentary = z.infer<typeof Commentary> & {
  translations: Record<string, Record<string, string>>;
  lessons: Lesson[];
  /** The book's own parts, when it is not grouped like the al-Mabādiʾ. */
  outline?: Outline;
  /** Translated test items per language: item id → prompt/options/explanation. */
  quizTranslations: Record<string, Record<string, { prompt: string; options: string[]; explanation: string }>>;
};

/** Background section ("The book"): the people around the al-Mabādiʾ and articles about it (background/). */
const Source = z.object({ title: z.string().min(1), url: z.string().url() });
/** The schools and lands of naḥw, in the order the generations page shows them. */
export const SCHOOLS = ["basra", "kufa", "baghdad", "egypt-sham", "andalus", "maghrib", "hijaz-yemen", "persia-central-asia", "ottoman", "india"] as const;
/** The lists of al-Zubaydī's Ṭabaqāt, with the number of generations in each and the schools they fit. */
export const TABAQA_LISTS = ["basra-nahw", "kufa-nahw", "basra-lugha", "kufa-lugha", "egypt", "qayrawan", "andalus"] as const;
export const TABAQA_GENERATIONS: Record<(typeof TABAQA_LISTS)[number], { generations: number; schools: (typeof SCHOOLS)[number][] }> = {
  "basra-nahw": { generations: 10, schools: ["basra", "baghdad"] },
  "kufa-nahw": { generations: 6, schools: ["kufa", "baghdad"] },
  "basra-lugha": { generations: 7, schools: ["basra", "baghdad"] },
  "kufa-lugha": { generations: 5, schools: ["kufa", "baghdad"] },
  egypt: { generations: 3, schools: ["egypt-sham"] },
  qayrawan: { generations: 4, schools: ["maghrib"] },
  andalus: { generations: 6, schools: ["andalus"] },
};
export const BackgroundPerson = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(1),
  arabic: z.string().optional(),
  known: z.string().optional(),
  born: z.string().optional(),
  died: z.string().optional(),
  places: z.array(z.string()).default([]),
  roles: z.array(z.enum(["author", "forerunner", "translator", "commentator", "glossator", "versifier", "teacher", "editor", "voice", "modern-scholar"])).min(1),
  summary: z.string().min(1),
  bio: z.array(z.string().min(1)).min(1),
  works: z
    .array(z.object({ title: z.string().min(1), arabic: z.string().optional(), kind: z.enum(["matn", "sharh", "hashiya", "taliq", "nazm", "translation", "edition", "other"]), on: z.string().optional(), note: z.string().optional() }))
    .default([]),
  reception: z.array(z.string()).default([]),
  uncertain: z.array(z.string()).default([]),
  /** The books in "The book" section this person belongs to (mabadi, mirqat, …). */
  books: z.array(z.string()).default([]),
  /**
   * The school or land of naḥw the histories place him in (the backbone of /scholars/generations/): Basra and Kufa for
   * the first centuries, Baghdad for those who joined the two and for Iraq after them, then the lands. Someone formed
   * in al-Andalus who taught in Cairo stays Andalusian, as in the histories; `places` says where he worked and died.
   */
  school: z.enum(SCHOOLS).optional(),
  /**
   * Where al-Zubaydī (d. 379/989) places him in his Ṭabaqāt al-naḥwiyyīn wa-l-lughawiyyīn: the list (the grammarians
   * or the lexicographers of Basra and Kufa, the Egyptians, the men of Qayrawān, the Andalusians), the generation in it
   * and the number of his entry in the printed edition. Checked by loadBackground: the generation must exist in that
   * list, and the list must fit the school.
   */
  tabaqa: z.object({ list: z.enum(TABAQA_LISTS), n: z.number().int().min(1), entry: z.number().int().min(1).optional() }).optional(),
  sources: z.array(Source).min(1),
});
export const BackgroundArticle = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  /** The book it is about (mabadi, mirqat, …). */
  book: z.string().default("nahw"),
  title: z.string().min(1),
  order: z.number(),
  summary: z.string().min(1),
  /** A curriculum article: the madrasa path of the study portal that follows it, linked at the end of the article. */
  madrasa: z.enum(["indian", "ottoman", "north-african"]).optional(),
  sections: z.array(z.object({ heading: z.string().min(1), paragraphs: z.array(z.string().min(1)).min(1) })).min(1),
  people: z.array(z.string()).default([]),
  sources: z.array(Source).min(1),
});
/**
 * A concept of the glossary (background/concepts/): one free page per technical word of ṣarf and naḥw, with its Arabic, a
 * definition and a short explanation. `term` names the lesson of the study path that teaches it, `books` the handbooks
 * of the knowledge base that treat it. The category `jargon` holds the words of the commentaries and of the Baṣran–Kūfan
 * debate (samāʿ and qiyās, ʿilla, taqdīr, "fa-in qīla … qultu …").
 */
export const CONCEPT_CATEGORIES = ["foundations", "word", "root", "verb", "sound-weak", "derived", "irab", "sentence", "governors", "followers", "accusatives", "jargon"] as const;
export const BackgroundConcept = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(1),
  arabic: z.string().min(1),
  transliteration: z.string().min(1),
  alsoKnownAs: z.array(z.string().min(1)).default([]),
  category: z.enum(CONCEPT_CATEGORIES),
  definition: z.string().min(1),
  body: z.array(z.string().min(1)).min(1),
  examples: z.array(z.object({ arabic: z.string().optional(), text: z.string().min(1) })).default([]),
  related: z.array(z.string()).default([]),
  term: z.string().optional(),
  books: z.array(z.string()).default([]),
});
export type BackgroundPerson = z.infer<typeof BackgroundPerson>;
export type BackgroundArticle = z.infer<typeof BackgroundArticle>;
export type BackgroundConcept = z.infer<typeof BackgroundConcept>;
/** Translated text of a person or article; anything missing falls back to English. */
export interface Background {
  people: BackgroundPerson[];
  articles: BackgroundArticle[];
  concepts: BackgroundConcept[];
  translations: Record<string, { people: Record<string, Partial<BackgroundPerson>>; articles: Record<string, Partial<BackgroundArticle>>; concepts?: Record<string, Partial<BackgroundConcept>> }>;
}

/** One work in the catalogue of everything written on a book: the al-Mabādiʾ (background/catalogue.json), al-Mirqāt (background/catalogue-mirqat.json), … */
export const CatalogueEntry = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  kind: z.enum(["sharh", "hashiya", "taliq", "iraab", "nazm", "mukhtasar", "translation", "edition", "modern", "other"]),
  title: z.string().min(1),
  arabic: z.string().optional(),
  author: z.string().min(1),
  authorArabic: z.string().optional(),
  died: z.string().optional(),
  /** "mabadi", or the id of the work it is written on. */
  on: z.string().default("mabadi"),
  region: z.string(),
  language: z.string(),
  status: z.enum(["printed", "manuscript", "lost", "unknown"]),
  editions: z.array(z.string()).default([]),
  note: z.string().optional(),
  /** Slug of a person page in background/people, if there is one. */
  person: z.string().optional(),
  sources: z.array(Source).min(1),
});
export type CatalogueEntry = z.infer<typeof CatalogueEntry>;

/** A news item of the knowledge base (background/news.json): a new edition, translation, study, digital resource or event. */
export const NewsItem = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  date: z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/),
  kind: z.enum(["edition", "translation", "study", "digital", "event", "media"]),
  /** The science it belongs to: manṭiq itself, or a neighbouring science (kalām, falsafa, uṣūl al-fiqh, ādāb al-baḥth wa-l-munāẓara, ʿilm al-waḍʿ, the Arabic language sciences: naḥw, ṣarf, balāgha). */
  field: z.enum(["nahw", "sarf", "balagha", "lugha", "mantiq", "usul", "tafsir"]).default("nahw"),
  /** A short headline in plain English (what happened, for a reader new to the field); shown on cards. */
  headline: z.string().min(1).max(70),
  /** One plain sentence: what it is and why a reader of manṭiq might care. */
  gist: z.string().min(1).max(160),
  /** The original title, as published (often long, often not in English). */
  title: z.string().min(1),
  summary: z.string().min(1),
  who: z.string().optional(),
  url: z.string().url(),
  books: z.array(z.string()).default([]),
});
export type NewsItem = z.infer<typeof NewsItem>;

/** A book of the library (background/library.json): a work of naḥw or ṣarf beside the six handbooks (or a ṭabaqāt of the grammarians, kind `biography`), with a short page of its own. */
export const LibraryBook = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1),
  fullTitle: z.string().optional(),
  /** The title in Arabic script, vocalised. */
  arabic: z.string().min(1),
  author: z.string().min(1),
  /** The author's scholar page, if there is one. */
  authorSlug: z.string().optional(),
  died: z.string().optional(),
  /** The century (CE) the work was written in. */
  century: z.number().int().min(8).max(21),
  kind: z.enum(["handbook", "commentary", "gloss", "treatise", "encyclopedia", "verse", "refutation", "modern", "translation", "biography"]),
  /** What it comments on: a handbook id, another library id, or a plain title. */
  on: z.string().optional(),
  language: z.enum(["ar", "fa", "ot", "ur", "other"]).default("ar"),
  summary: z.string().min(1),
  editions: z.array(z.string()).default([]),
  sources: z.array(z.object({ title: z.string().min(1), url: z.string().url() })).min(1),
});
export type LibraryBook = z.infer<typeof LibraryBook>;

/**
 * A primer course (primers/<id>.json): a short madrasa book taught in lessons written by The Nahwi, following
 * the book's own order (al-Jurjānī's Persian primers, arranged after a modern Arabic edition that is under copyright
 * and so not reproduced). Parts hold lessons; each lesson has its explanation, key terms, examples and a test, and,
 * where a free old print of the book exists (`textEdition`), the passage of the original it covers with a translation. Lesson ids `<id>-<n>` are score keys like those of the commentaries.
 */
export const PrimerLesson = z.object({
  n: z.number().int().min(1),
  title: z.string().min(1),
  arabic: z.string().min(1),
  transliteration: z.string().min(1),
  /** Pages of the edition the lesson follows. */
  pages: z.string().optional(),
  body: z.array(z.string().min(1)).min(1),
  terms: z.array(z.object({ arabic: z.string().min(1), transliteration: z.string().min(1), en: z.string().min(1) })).default([]),
  /** Examples, shown inside the explanation after paragraph `after` (0-based; the last paragraph if left out). */
  examples: z.array(z.object({ arabic: z.string().min(1), en: z.string().min(1), after: z.number().int().min(0).optional() })).default([]),
  /** A diagram inside the explanation (Diagram.astro, or a tree or grid of its own, LessonDiagram), after paragraph `after` (the last if left out). */
  diagram: LessonDiagram.optional(),
  /** Exercises to do in writing, each with a model answer (shown after the explanation, before the test). */
  tasks: z.array(LessonTask).default([]),
  quiz: z.array(Exercise).min(3).max(16),
  /** How many of the quiz's questions one test asks (the rest are kept in reserve and rotate in on a retry). */
  ask: z.number().int().min(3).optional(),
  /** The passages of the original (from `textEdition`) that this lesson covers, each with its page there and a translation. */
  text: z.array(z.object({ original: z.string().min(1), page: z.string().optional(), en: z.string().min(1), /** Set by primerIn: the language of `en` when a translation has replaced the English. */ lang: z.string().optional() })).default([]),
});
export const Primer = z.object({
  id: z.string().regex(/^[a-z]+$/),
  title: z.string().min(1),
  arabicTitle: z.string().min(1),
  /** The transliterated Arabic (or Persian) title. */
  transliteration: z.string().optional(),
  author: z.string().min(1),
  authorArabic: z.string().min(1),
  authorSlug: z.string().optional(),
  died: z.string().optional(),
  /** The library entry (background/library.json) of the work. */
  library: z.string().optional(),
  /** The madrasa path (config/madrasas.ts) the primer belongs to first (curriculum.json may place it on others too). */
  madrasa: z.enum(["indian", "ottoman", "north-african"]),
  /** The science it teaches: ṣarf or naḥw (the two lanes of every path). */
  subject: Subject.optional(),
  /** "beginner" or "intermediate" (or "advanced"): shown on the book's card. */
  stage: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  /** Reading order inside the level: 1 Ṣughrā, 2 Kubrā. */
  order: z.number().int().min(1),
  summary: z.string().min(1),
  edition: z.object({ title: z.string(), editor: z.string().optional(), publisher: z.string().optional(), place: z.string().optional(), year: z.string().optional(), pages: z.string().optional(), source: z.string().url().optional() }),
  /** A public-domain print of the original text, transcribed for the lessons' `text`. */
  textEdition: z
    .object({ title: z.string(), language: z.enum(["fa", "ar"]), publisher: z.string().optional(), place: z.string().optional(), year: z.string().optional(), pages: z.string().optional(), source: z.string().url(), note: z.string().optional(), selection: z.boolean().default(false) })
    .optional(),
  parts: z
    .array(z.object({ id: z.string().regex(/^[a-z-]+$/), title: z.string().min(1), arabic: z.string().min(1), transliteration: z.string().min(1), lessons: z.array(PrimerLesson).min(1) }))
    .min(1),
});
export type Primer = z.infer<typeof Primer>;

/**
 * A primer course in another site language (i18n/<code>/primers/<id>.json): the texts written by The Nahwi, by
 * lesson number; whatever is left out stays in English. Lists must match the source in length (terms, examples, the
 * translations of the quoted passages `text`, the test and each question's options); the original passages, the
 * Arabic of terms and examples and the right answers are never translated.
 */
export const PrimerTranslation = z.object({
  title: z.string().min(1).optional(),
  summary: z.string().min(1).optional(),
  parts: z.record(z.string(), z.string().min(1)).default({}),
  lessons: z.record(
    z.string().regex(/^[0-9]+$/),
    z.object({
      title: z.string().min(1).optional(),
      body: z.array(z.string().min(1)).min(1).optional(),
      terms: z.array(z.string().min(1)).optional(),
      examples: z.array(z.string().min(1)).optional(),
      text: z.array(z.string().min(1)).optional(),
      tasks: z.array(z.object({ prompt: z.string().min(1), answer: z.string().min(1) })).optional(),
      /** The lesson's own diagram: its caption, and each English label (tree nodes, table heads and cells) with its translation. */
      diagram: z.object({ caption: z.string().optional(), labels: z.record(z.string(), z.string()).default({}) }).optional(),
      quiz: z.array(z.object({ prompt: z.string().min(1), options: z.array(z.string().min(1)), explanation: z.string().min(1) })).optional(),
    }),
  ),
});
export type PrimerTranslation = z.infer<typeof PrimerTranslation>;
export type PrimerLesson = z.infer<typeof PrimerLesson>;

/**
 * The madrasa paths of the study portal (curriculum.json): which books are read on which level of which path.
 * A book is named by id: "mabadi" (the al-Mabādiʾ term by term), a primer, or a book of commentaries/.
 */
// The editing screen writes empty values ("", []) for what is left blank; they count as absent.
const BookId = z.string().regex(/^[a-z][a-z0-9-]*$/);
/**
 * A level of a madrasa path. `books` are read by both sciences (al-Mabādiʾ); a later level has two lanes side by side,
 * `sarf` and `nahw`, each in reading order, which may name books still in preparation (ids that are no course yet);
 * `soon` is the older form of a level that is only in preparation. `stage` is the level's name on the cards.
 */
export const CurriculumLevel = z.object({
  n: z.number().int().min(1),
  stage: z.enum(["foundations", "beginner", "intermediate", "advanced"]).optional(),
  books: z.array(BookId).optional(),
  sarf: z.array(BookId).optional(),
  nahw: z.array(BookId).optional(),
  soon: z.union([z.literal(""), BookId]).optional(),
}).refine((l) => Boolean(l.books?.length || l.sarf?.length || l.nahw?.length || l.soon), { message: "a level needs books, a lane or soon" });
export const CurriculumPath = z.object({
  id: z.enum(["indian", "ottoman", "north-african"]),
  traditions: z.array(z.string()).min(1),
  photo: z.string(),
  levels: z.array(CurriculumLevel).min(1),
});
export const Curriculum = z.object({ note: z.string().optional(), paths: z.array(CurriculumPath).min(1) });
export type Curriculum = z.infer<typeof Curriculum>;
export type CurriculumPath = z.infer<typeof CurriculumPath>;

/** Reviews of lessons and texts (reviews.json): only what a teacher has checked is listed; the rest is a draft. */
export const ReviewEntry = z.object({ key: z.string(), by: z.string(), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), note: z.string().optional() });
export const Reviews = z.object({
  note: z.string().optional(),
  reviewers: z.array(z.object({ id: z.string(), name: z.string() })),
  reviewed: z.array(ReviewEntry),
});
export type Reviews = z.infer<typeof Reviews>;
/** How a page shows its review: a draft, or reviewed by someone on a date. */
export interface ReviewState { status: "draft" | "reviewed"; by?: string; date?: string }

/**
 * A ṭabaqāt work put on the site whole, entry by entry (tabaqat/<id>.json; docs/tabaqat-pipeline.md): Ibn al-Anbārī's
 * Nuzhat al-alibbāʾ, the backbone of the scholars. The Arabic is transcribed from a public-domain print (`edition`, with
 * its scan; PDF page = print page + `offset`) and vocalised by us; the English is our own translation. Each entry is tied
 * to its scholar's page (`person`) where there is one. Checked by loadTabaqat: entries numbered 1, 2, 3 … in the book's
 * order, ids unique, every person a page, every paragraph's page inside its entry's pages.
 */
export const TabaqatParagraph = z.object({
  /** The Arabic of one paragraph, fully vocalised; verse as "hemistich * hemistich", lines separated by "\n". */
  ar: z.string().min(1),
  /** The page of the print the paragraph begins on. */
  page: z.string().regex(/^[0-9]{1,3}$/),
  en: z.string().min(1),
  /** A sub-heading of the print inside an entry (the opening section on ʿAlī and Abū al-Aswad). */
  sub: z.boolean().optional(),
});
const PrintPages = z.string().regex(/^[0-9]{1,3}(–[0-9]{1,3})?$/);
export const TabaqatEntry = z.object({
  /** The entry's number in the book, in order through the whole book. */
  n: z.number().int().min(1),
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  /** The name as the print sets it in the margin, vocalised. */
  heading: z.string().min(1),
  /** The name in ALA-LC transliteration, as the entry is best known. */
  name: z.string().min(1),
  /** The death date as the entry gives it, Hijri/Common Era ("69/688"); absent when the entry gives none. */
  died: z.string().min(1).optional(),
  /** The city the entry ties him to, in plain English. */
  place: z.string().min(1).optional(),
  pages: PrintPages,
  paragraphs: z.array(TabaqatParagraph).min(1),
  /** The scholar's page (background/people/<slug>.json). */
  person: z.string().optional(),
  /** Doubtful readings and misprints; never shown as part of the text. */
  notes: z.string().optional(),
});
export const TabaqatBook = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  /** Its entry in the library (background/library.json). */
  library: z.string().min(1),
  title: z.string().min(1),
  arabicTitle: z.string().min(1),
  /** The title as the print has it, vocalised. */
  printTitle: z.string().optional(),
  author: z.string().min(1),
  authorArabic: z.string().min(1),
  authorSlug: z.string().min(1),
  died: z.string().min(1),
  edition: z.object({
    title: z.string().min(1),
    publisher: z.string().min(1),
    place: z.string().min(1),
    year: z.string().min(1),
    pages: z.string().min(1),
    /** The library whose copy was scanned, and its shelf mark. */
    copy: z.string().min(1),
    /** The scan's viewer page and the file of the scan. */
    source: z.string().url(),
    scan: z.string().url(),
    /** PDF page = print page + offset. */
    offset: z.number().int(),
  }),
  /** Our introduction to the book (English, translated later like the articles). */
  introduction: z.array(z.string().min(1)).min(1),
  /** The author's preface (khuṭba). */
  preface: z.array(TabaqatParagraph).default([]),
  entries: z.array(TabaqatEntry).default([]),
  /** The author's closing: his own chain of teachers back to ʿAlī. */
  closing: z.array(TabaqatParagraph).default([]),
});
export type TabaqatParagraph = z.infer<typeof TabaqatParagraph>;
export type TabaqatEntry = z.infer<typeof TabaqatEntry>;
export type TabaqatBook = z.infer<typeof TabaqatBook>;
