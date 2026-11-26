-- The Nahwi, phase 3: licences come from Paddle (the merchant of record), not Mollie.
-- Apply after 20261108000000_accounts.sql (SQL Editor → paste → Run). Safe to run more than once.
-- provider_id: the Paddle subscription (sub_…) or transaction (txn_…) the licence comes from; written only by the
-- server (api/paddle.js, with the secret key), as before. status: Paddle's status of the subscription.
-- manage_url / update_url: Paddle's links for the learner to cancel or change the payment method (shown on the
-- account page; they are the learner's own and readable only by them, under the row-level security already in place).
do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'licences' and column_name = 'mollie_id') then
    alter table public.licences rename column mollie_id to provider_id;
  end if;
end $$;

alter table public.licences
  add column if not exists status text check (status is null or char_length(status) <= 30),
  add column if not exists price_id text check (price_id is null or char_length(price_id) <= 80),
  add column if not exists manage_url text check (manage_url is null or manage_url ~ '^https://'),
  add column if not exists update_url text check (update_url is null or update_url ~ '^https://'),
  add column if not exists updated_at timestamptz not null default now();

-- The webhook writes a licence per Paddle subscription, so provider_id must be unique (it is, if it came from mollie_id).
do $$
begin
  if not exists (select 1 from pg_indexes where schemaname = 'public' and tablename = 'licences'
                 and indexdef ilike '%unique%(provider_id)%') then
    alter table public.licences add constraint licences_provider_id_key unique (provider_id);
  end if;
end $$;

-- What the table looks like now (for checking by eye in the SQL Editor).
select column_name, data_type from information_schema.columns
where table_schema = 'public' and table_name = 'licences' order by ordinal_position;
