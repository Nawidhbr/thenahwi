-- Checks the accounts migration: profiles made, scores merged (highest wins, bad keys dropped, capped at 10), a learner sees and writes only their own rows, cannot give themselves a licence, and deleting the account removes everything. Expected output: see supabase/README.md.
insert into auth.users (id, email) values ('11111111-1111-1111-1111-111111111111','a@x'), ('22222222-2222-2222-2222-222222222222','b@x');
select 'profiles made', count(*) from public.profiles;
-- the service role adds a licence for A
insert into public.licences (user_id, kind) values ('11111111-1111-1111-1111-111111111111', 'personal');
set role authenticated;
set request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';
select 'merge 1', * from public.merge_scores('{"jins": 7, "kati-2": 9.5, "BAD KEY": 5}'::jsonb) order by key;
select 'merge 2 (lower jins kept higher)', * from public.merge_scores('{"jins": 4, "fasl": 11}'::jsonb) order by key;
select 'visited 1', * from public.merge_visited('["jins", "kati-2", "BAD KEY"]'::jsonb) order by 2;
select 'visited 2 (no duplicates)', * from public.merge_visited('["jins", "fasl"]'::jsonb) order by 2;
select 'visited (not an array)', count(*) from public.merge_visited('{"a": 1}'::jsonb);
select 'A licence', public.has_licence();
select 'export keys', jsonb_object_keys(public.export_my_data());
set request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';
select 'B sees A scores?', count(*) from public.scores;
select 'B sees A visits?', count(*) from public.visited;
select 'B licence', public.has_licence();
do $$ begin insert into public.scores (user_id, key, score) values ('11111111-1111-1111-1111-111111111111','x',5); raise notice 'B wrote A row: SHOULD NOT HAPPEN'; exception when others then raise notice 'B cannot write A rows: %', sqlerrm; end $$;
do $$ begin insert into public.licences (user_id, kind) values ('22222222-2222-2222-2222-222222222222','personal'); raise notice 'B gave itself a licence: SHOULD NOT HAPPEN'; exception when others then raise notice 'B cannot give itself a licence: %', sqlerrm; end $$;
reset role;
set role authenticated; set request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';
select public.delete_my_account();
reset role;
select 'after delete: users', count(*) from auth.users; select 'scores left', count(*) from public.scores; select 'licences left', count(*) from public.licences; select 'profiles left', count(*) from public.profiles;
