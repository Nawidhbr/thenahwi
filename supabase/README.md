# Supabase

The database for optional accounts, progress on every device and licences for full access. The project lives in the
EU (Frankfurt); its public URL and publishable key are in `apps/web/src/config/supabase-public.ts`, the secret key
only in Vercel (`SUPABASE_SERVICE_ROLE_KEY`). How the site uses it: `docs/accounts-payments.md`.

**For The Nahwi no project exists yet**: make one and run every file of `migrations/` in order
(`docs/setup-new-site.md`, step 6). What follows is The Mantiqi's history, kept for the order and the checks.

`migrations/` holds the schema as SQL, in order. Applied to The Mantiqi's live project: the accounts
(`20261108000000_accounts.sql`) and the Paddle columns of the licences (`20261108120000_licences_paddle.sql`, safe to
run more than once) and the access codes (`20261115120000_access_codes.sql`, on 18 November 2026; how to make a code
is at the top of the file and in `docs/accounts-payments.md`). **Not applied yet**: the hearts
(`20261118120000_hearts.sql`, one column of `profiles`; safe to run more than once) and the questions and remarks
(`20261121120000_comments.sql`: the tables `comments` and `moderators`, the view `comments_public`; safe to run more
than once; then make yourself a moderator with the query at its top). A new migration is applied the
same way:

1. Supabase dashboard → the project → **SQL Editor** → New query.
2. Paste the file from `migrations/` and press **Run**.
3. Check under **Table Editor** that `profiles`, `scores`, `visited` and `licences` exist, each marked "RLS enabled".

What the schema guarantees:

- Every table has row-level security: a learner reads and writes only their own rows.
- Licences are written only by the server (the Paddle webhook, `api/paddle.js`, with the secret key); the browser can
  only read its own.
- Signing in merges the browser's scores into the account with `merge_scores` (and the steps seen with
  `merge_visited`): the highest score per lesson wins, so nothing is lost.
- Access codes are stored only as hashes and read by nobody but the owner; `redeem_code(code)` gives the signed-in
  learner a licence from a code, once per account, at most 10 tries a day; `create_access_code(…)` is for the owner
  only (SQL Editor).
- `export_my_data()` returns everything stored about the learner; `delete_my_account()` deletes the account and,
  through `on delete cascade`, every row that belongs to it.

## Testing the migrations on a plain Postgres

`tests/` checks the schema without touching the real project: `00-mock-supabase.sql` stands in for Supabase's roles,
`auth.users` and `auth.uid()`; `10-accounts.sql` makes two learners and checks that scores merge with the highest
winning (bad keys dropped, scores capped at 10), that one learner neither sees nor writes the other's rows, that a
learner cannot give themselves a licence, and that deleting an account removes its scores, licences and profile.

```sh
createdb t
psql -d t -f supabase/tests/00-mock-supabase.sql
psql -d t -f supabase/migrations/20261108000000_accounts.sql
psql -d t -f supabase/migrations/20261108120000_licences_paddle.sql
psql -d t -f supabase/tests/10-accounts.sql
```

The access codes are checked on a fresh database: the mock, the three migrations, then `tests/20-access-codes.sql`
(codes made and stored as hashes, a short code refused; a code redeemed in any case or spacing, once per account,
not when expired or used up, at most 10 tries a day; readers cannot read or make codes, anon cannot redeem; deleting
an account removes its licences and tries and keeps the code's count). Last run (15 November 2026, PostgreSQL 16):
all as expected.

The questions and remarks are checked on a fresh database: the mock, the five migrations, then
`tests/30-comments.sql` (a message waits until a moderator publishes it; a reader cannot publish their own, write as
another, read or delete another's, or moderate; a name or "without a name" is required and names are trimmed; the
public view holds no account ids and no name for a message sent without one; anon reads only the view and cannot
write; the sixth message in an hour is refused; the export holds the reader's messages; deleting an account removes
them). Last run (21 November 2026, PostgreSQL 16): all as expected.

Last run (8 November 2026, PostgreSQL 16): all checks as expected.
