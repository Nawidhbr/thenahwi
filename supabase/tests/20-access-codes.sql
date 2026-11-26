-- Checks the access codes (20261115120000_access_codes.sql): the owner makes codes; a reader redeems one once, while
-- uses are left and it has not expired; at most 10 tries a day; readers cannot see the codes or make one; anon cannot
-- redeem. Run on a fresh database after the mock and the three migrations. Expected output: see supabase/README.md.
insert into auth.users (id, email) values
  ('11111111-1111-1111-1111-111111111111','a@x'), ('22222222-2222-2222-2222-222222222222','b@x'), ('33333333-3333-3333-3333-333333333333','c@x');
select 'made', public.create_access_code('Friends-2026', days => 30, max_uses => 2, note => 'friends') is not null;
select 'made for good', public.create_access_code('FOREVER CODE 1', days => null, note => 'for good') is not null;
select 'made expired', public.create_access_code('OLDCODE-2020', expires_at => now() - interval '1 day', note => 'old') is not null;
do $$ begin perform public.create_access_code('SHORT1'); raise notice 'short code made: SHOULD NOT HAPPEN'; exception when others then raise notice 'short code refused: %', sqlerrm; end $$;
select 'stored as hashes only', count(*) from public.access_codes where code_hash ~ '^[0-9a-f]{64}$';

set role authenticated;
set request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';
select 'A redeems (any case, spaces, dashes)', (r->>'ok')::boolean, (r->>'until')::timestamptz between now() + interval '29 days' and now() + interval '31 days' from (select public.redeem_code('friends 2026') r) x;
select 'A again', public.redeem_code('FRIENDS2026')->>'reason';
select 'A unknown', public.redeem_code('NOT-A-CODE-9')->>'reason';
select 'A expired', public.redeem_code('oldcode-2020')->>'reason';
select 'A has a licence', public.has_licence();
select 'A redeems for good', (public.redeem_code('forever-code-1')->>'until') is null;
select 'A licence rows', count(*) from public.licences;
select 'A export has licences', jsonb_array_length(public.export_my_data()->'licences');
do $$ declare n int; begin select count(*) into n from public.access_codes; raise notice 'A sees % codes', n; exception when others then raise notice 'A cannot read the codes: %', sqlerrm; end $$;
do $$ begin perform public.create_access_code('READER-MADE-1'); raise notice 'reader made a code: SHOULD NOT HAPPEN'; exception when others then raise notice 'reader cannot make a code: %', sqlerrm; end $$;

set request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';
select 'B redeems the second use', public.redeem_code('FRIENDS-2026')->>'ok';
select 'B sees A licences?', count(*) from public.licences where user_id <> '22222222-2222-2222-2222-222222222222';

set request.jwt.claim.sub = '33333333-3333-3333-3333-333333333333';
select 'C finds it used up', public.redeem_code('FRIENDS-2026')->>'reason';
select 'C try', k, public.redeem_code('GUESS-' || k)->>'reason' from generate_series(2, 11) k;
select 'C after 10 tries, even a good code', public.redeem_code('FOREVER-CODE-1')->>'reason';
select 'C has no licence', public.has_licence();
reset role;

set role anon;
do $$ begin perform public.redeem_code('FOREVER-CODE-1'); raise notice 'anon redeemed: SHOULD NOT HAPPEN'; exception when others then raise notice 'anon cannot redeem: %', sqlerrm; end $$;
reset role;

select 'uses', note, uses, max_uses from public.access_codes order by note;
set role authenticated; set request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';
select public.delete_my_account();
reset role;
select 'after A deleted: licences', count(*) from public.licences;
select 'after A deleted: tries', count(*) from public.code_attempts;
select 'after A deleted: uses kept', uses from public.access_codes where note = 'friends';
