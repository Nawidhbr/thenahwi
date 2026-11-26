-- The Nahwi: access codes, which give full access without paying, to readers the owner chooses (family, friends,
-- a teacher's class). Apply after the two earlier migrations (SQL Editor → paste → Run). Safe to run more than once.
--
-- * A code is kept only as the SHA-256 hash of its letters and digits: the table does not reveal the codes, so keep
--   each code yourself when you make it.
-- * The owner makes a code in the SQL Editor:
--     select public.create_access_code('VRIENDEN-2026', days => 365, max_uses => 10, note => 'family and friends');
--   days: how long the access lasts after redeeming (null: for good); max_uses: how many accounts may redeem it;
--   expires_at: the last moment it can be redeemed (null: no end). A code needs at least 8 letters or digits;
--   case, spaces and dashes do not count ("vrienden 2026" is the same code).
-- * A reader redeems it on the account page, signed in (redeem_code, through the Supabase API). It gives a personal
--   licence (provider_id "code:<code>:<user>", status "code"), once per account, while uses are left and it has not
--   expired. At most 10 tries a day per account, against guessing.
-- * Nobody but the owner reads the codes; a reader can only call redeem_code for themself. Deleting an account
--   deletes its licences and tries (on delete cascade); the code's count of uses stays.
--
-- To see the codes and how often each was used:   select note, days, max_uses, uses, expires_at, active from public.access_codes;
-- To stop a code:                                   update public.access_codes set active = false where note = '…';

create table if not exists public.access_codes (
  id uuid primary key default gen_random_uuid(),
  code_hash text not null unique check (code_hash ~ '^[0-9a-f]{64}$'),
  note text check (note is null or char_length(note) <= 200),
  days int check (days is null or days > 0),
  max_uses int not null default 1 check (max_uses > 0),
  uses int not null default 0 check (uses >= 0),
  expires_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
-- Row-level security without any policy: readers see nothing; only the owner and the functions below reach it.
alter table public.access_codes enable row level security;

create table if not exists public.code_attempts (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null default current_date,
  n int not null default 1,
  primary key (user_id, day)
);
alter table public.code_attempts enable row level security;

-- The form a code is compared in: its letters and digits, upper case.
create or replace function public.code_norm(code text) returns text
language sql immutable set search_path = '' as $$
  select upper(regexp_replace(coalesce(code, ''), '[^A-Za-z0-9]', '', 'g'));
$$;

create or replace function public.code_hash(code text) returns text
language sql immutable set search_path = '' as $$
  select encode(sha256(convert_to(public.code_norm(code), 'UTF8')), 'hex');
$$;

-- Make a code (the owner, in the SQL Editor). Returns its id.
create or replace function public.create_access_code(code text, days int default 365, max_uses int default 1,
  expires_at timestamptz default null, note text default null) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  new_id uuid;
begin
  if char_length(public.code_norm(code)) < 8 then
    raise exception 'a code needs at least 8 letters or digits';
  end if;
  insert into public.access_codes (code_hash, note, days, max_uses, expires_at)
  values (public.code_hash(code), note, days, max_uses, expires_at)
  returning access_codes.id into new_id;
  return new_id;
end;
$$;

-- Redeem a code for the signed-in reader. Returns { ok: true, until } (until null: for good) or
-- { ok: false, reason } with reason one of signed-out, too-many, unknown, expired, used-up, already.
create or replace function public.redeem_code(code text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := auth.uid();
  c public.access_codes;
  tries int;
  until timestamptz;
begin
  if uid is null then
    return jsonb_build_object('ok', false, 'reason', 'signed-out');
  end if;
  delete from public.code_attempts a where a.user_id = uid and a.day < current_date - 7;
  insert into public.code_attempts as a (user_id) values (uid)
    on conflict (user_id, day) do update set n = a.n + 1
    returning a.n into tries;
  if tries > 10 then
    return jsonb_build_object('ok', false, 'reason', 'too-many');
  end if;
  select * into c from public.access_codes x where x.code_hash = public.code_hash(code) for update;
  if not found or not c.active then
    return jsonb_build_object('ok', false, 'reason', 'unknown');
  end if;
  if exists (select 1 from public.licences l where l.provider_id = 'code:' || c.id || ':' || uid) then
    return jsonb_build_object('ok', false, 'reason', 'already');
  end if;
  if c.expires_at is not null and c.expires_at <= now() then
    return jsonb_build_object('ok', false, 'reason', 'expired');
  end if;
  if c.uses >= c.max_uses then
    return jsonb_build_object('ok', false, 'reason', 'used-up');
  end if;
  until := case when c.days is null then null else now() + make_interval(days => c.days) end;
  insert into public.licences (user_id, kind, provider_id, status, starts_at, ends_at)
  values (uid, 'personal', 'code:' || c.id || ':' || uid, 'code', now(), until);
  update public.access_codes set uses = uses + 1 where id = c.id;
  return jsonb_build_object('ok', true, 'until', until);
end;
$$;

revoke all on function public.create_access_code(text, int, int, timestamptz, text) from public, anon, authenticated;
revoke all on function public.redeem_code(text) from public, anon;
grant execute on function public.redeem_code(text) to authenticated;
revoke all on function public.code_hash(text) from public, anon, authenticated;
revoke all on function public.code_norm(text) from public, anon, authenticated;
