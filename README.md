# Berlin Indie Film Festival

Admin-driven festival website. Next.js (App Router) + Prisma + MySQL.
Clone this codebase per festival and re-skin via Tailwind for "minor design changes".

## What's included (runnable v1)

**Public site** (all reading live from the database):
- Home — header image + logo overlay, featured-films carousel, announcement/text/image blocks, event-photo strip, shop teaser ("payments coming soon")
- Winners — index by year, detail page per month/year edition + optional season gallery
- Photos, Reviews (+ detail), Dates (events & deadlines), Shop (catalogue, payment disabled), Contact (form saves to DB)

**Admin** (`/admin`, cookie-session auth):
- Login / logout, dashboard with counts
- **Editions & Winners — fully built** (create/edit editions, add/remove winners, add/remove season images). This is the reference pattern.

## Setup

1. `npm install`
2. Copy env and fill it in:
   ```
   cp .env.example .env
   ```
   Set `DATABASE_URL` (your MySQL connection) and a long random `SESSION_SECRET`.
3. Create the schema and seed sample data:
   ```
   npx prisma migrate dev --name init
   npm run db:seed
   ```
4. Run it:
   ```
   npm run dev
   ```
   Public site: http://localhost:3000 — Admin: http://localhost:3000/admin
   Default login is whatever you set as `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`.

> Never commit `.env`.

## Architecture notes

- **Route groups:** `app/(site)/` carries the public header/footer; `app/admin/(panel)/` carries the admin chrome; `app/admin/login` is a bare screen. The root `app/layout.tsx` only sets up `<html>/<body>`.
- **Auth:** signed-JWT session cookie (`jose`), bcrypt password (`bcryptjs`). `middleware.ts` guards `/admin`. Password checks run in server actions (Node), token checks run in middleware (edge-safe).
- **Money** is stored as integer cents.
- **Images** are stored as paths/URLs. v1 admin forms take an image URL; wiring real file uploads to `/public/uploads` is a listed next step.
- Pages use `export const dynamic = "force-dynamic"` so admin edits show immediately.

## Build out the remaining admin sections

Each remaining model is simpler than Editions/Winners (no nesting). Copy that pattern:
1. `actions.ts` with `create / update / delete` server actions (`revalidatePath` after writes).
2. A list page + a new/edit page with `<form action={...}>`.
3. Add the link to `app/admin/(panel)/layout.tsx`.

Models to expose: `FeaturedFilm`, `HomeBlock`, `EventPhoto` (with the `featuredOnHome` flag), `FilmReview`, `EventDate`, `Product`, `SiteSetting` (header image / logo / contact), `ContactMessage` (inbox), plus `Order` in Phase 2.

## Phase 2 — PayPal

`Order` / `OrderItem` tables already exist. When ready: add a cart + checkout, create a PayPal order server-side, capture on approval, write the `Order` with `status = PAID`, and add an Orders list to the admin. The shop currently shows a "payments coming soon" notice.
