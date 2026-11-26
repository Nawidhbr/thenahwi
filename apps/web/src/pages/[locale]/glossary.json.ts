import type { APIRoute } from "astro";
import { getBackground, getGlossary } from "@nahwi/content";
import { localePaths } from "../../i18n";

export const getStaticPaths = localePaths;

/**
 * The word explanations of one language, for the pop-ups: id → plain word, note, and the free page of the concept in
 * the glossary (by the pop-up's term, or a concept of the same id) with its name and Arabic.
 */
export const GET: APIRoute = ({ params }) => {
  const locale = params.locale as string;
  const concepts = getBackground(locale).concepts;
  const data = Object.fromEntries(
    getGlossary(locale).entries.map((e) => {
      const c = concepts.find((x) => (e.term && x.term === e.term) || x.slug === e.id || x.slug === e.term);
      return [e.id, { p: e.plain, ...(e.note ? { n: e.note } : {}), ...(c ? { h: `/${locale}/glossary/${c.slug}/`, t: c.name, a: c.arabic } : {}) }];
    }),
  );
  return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json; charset=utf-8" } });
};
