# Workplace Network — Landing Page

A fully responsive marketing landing page for **Workplace Network**, a faith-based mentoring and networking platform for Christian career professionals.

## Tech Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** with custom design tokens
- **Supabase** (Postgres + RLS) for data storage
- **Resend** for transactional confirmation emails
- **Zod** for shared client/server form validation
- **Vercel** for deployment

---

## Getting Started

### 1. Clone & Install

```bash
git clone <repo-url>
cd workplace-network
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API (secret) |
| `RESEND_API_KEY` | [resend.com](https://resend.com) → API Keys |
| `RESEND_FROM_EMAIL` | A verified sender domain in Resend |

> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS — never expose it in the browser. It is only used in server-side API routes.

### 3. Run Supabase Migration

In the **Supabase SQL Editor** (or via Supabase CLI), run:

```sql
-- Paste the contents of:
supabase/migrations/001_initial_schema.sql
```

This creates all tables, indexes, RLS policies, and optional seed data.

#### Via Supabase CLI

```bash
npx supabase login
npx supabase link --project-ref your-project-ref
npx supabase db push
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add all environment variables from `.env.example` in the Vercel dashboard
4. Deploy — Vercel auto-detects Next.js

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout + fonts + metadata
│   ├── page.tsx            # Home page (server component, fetches all data)
│   ├── globals.css         # Tailwind + custom CSS
│   └── api/
│       └── register/
│           └── route.ts    # Registration API (POST) with rate limiting
├── components/
│   ├── Navbar.tsx          # Sticky nav + mobile hamburger
│   ├── Footer.tsx          # Footer with social links
│   ├── Countdown.tsx       # Live countdown timer (client component)
│   ├── RegistrationForm.tsx # Self-contained form with all states
│   └── sections/
│       ├── Hero.tsx
│       ├── AboutUs.tsx
│       ├── MeetOurMentors.tsx
│       ├── FeaturesBanner.tsx
│       ├── CommunityGroups.tsx
│       ├── WhyWorkplaceNetwork.tsx
│       ├── FeaturedEvent.tsx   # ← owns countdown + form
│       ├── CuratedEvents.tsx   # ← separate, no form/countdown
│       ├── TestimonialCarousel.tsx
│       ├── MemberStories.tsx
│       ├── JoinCTA.tsx
│       ├── FAQ.tsx
│       └── LatestArticles.tsx
├── lib/
│   ├── supabase.ts         # Public + admin Supabase clients
│   ├── schemas.ts          # Zod validation schemas (shared client/server)
│   └── fallback-data.ts    # Static fallbacks used during build/preview
└── types/
    └── database.ts         # Supabase table types
supabase/
└── migrations/
    └── 001_initial_schema.sql
```

---

## Key Features

### Registration Flow
1. User fills out the form in the **Featured Event** section
2. Client-side Zod validation runs first
3. `POST /api/register` is called with rate limiting per IP
4. Server checks for duplicate email (application-level + Postgres unique constraint)
5. Row is inserted into `registrations` table using the service role key
6. Resend sends a confirmation email (non-blocking — won't fail the response)
7. Form switches to a success state inline

### Changing the Featured Event
Update the `is_featured` flag in Supabase Studio:
```sql
-- Unfeature the old event
update events set is_featured = false where is_featured = true;
-- Feature the new event
update events set is_featured = true where id = 'your-new-event-id';
```
No code change or redeployment needed.

### Countdown Auto-Disable
When the countdown hits zero, the registration form automatically disables itself via the `onExpire` callback — no admin action needed.

### Performance
- Content sections use ISR (`revalidate = 300`) — rebuilt every 5 minutes
- Heavy client components (countdown, form, carousel, accordion) are code-split
- All images use lazy loading except the hero's first image
- Horizontal carousels use CSS scroll-snap for smooth mobile UX
- Supabase writes go through a server Route Handler — never client-side

---

## Adding Real Images

Replace placeholder Unsplash URLs with your own assets:

1. Upload images to Supabase Storage (create a public bucket called `assets`)
2. Update `photo_url` / `flyer_url` columns in the relevant tables via Supabase Studio
3. The page will pick them up on the next ISR revalidation (or `npm run build`)

For local development, you can also put images in `/public/images/` and reference them as `/images/filename.jpg`.

---

## Customisation

| What | Where |
|---|---|
| Colours / design tokens | `tailwind.config.ts` |
| FAQ questions | `src/lib/fallback-data.ts` → `FAQ_ITEMS` |
| Reasons to join | `src/components/sections/FeaturedEvent.tsx` → `REASONS_TO_JOIN` |
| Testimonial quotes | `src/components/sections/TestimonialCarousel.tsx` |
| Nav links | `src/components/Navbar.tsx` → `NAV_LINKS` |
| Hero images | `src/components/sections/Hero.tsx` → `HERO_IMAGES` |
