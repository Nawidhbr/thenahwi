import type { APIRoute } from "astro";
import { SITE } from "../config/site";

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify(
      {
        name: `${SITE.name}: learn ṣarf and naḥw`,
        short_name: SITE.name,
        description: "Ṣarf and naḥw, Arabic grammar as the madrasa teaches it: a free encyclopedia, a conjugation tool, and the books of three madrasa paths read lesson by lesson, with tests and tikrār.",
        lang: "en",
        id: "/en/",
        start_url: "/en/",
        scope: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#cc4a0a",
        categories: ["education", "books"],
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
          { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
        ],
        // Shown by browsers when the site is installed, and read by app stores (public/screenshots/, made with the
        // store images in store/android/).
        screenshots: [
          { src: "/screenshots/narrow-home.webp", sizes: "540x960", type: "image/webp", form_factor: "narrow", label: "The encyclopedia of ṣarf and naḥw" },
          { src: "/screenshots/narrow-study.webp", sizes: "540x960", type: "image/webp", form_factor: "narrow", label: "The study portal: three madrasa paths" },
          { src: "/screenshots/narrow-progress.webp", sizes: "540x960", type: "image/webp", form_factor: "narrow", label: "Your progress, book by book" },
          { src: "/screenshots/wide-home.webp", sizes: "1280x720", type: "image/webp", form_factor: "wide", label: "The encyclopedia of ṣarf and naḥw" },
          { src: "/screenshots/wide-progress.webp", sizes: "1280x720", type: "image/webp", form_factor: "wide", label: "Your progress, book by book" },
        ],
        shortcuts: [
          { name: "Study", url: "/en/study/" },
          { name: "Text", url: "/en/text/" },
          { name: "Practice", url: "/en/practice/" },
          { name: "Progress", url: "/en/study/progress/" },
        ],
      },
      null,
      2,
    ),
    { headers: { "Content-Type": "application/manifest+json" } },
  );
