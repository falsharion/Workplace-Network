-- -- ============================================================
-- -- Workplace Network — Supabase Migration
-- -- Run this in Supabase SQL Editor or via `supabase db push`
-- -- ============================================================

-- -- Enable UUID generation
-- create extension if not exists "pgcrypto";

-- -- ─────────────────────────────────────────
-- -- EVENTS
-- -- ─────────────────────────────────────────
-- create table if not exists events (
--   id                uuid primary key default gen_random_uuid(),
--   name              text not null,
--   description       text,
--   scripture_reference text,
--   flyer_url         text,
--   start_at          timestamptz not null,
--   location          text,
--   is_virtual        boolean default true,
--   is_featured       boolean default false,
--   created_at        timestamptz default now()
-- );

-- -- At most one featured event at any time
-- create unique index if not exists one_featured_event
--   on events (is_featured)
--   where is_featured = true;

-- -- ─────────────────────────────────────────
-- -- REGISTRATIONS
-- -- ─────────────────────────────────────────
-- create table if not exists registrations (
--   id          uuid primary key default gen_random_uuid(),
--   event_id    uuid references events(id) on delete cascade,
--   first_name  text not null,
--   last_name   text not null,
--   email       text not null,
--   created_at  timestamptz default now(),
--   -- Postgres-level uniqueness (race-condition safe)
--   unique (event_id, email)
-- );

-- -- ─────────────────────────────────────────
-- -- MENTORS
-- -- ─────────────────────────────────────────
-- create table if not exists mentors (
--   id          uuid primary key default gen_random_uuid(),
--   name        text not null,
--   title       text,
--   photo_url   text,
--   profile_url text
-- );

-- -- ─────────────────────────────────────────
-- -- MEMBER STORIES
-- -- ─────────────────────────────────────────
-- create table if not exists member_stories (
--   id        uuid primary key default gen_random_uuid(),
--   name      text not null,
--   role      text,
--   quote     text,
--   photo_url text,
--   video_url text
-- );

-- -- ─────────────────────────────────────────
-- -- GROUPS
-- -- ─────────────────────────────────────────
-- create table if not exists groups (
--   id           uuid primary key default gen_random_uuid(),
--   name         text not null,
--   description  text,
--   photo_url    text,
--   member_count integer default 0
-- );

-- -- ─────────────────────────────────────────
-- -- ARTICLES
-- -- ─────────────────────────────────────────
-- create table if not exists articles (
--   id               uuid primary key default gen_random_uuid(),
--   title            text not null,
--   author           text,
--   author_avatar_url text,
--   published_at     date,
--   slug             text unique
-- );

-- -- ─────────────────────────────────────────
-- -- ROW LEVEL SECURITY
-- -- ─────────────────────────────────────────

-- -- Enable RLS on all tables
-- alter table events          enable row level security;
-- alter table registrations   enable row level security;
-- alter table mentors         enable row level security;
-- alter table member_stories  enable row level security;
-- alter table groups          enable row level security;
-- alter table articles        enable row level security;

-- -- Public SELECT on read-only tables
-- create policy "Public can read events"
--   on events for select using (true);

-- create policy "Public can read mentors"
--   on mentors for select using (true);

-- create policy "Public can read member_stories"
--   on member_stories for select using (true);

-- create policy "Public can read groups"
--   on groups for select using (true);

-- create policy "Public can read articles"
--   on articles for select using (true);

-- -- Registrations: no public access — server-side service role only
-- -- (The Next.js API route uses SUPABASE_SERVICE_ROLE_KEY which bypasses RLS)
-- -- No public policies needed for registrations.

-- -- ─────────────────────────────────────────
-- -- SEED DATA (optional, for development)
-- -- ─────────────────────────────────────────

-- -- Featured event
-- insert into events (name, description, scripture_reference, start_at, is_virtual, is_featured)
-- values (
--   'Your Good Works — A Career & Work Conference',
--   'Career and business professionals seeking to make impact',
--   'Matthew 5:16',
--   now() + interval '4 days',
--   true,
--   true
-- ) on conflict do nothing;

-- -- Curated events
-- insert into events (name, description, scripture_reference, start_at, is_virtual, is_featured)
-- values
--   ('Your Good Works', 'A Career & Work Conference', 'Matthew 5:16', now() + interval '7 days',  true,  false),
--   ('Your Good Works', 'A Career & Work Conference', 'Matthew 5:16', now() + interval '14 days', false, false),
--   ('Your Good Works', 'A Career & Work Conference', 'Matthew 5:16', now() - interval '7 days',  false, false)
-- on conflict do nothing;

-- -- Mentors
-- insert into mentors (name, title) values
--   ('James Mohammed', 'CEO @ Homes Field'),
--   ('Sarah Johnson',  'CTO @ TechVenture'),
--   ('David Okafor',   'VP @ Global Corp'),
--   ('Grace Adeyemi',  'Founder @ ImpactHub')
-- on conflict do nothing;

-- -- Groups
-- insert into groups (name, description, member_count) values
--   ('Faith & Career', 'This group brings together members seeking meaningful conversations, personal growth within a supportive community.', 24),
--   ('Entrepreneurs Circle', 'Connect with members who are passionate about expanding their network, collaborating, and connecting with like-minded professionals.', 18),
--   ('Leadership Guild', 'This group is about members passionate about leadership development, supporting one another through shared experiences and growth.', 31),
--   ('Tech Professionals', 'Here, members are interested in discovering opportunities, collaborating on projects, and growing together within the community.', 15)
-- on conflict do nothing;

-- -- Articles
-- insert into articles (title, author, published_at, slug) values
--   ('The power of mentorship for Christian professionals. Why mentorship matters.', 'Jerry Akons', '2025-02-09', 'power-of-mentorship'),
--   ('Practical ways Christian professionals can live out their faith in the workplace.', 'Olajumoke Akin', '2025-01-11', 'faith-in-workplace'),
--   ('How Modern Products Teams Are Using AI Tools at Work', 'Sharon West', '2025-03-11', 'ai-tools-at-work')
-- on conflict do nothing;

-- -- Member stories
-- insert into member_stories (name, role, quote) values
--   ('Jane Chris', 'HR @ ABC Enterprise', 'This community helped me grow professionally while staying grounded in my faith and values.'),
--   ('Mark Adebayo', 'Engineer @ Tech Co', 'The mentoring sessions transformed how I approach my work. I finally feel aligned with my purpose.'),
--   ('Priya Nair', 'Manager @ FinServ', 'Workplace Network connected me with mentors who helped me navigate a career transition with confidence.'),
--   ('Tom Osei', 'Consultant @ Acme', 'The community events gave me access to leaders I never would have met otherwise.')
-- on conflict do nothing;
