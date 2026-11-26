-- The Nahwi: hearts (lib/progress.js), kept with the profile so that clearing a browser does not give them back and
-- a refill reaches every device. Apply after the earlier migrations (SQL Editor → paste → Run). Safe to run more than
-- once.
--
-- * profiles.hearts is { n, at, r } as the browser keeps it ("nahwi-hearts"): n hearts at the moment at (ms since
--   1970), r the moment of the last refill. The reader's own browser writes it (lib/account-sync.ts, mergeHearts), like
--   the madrasa path; the existing policies ("own profile") cover it.
-- * A refill bought with Paddle (a transaction with custom_data.kind "hearts") is written by api/paddle.js with the
--   service role: { n: 5, at: now, r: now }. A gift of a refill by the owner, in the SQL Editor:
--     update public.profiles set hearts = jsonb_build_object('n', 5, 'at', (extract(epoch from now()) * 1000)::bigint,
--       'r', (extract(epoch from now()) * 1000)::bigint) where id = (select id from auth.users where email = '…');

alter table public.profiles add column if not exists hearts jsonb
  check (hearts is null or (jsonb_typeof(hearts) = 'object' and pg_column_size(hearts) < 200));
