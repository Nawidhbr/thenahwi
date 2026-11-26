# The Nahwi

The Nahwi (النَّحْوِيّ, the grammarian) teaches **ṣarf and naḥw**, Arabic morphology and syntax as the madrasa
teaches them, at [thenahwi.com](https://thenahwi.com): a free knowledge base (the handbooks, the scholars, the
library, the curricula and news), a conjugation tool, and a study portal with three madrasa paths (Indian, Ottoman
and North-African), every book taught lesson by lesson with the original text, tests and review. English first; more
languages follow. Built from a copy of The Mantiqi (themantiqi.com): see `docs/setup-new-site.md` for what is not set
up yet.

## Structure

```
apps/web            The website (Astro, static output)
packages/content    All content as JSON, its schema and validation (writes generated/)
packages/engine     The taṣrīf engine: conjugation of the sound triliteral verb, its bābs and augmented forms,
                    participles and maṣdars, and the exercises made from them (with tests)
api/                Vercel functions: contact form, error reports, Paddle webhook
scripts/            Site check, local server for the tests, IndexNow, Paddle prices, news finder
e2e/                Playwright tests against the built site
supabase/           Database schema for accounts, with its tests
archive/            Kept for later, not built (the Keystatic editing screen)
docs/               How everything works
```

## Commands

```bash
npm install
npm run dev     # local site at http://localhost:4321/en/
npm test        # engine and web unit tests, content validation
npm run build   # validates the content, then builds the site into dist/
npm run check   # everything a change must pass: tests, build, site check, Playwright
```

## Documentation

`CLAUDE.md` holds the rules for every change; `docs/` explains the parts: architecture, content, the study portal,
the knowledge base, languages, accounts and payments, news, operations (services, settings, runbooks), the
decisions taken, and the checklist for setting up the new site.

## Deploying

Vercel builds the repository root (`vercel.json` sets the build, redirects and headers); `main` goes to production,
other branches to previews, which are never indexed. Production has `INDEXING=on`; `SITE_URL` is the one place the
domain is set. The environment variables are listed in `docs/operations.md`.

## Licence

All rights reserved: see `LICENSE`. The original Arabic and Persian texts from public-domain prints stay free;
everything written for The Nahwi, including our transcriptions, vocalisation and translations, is not.
