# News

The Nahwi gathers no news of its own (decisions 2026-11-26). The Mantiqi, its parent site, gathers the news of manṭiq
and its neighbouring sciences each week, from Sunni Islamic institutions only, and gives naḥw and ṣarf a field of their
own (`nahw`, "Naḥw & ṣarf", in The Mantiqi's `background/news.json`; its `docs/news.md` describes the round, the finder
and the rule for sources). The Nahwi shows that field:

- `/<locale>/news/` lists the items of the field, newest first, read in the browser from The Mantiqi's RSS feed
  (`https://themantiqi.com/en/news/feed.xml`, where each item carries its field as a `<category>`), with buttons to The
  Mantiqi's news page filtered on the field (`#field=nahw`) and to the feed;
- the home page shows the three newest in a block under the handbooks;
- both through `scripts/parent-news.js`, with the addresses in `PARENT` of `config/site.ts`.

The Mantiqi serves its feed to thenahwi.com with `Access-Control-Allow-Origin` (its `vercel.json`), and The Nahwi's CSP
allows `https://themantiqi.com` in `connect-src`. The pages carry a line of their own while the feed loads, and say so
and link to The Mantiqi when it has no items or cannot be reached; nothing of The Mantiqi's news is copied into The
Nahwi's pages, so search engines find each item once, where it was gathered.

News for the field is proposed through The Mantiqi: its contact form, its weekly finder (which scores the words of
naḥw and ṣarf as their own field) and its scheduled Claude task. `background/news.json` here stays empty, and the news
schema and `lib/news.ts` stay only because the copy of The Mantiqi's code still reads them.
