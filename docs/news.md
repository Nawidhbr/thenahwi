# News

The news section shows new work on naḥw and ṣarf and their neighbouring sciences, from Sunni Islamic institutions
only. Nothing is published by itself: every item goes through a pull request that the site owner merges.

**Not running yet.** The finder's schedule is off (`.github/workflows/news-finder.yml`), the Claude task does not
exist for The Nahwi, and `background/news.json` is empty. The words and searches were retuned to naḥw and ṣarf on
26 November 2026 but never tried; the journals, feeds and trusted hosts are still The Mantiqi's (Islamic studies in
general). Before turning it on: run the finder once by hand (`node scripts/news-finder.mjs --days 60`), read what it
finds, add the journals of Arabic language and grammar from vetted institutions (al-Azhar's Faculty of Arabic
Language, the Arabic language academies, the DergiPark journals of Arabic language), then set up the Claude task
(step 2) and remove the # before the schedule.

## The weekly round

1. **Saturday morning, the finder** (`.github/workflows/news-finder.yml`, `scripts/news-finder.mjs`, looking back
   eight days) searches Crossref (one request at a time, with a gap, and asked again after a wait when it answers 429:
   asked too fast, it refused every search in November 2026 and the finder found nothing for weeks), OpenAlex (only
   with `OPENALEX_KEY`, a free key from openalex.org set as a repository secret; without it OpenAlex is left out) and
   the sources in `scripts/news-sources.json`: Google News searches in nine languages (Arabic, English, Indonesian, Turkish, Urdu, Persian, French, German, Russian) (the last eight days), the same
   kept to the sites of trusted institutions (`googleNewsSites`: al-Azhar, Dār al-Iftāʾ, the Egyptian Awqaf, Diyanet,
   İSAM, NU and the pesantren sites, the Malaysian mufti offices), journals followed through Crossref by ISSN, DOAJ
   searches and journals (the open-access journals of Iran, whose DOIs go through mEDRA, the Arab world, Indonesia,
   Malaysia and Central Asia), and RSS feeds (the latest issues of DergiPark journals, blogs, podcasts). Every result
   is scored by weighted words, in Arabic and Persian too (Arabic script folded: vowel marks, hamza seats, Persian and
   Arabic yāʾ and kāf; other senses of the words count against: نحو as "towards" in a headline (نحو المستقبل), ṣarf as
   exchange or spending (سعر الصرف, Turkish sarf etmek), and other grammars (English, programming)). Whatever an earlier issue listed is left out
   (read from GitHub with the workflow's token), and so are `skipHosts` (lecture series published episode by
   episode, library catalogues, office documents). Google's date is the day it found a page, which can be an old one,
   so the reviewer checks the date on the page itself. It opens a GitHub issue "News candidates <date> (n)" in three parts: candidates on naḥw and ṣarf from
   vetted sources; "Neighbouring sciences", what vetted sources published on balāgha, lugha, manṭiq, uṣūl al-fiqh or
   tafsīr (scored on their own words, `NEIGHBOUR`); and "Not from a vetted institution", what is on naḥw or ṣarf but
   from another source, for the owner only (never added; at most named under "Waiting for your
   approval"). Each item shows its `from:`, and the issue ends with how each kind of source did (results, failed asks),
   so a source that stops working shows at once.
2. **Saturday morning, a scheduled Claude task** (to be made, as for The Mantiqi's "wekelijks nieuws") reads that issue,
   applies the same rule, writes the chosen items into `background/news.json` on a branch `news/<date>` and opens a
   pull request (body in Dutch). It never pushes to main and never merges.
3. **The owner merges** the pull request, or not.

## The rule for sources

Only Sunni Islamic institutions, checked by institution, never by a person's name: a vetted source in
`news-sources.json` with its `by`, or one whose ISSN, site or publisher is in `trust`. `notPublishers` keeps out
Shiʿi and other bodies. Doubtful sources wait in `onHold` with the reason until the owner approves them. An item found
by hand passes the same rule or waits for the owner's approval.

## An item

`background/news.json` is `{ "items": [...] }`, newest first. Each item: `id`, `date`, `kind` (study, edition,
translation, digital, event, media), `field` (`nahw`, `sarf`, or a neighbouring science: `balagha`, `lugha` for
lexicography and philology, `mantiq`, `usul` for uṣūl al-fiqh, `tafsir`), a plain `headline` (at most 70 characters, what happened, for a reader new to the field), a one-sentence
`gist` (at most 160), the original `title`, our own `summary`, `who`, `url` and `books` (handbook ids, if any). Work
only from what the source itself says; never invent facts.
