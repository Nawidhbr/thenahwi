-- Checks the questions and remarks (20261121120000_comments.sql): a signed-in reader writes a message that waits;
-- nobody else sees it until a moderator publishes it; the public view holds no account ids and no name for a message
-- sent without one; a reader cannot publish, answer or remove another's message; anon reads only what is published;
-- at most 5 messages an hour; deleting an account removes its messages. Run on a fresh database after the mock and the
-- migrations. Expected output: see supabase/README.md.
insert into auth.users (id, email) values
  ('11111111-1111-1111-1111-111111111111','a@x'), ('22222222-2222-2222-2222-222222222222','b@x'), ('99999999-9999-9999-9999-999999999999','mod@x');
insert into public.moderators (user_id) values ('99999999-9999-9999-9999-999999999999');

set role authenticated;
set request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';
insert into public.comments (user_id, page, locale, body, display_name) values
  ('11111111-1111-1111-1111-111111111111', 'terms/jins', 'en', '  Why is animal a genus and not a species?  ', ' Amina ');
insert into public.comments (user_id, page, locale, body, anonymous, display_name) values
  ('11111111-1111-1111-1111-111111111111', 'terms/jins', 'nl', 'Dank, heel helder.', true, 'Amina');
select 'A sees own (2)', count(*), bool_and(status = 'pending') from public.comments;
select 'name trimmed, anonymous has none', array_agg(coalesce(display_name, '-') order by locale) from public.comments;
select 'body trimmed', body from public.comments where locale = 'en';
do $$ begin
  insert into public.comments (user_id, page, locale, body, display_name, status) values ('11111111-1111-1111-1111-111111111111', 'terms/jins', 'en', 'Publish me', 'A', 'published');
  raise notice 'self-published: SHOULD NOT HAPPEN';
exception when others then raise notice 'cannot publish own message: %', sqlerrm; end $$;
do $$ begin
  insert into public.comments (user_id, page, locale, body, display_name) values ('22222222-2222-2222-2222-222222222222', 'terms/jins', 'en', 'As someone else', 'B');
  raise notice 'wrote as another: SHOULD NOT HAPPEN';
exception when others then raise notice 'cannot write as another: %', sqlerrm; end $$;
do $$ begin
  insert into public.comments (user_id, page, locale, body) values ('11111111-1111-1111-1111-111111111111', 'terms/jins', 'en', 'No name, not anonymous');
  raise notice 'nameless: SHOULD NOT HAPPEN';
exception when others then raise notice 'a name or anonymous is needed: %', sqlerrm; end $$;
do $$ begin
  insert into public.comments (user_id, page, locale, body, display_name) values ('11111111-1111-1111-1111-111111111111', '../x', 'en', 'Bad page', 'A');
  raise notice 'bad page: SHOULD NOT HAPPEN';
exception when others then raise notice 'bad page refused: %', sqlerrm; end $$;
do $$ begin
  perform public.moderate_comment((select id from public.comments limit 1), 'published', null);
  raise notice 'reader moderated: SHOULD NOT HAPPEN';
exception when others then raise notice 'reader cannot moderate: %', sqlerrm; end $$;
select 'A public view before review', count(*) from public.comments_public;

set request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';
select 'B sees A rows', count(*) from public.comments;
delete from public.comments;
select 'B deleted nothing of A', (select count(*) from public.comments_public);

set request.jwt.claim.sub = '99999999-9999-9999-9999-999999999999';
select 'mod sees pending', count(*) from public.comments where status = 'pending';
select public.moderate_comment(id, 'published', case when locale = 'en' then 'Because it is said of things that differ in kind.' end) from public.comments;
select 'published by the moderator', count(*) from public.comments where status = 'published';

reset role;
set role anon;
select 'anon sees published', count(*) from public.comments_public where page = 'terms/jins';
select 'anon: names', array_agg(coalesce(display_name, '(a learner)') order by locale) from public.comments_public;
select 'anon: answer', reply is not null and replied_at is not null from public.comments_public where locale = 'en';
select 'view has no user_id', count(*) from information_schema.columns where table_name = 'comments_public' and column_name = 'user_id';
do $$ declare n int; begin select count(*) into n from public.comments; raise notice 'anon read the table: % rows', n; exception when others then raise notice 'anon cannot read the table: %', sqlerrm; end $$;
do $$ begin
  insert into public.comments (user_id, page, locale, body, display_name) values ('11111111-1111-1111-1111-111111111111', 'terms/jins', 'en', 'anon writes', 'X');
  raise notice 'anon wrote: SHOULD NOT HAPPEN';
exception when others then raise notice 'anon cannot write: %', sqlerrm; end $$;

reset role;
set role authenticated;
set request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';
do $$ declare i int; begin
  for i in 1..5 loop
    insert into public.comments (user_id, page, locale, body, display_name) values ('22222222-2222-2222-2222-222222222222', 'terms/fasl', 'en', 'Message ' || i, 'B');
  end loop;
end $$;
do $$ begin
  insert into public.comments (user_id, page, locale, body, display_name) values ('22222222-2222-2222-2222-222222222222', 'terms/fasl', 'en', 'Message 6', 'B');
  raise notice 'six in an hour: SHOULD NOT HAPPEN';
exception when others then raise notice 'sixth in an hour refused: %', sqlerrm; end $$;
select 'B after the limit', count(*) from public.comments;

set request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';
select 'A export has messages', jsonb_array_length(public.export_my_data()->'comments');
delete from public.comments where locale = 'nl';
select 'A removed own', count(*) from public.comments_public;

reset role;
delete from auth.users where id = '11111111-1111-1111-1111-111111111111';
select 'after deleting A', count(*) from public.comments where user_id = '11111111-1111-1111-1111-111111111111';
