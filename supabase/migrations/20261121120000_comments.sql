-- The Nahwi: questions and remarks under every lesson and term (components/LessonComments.astro).
-- Safe to run more than once. Apply in the SQL Editor (supabase/README.md).
--
-- Principles:
-- * Only a signed-in reader writes; a message may be shown without a name ("a learner"), but it is always tied to an
--   account, so that it can be answered, removed and deleted with the account.
-- * Nothing is published by itself: a new message waits until a moderator publishes it (the page /en/moderate/).
-- * Readers see published messages through the view comments_public, which holds no account ids; a writer also sees
--   their own messages, published or not, and may delete them.
--
-- Make yourself a moderator (once, with the address you sign in with):
--   insert into public.moderators (user_id) select id from auth.users where email = 'you@example.org'
--   on conflict do nothing;
-- See what waits (or use /en/moderate/ on the site):
--   select created_at, page, locale, display_name, anonymous, body from public.comments where status = 'pending'
--   order by created_at;

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  -- The lesson, as its address without the language: terms/jins, level-2/kati/3, level-1/primer/2 …
  page text not null check (page ~ '^[a-z0-9][a-z0-9/-]{0,119}$'),
  locale text not null check (locale ~ '^[a-z]{2}$'),
  body text not null check (char_length(btrim(body)) between 2 and 2000),
  display_name text check (char_length(display_name) <= 60),
  anonymous boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'published', 'hidden')),
  reply text check (char_length(reply) <= 2000),
  replied_at timestamptz,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  check (anonymous or char_length(btrim(coalesce(display_name, ''))) > 0)
);
create index if not exists comments_page on public.comments (page, created_at) where status = 'published';
create index if not exists comments_pending on public.comments (created_at) where status = 'pending';
create index if not exists comments_user on public.comments (user_id, created_at);

-- Moderators publish, hide and answer messages. Written only by the owner (SQL Editor).
create table if not exists public.moderators (
  user_id uuid primary key references auth.users (id) on delete cascade,
  added_at timestamptz not null default now()
);

alter table public.comments enable row level security;
alter table public.moderators enable row level security;

create or replace function public.is_moderator() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.moderators m where m.user_id = auth.uid());
$$;
revoke all on function public.is_moderator() from public, anon;
grant execute on function public.is_moderator() to authenticated;

drop policy if exists "own comments: read" on public.comments;
drop policy if exists "own comments: add" on public.comments;
drop policy if exists "own comments: remove" on public.comments;
drop policy if exists "moderators: read" on public.comments;
create policy "own comments: read" on public.comments for select using (auth.uid() = user_id);
-- A new message is always pending and unanswered, whatever the browser sends.
create policy "own comments: add" on public.comments for insert
  with check (auth.uid() = user_id and status = 'pending' and reply is null and replied_at is null and reviewed_at is null);
create policy "own comments: remove" on public.comments for delete using (auth.uid() = user_id);
create policy "moderators: read" on public.comments for select using (public.is_moderator());

-- At most 5 messages an hour and 20 a day per account, and the name trimmed, before a message is stored.
create or replace function public.comments_before_insert() returns trigger
language plpgsql security definer set search_path = '' as $$
declare n_hour int; n_day int;
begin
  select count(*) filter (where created_at > now() - interval '1 hour'), count(*)
    into n_hour, n_day
    from public.comments where user_id = new.user_id and created_at > now() - interval '1 day';
  if n_hour >= 5 or n_day >= 20 then raise exception 'too many messages' using errcode = 'P0001', hint = 'rate'; end if;
  new.body := btrim(new.body);
  new.display_name := case when new.anonymous then null else nullif(btrim(new.display_name), '') end;
  new.created_at := now();
  return new;
end;
$$;
drop trigger if exists comments_before_insert on public.comments;
create trigger comments_before_insert before insert on public.comments
  for each row execute function public.comments_before_insert();

-- What every reader sees: published messages, without account ids, and without the name when it was sent without one.
-- A view runs with its owner's rights, so it shows published rows to readers who cannot read the table itself.
create or replace view public.comments_public as
  select c.id, c.page, c.locale, c.body,
         case when c.anonymous then null else c.display_name end as display_name,
         c.reply, c.replied_at, c.created_at
    from public.comments c
   where c.status = 'published';

-- For moderators: publish, hide or put back to waiting, and answer (an empty answer removes it).
create or replace function public.moderate_comment(comment_id uuid, new_status text default null, new_reply text default null)
returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_moderator() then raise exception 'not a moderator'; end if;
  if new_status is not null and new_status not in ('pending', 'published', 'hidden') then raise exception 'bad status'; end if;
  update public.comments set
    status = coalesce(new_status, status),
    reviewed_at = case when new_status is null then reviewed_at else now() end,
    reply = case when new_reply is null then reply else nullif(btrim(new_reply), '') end,
    replied_at = case when new_reply is null then replied_at when nullif(btrim(new_reply), '') is null then null else now() end
  where id = comment_id;
  if not found then raise exception 'no such message'; end if;
end;
$$;
revoke all on function public.moderate_comment(uuid, text, text) from public, anon;
grant execute on function public.moderate_comment(uuid, text, text) to authenticated;

-- The data export (account page) also gives the reader's messages.
create or replace function public.export_my_data() returns jsonb
language sql stable security invoker set search_path = '' as $$
  select jsonb_build_object(
    'profile', (select to_jsonb(p) from public.profiles p where p.id = auth.uid()),
    'scores', coalesce((select jsonb_agg(to_jsonb(s) - 'user_id') from public.scores s where s.user_id = auth.uid()), '[]'::jsonb),
    'visited', coalesce((select jsonb_agg(to_jsonb(v) - 'user_id') from public.visited v where v.user_id = auth.uid()), '[]'::jsonb),
    'licences', coalesce((select jsonb_agg(to_jsonb(l) - 'user_id') from public.licences l where l.user_id = auth.uid()), '[]'::jsonb),
    'comments', coalesce((select jsonb_agg(to_jsonb(c) - 'user_id' order by c.created_at) from public.comments c where c.user_id = auth.uid()), '[]'::jsonb)
  );
$$;
revoke all on function public.export_my_data() from public, anon;
grant execute on function public.export_my_data() to authenticated;

-- Rights: anon reads the view only; signed-in readers read the view and their own rows, add and delete their own.
revoke all on public.comments, public.moderators from anon, authenticated;
grant select, insert, delete on public.comments to authenticated;
revoke all on public.comments_public from anon, authenticated;
grant select on public.comments_public to anon, authenticated;
