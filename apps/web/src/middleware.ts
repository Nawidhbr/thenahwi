import { defineMiddleware } from "astro:middleware";
import { plainLatin } from "./lib/plain-latin";

// Every page and data file is served with plain Latin letters (lib/plain-latin.ts): the content keeps its scholarly
// transliteration, the reader sees it without the marks. The language is the first part of the address.
const TEXT = /^(text\/html|application\/json|application\/manifest\+json|text\/javascript|application\/javascript)/;

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  const type = response.headers.get("content-type") ?? "";
  const path = context.url.pathname;
  if (!TEXT.test(type) && !/\.(json|js|webmanifest)$/.test(path) && !path.endsWith("/")) return response;
  const locale = path.split("/")[1] || "en";
  const body = await response.text();
  return new Response(plainLatin(body, locale), { status: response.status, statusText: response.statusText, headers: response.headers });
});
