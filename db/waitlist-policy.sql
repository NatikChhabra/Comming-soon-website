-- Numen waitlist — signup path and row-level security
--
-- WHY THIS FILE EXISTS
--
-- On 2026-08-19 the waitlist was silently capturing nothing. RLS was enabled on
-- waitlist_signups with no policy that let the anon role insert, so every signup
-- came back as:
--
--     42501: new row violates row-level security policy for table "waitlist_signups"
--
-- and the form printed that Postgres error under the button. The Netlify Forms
-- mirror that was supposed to be the backup did nothing either, because the site
-- is served by GitHub Pages. Both capture paths were dead.
--
-- Run this in the Supabase SQL editor:
--   https://supabase.com/dashboard/project/pczugsxwaprjpdzcuhkn/sql
--
-- What stays true afterwards: nobody holding the public anon key can read, edit
-- or delete a single email address. They can only add one, through this function.


-- 1. RLS on, and no direct table access for anon.
--    Reading, updating and deleting stay closed. This is already the case; the
--    statements are here so the file describes the whole intended end state.

alter table public.waitlist_signups enable row level security;

drop policy if exists "anon can insert" on public.waitlist_signups;
drop policy if exists "anon insert only" on public.waitlist_signups;


-- 2. The one way in.
--
--    SECURITY DEFINER means this runs as the owner, so the table itself needs no
--    anon INSERT grant. Validation and normalisation happen server-side, where a
--    caller cannot skip them. Duplicates are silently accepted, so someone who
--    signs up twice sees success rather than an error — and cannot use the error
--    to probe whether an address is already on the list.

create or replace function public.join_waitlist(
  p_email    text,
  p_referrer text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(trim(p_email));
begin
  if v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'invalid email' using errcode = '22023';
  end if;

  if length(v_email) > 254 then
    raise exception 'email too long' using errcode = '22023';
  end if;

  insert into public.waitlist_signups (email, referrer)
  values (v_email, left(coalesce(p_referrer, ''), 500))
  on conflict (email) do nothing;
end;
$$;

revoke all on function public.join_waitlist(text, text) from public;
grant execute on function public.join_waitlist(text, text) to anon, authenticated;


-- 3. The count the landing page already reads.
--    Same reasoning: exposes a single integer, never the rows behind it.

create or replace function public.get_waitlist_count()
returns integer
language sql
security definer
set search_path = public
stable
as $$
  select count(*)::int from public.waitlist_signups;
$$;

revoke all on function public.get_waitlist_count() from public;
grant execute on function public.get_waitlist_count() to anon, authenticated;


-- 4. Verify. Run these after the statements above.
--
--    select public.join_waitlist('probe@example.com', 'sql-editor');
--    select public.get_waitlist_count();          -- should have gone up by one
--    delete from public.waitlist_signups where email = 'probe@example.com';
--
--    Then confirm from outside, with the public anon key, that the table itself
--    is still sealed — each of these must return no rows:
--
--    curl "$URL/rest/v1/waitlist_signups?select=*" -H "apikey: $ANON"
--    curl -X DELETE "$URL/rest/v1/waitlist_signups?id=gt.0" -H "apikey: $ANON"
