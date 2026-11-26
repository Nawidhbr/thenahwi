-- The Nahwi, phase 3: optional accounts, progress that travels with the learner, and licences for the paid lessons.
-- NOT APPLIED YET. Apply in the Supabase dashboard (SQL Editor → paste → Run) or with the Supabase CLI
-- (`supabase db push`), once the plan for phase 3 is agreed. See supabase/README.md.
--
-- Principles:
-- * The browser stays the first place for progress (the site works offline and without an account); an account
--   keeps a copy and merges it, the highest score winning, so nothing is ever lost by logging in.
-- * Row-level security on every table: a learner reads and writes only their own rows. Licences are written only by
--   the server (the Mollie webhook, with the service-role key), never by the browser.
-- * Deleting an account deletes everything that belongs to it (on delete cascade), at once.

-- Profiles: one row per account, made when the account is made.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (char_length(display_name) <= 80),
  madrasa text check (madrasa in ('indian', 'ottoman', 'north-african')),
  locale text check (locale ~ '^[a-z]{2}$'),
  created_at timestamptz not null default now()
);

-- Scores: one row per lesson or term (the score key the site uses: a term's slug, or <book>-<n>), out of 10.
create table public.scores (
  user_id uuid not null references auth.users (id) on delete cascade,
  key text not null check (key ~ '^[a-z0-9-]{1,80}$'),
  score numeric(4, 2) not null check (score >= 0 and score <= 10),
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);

-- Steps without a test count as passed once seen; this is the list of those seen.
create table public.visited (
  user_id uuid not null references auth.users (id) on delete cascade,
  key text not null check (key ~ '^[a-z0-9-]{1,80}$'),
  seen_at timestamptz not null default now(),
  primary key (user_id, key)
);

-- Licences for the paid lessons: personal (a subscription) or class (a madrasa or teacher with seats).
create table public.licences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('personal', 'class')),
  seats int check (seats is null or seats > 0),
  mollie_id text unique,
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.scores enable row level security;
alter table public.visited enable row level security;
alter table public.licences enable row level security;

create policy "own profile: read" on public.profiles for select using (auth.uid() = id);
create policy "own profile: change" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "own scores: read" on public.scores for select using (auth.uid() = user_id);
create policy "own scores: add" on public.scores for insert with check (auth.uid() = user_id);
create policy "own scores: change" on public.scores for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own scores: remove" on public.scores for delete using (auth.uid() = user_id);

create policy "own visits: read" on public.visited for select using (auth.uid() = user_id);
create policy "own visits: add" on public.visited for insert with check (auth.uid() = user_id);
create policy "own visits: remove" on public.visited for delete using (auth.uid() = user_id);

-- Licences: a learner may see their own; only the server (service role, which bypasses row-level security) writes.
create policy "own licences: read" on public.licences for select using (auth.uid() = user_id);

-- A profile for every new account.
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Merge the browser's scores into the account: the highest score per key wins, so logging in never loses progress.
-- Called with a JSON object { "<key>": score, … }; returns all of the account's scores after the merge.
create function public.merge_scores(incoming jsonb) returns table (key text, score numeric)
language sql security invoker set search_path = '' as $$
  insert into public.scores (user_id, key, score)
  select auth.uid(), e.key, least(10, greatest(0, (e.value)::numeric))
  from jsonb_each_text(incoming) as e
  where e.key ~ '^[a-z0-9-]{1,80}$'
  on conflict (user_id, key) do update
    set score = greatest(public.scores.score, excluded.score), updated_at = now()
    where excluded.score > public.scores.score;
  select s.key, s.score from public.scores s where s.user_id = auth.uid();
$$;

-- Merge the browser's list of seen steps into the account the same way (a step once seen stays seen).
-- Called with a JSON array [ "<key>", … ]; returns all of the account's seen keys after the merge.
create function public.merge_visited(incoming jsonb) returns setof text
language sql security invoker set search_path = '' as $$
  insert into public.visited (user_id, key)
  select auth.uid(), e.value
  from jsonb_array_elements_text(case when jsonb_typeof(incoming) = 'array' then incoming else '[]'::jsonb end) as e
  where e.value ~ '^[a-z0-9-]{1,80}$'
  on conflict (user_id, key) do nothing;
  select v.key from public.visited v where v.user_id = auth.uid();
$$;

-- Whether the learner may open the paid lessons now: a personal licence, or a seat in a class (phase 4), not ended.
create function public.has_licence() returns boolean
language sql stable security invoker set search_path = '' as $$
  select exists (
    select 1 from public.licences l
    where l.user_id = auth.uid() and l.starts_at <= now() and (l.ends_at is null or l.ends_at > now())
  );
$$;

-- Everything stored about the learner, as one JSON document (the "export my data" button).
create function public.export_my_data() returns jsonb
language sql stable security invoker set search_path = '' as $$
  select jsonb_build_object(
    'profile', (select to_jsonb(p) from public.profiles p where p.id = auth.uid()),
    'scores', coalesce((select jsonb_agg(to_jsonb(s) - 'user_id') from public.scores s where s.user_id = auth.uid()), '[]'::jsonb),
    'visited', coalesce((select jsonb_agg(to_jsonb(v) - 'user_id') from public.visited v where v.user_id = auth.uid()), '[]'::jsonb),
    'licences', coalesce((select jsonb_agg(to_jsonb(l) - 'user_id') from public.licences l where l.user_id = auth.uid()), '[]'::jsonb)
  );
$$;

-- Delete the account and everything that belongs to it (the "delete my account" button). Runs as owner because only
-- the owner may delete from auth.users; it deletes exactly the caller's own account and nothing else.
create function public.delete_my_account() returns void
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then raise exception 'not logged in'; end if;
  delete from auth.users where id = auth.uid();
end;
$$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
revoke all on function public.merge_scores(jsonb) from public, anon;
revoke all on function public.merge_visited(jsonb) from public, anon;
grant execute on function public.merge_visited(jsonb) to authenticated;
grant execute on function public.merge_scores(jsonb) to authenticated;
revoke all on function public.export_my_data() from public, anon;
grant execute on function public.export_my_data() to authenticated;
revoke all on function public.has_licence() from public, anon;
grant execute on function public.has_licence() to authenticated;

-- Table rights for signed-in learners (row-level security above still limits them to their own rows). Supabase grants
-- these by default in many projects; stating them makes the migration work where it does not. Nothing for anon.
revoke all on public.profiles, public.scores, public.visited, public.licences from anon;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.scores to authenticated;
grant select, insert, delete on public.visited to authenticated;
grant select on public.licences to authenticated;
