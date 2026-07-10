# Berlin Indie Film Festival — Claude Context

## Stack
- **Next.js 14.2.35** App Router (RSC + Server Actions), TypeScript
- **Prisma 5.22 + MySQL** on Hostinger (`srv1959.hstgr.io:3306`)
- **Tailwind CSS v3** with custom semantic tokens
- **Cloudinary** for all image storage
- **Nodemailer + Hostinger SMTP** (`smtp.hostinger.com:587`) for email

## Critical DB rule
Always `prisma db push` — NEVER `prisma migrate dev`. Hostinger blocks shadow DB creation.

## Design system — Dark Bauhaus
| Token | Value | Role |
|---|---|---|
| `bg` | `#0b0b0b` | Page background |
| `surface` | `#161616` | Raised panels |
| `rule` | `#2a2a2a` | 1px structural dividers |
| `accent` | `#c8102e` | Red — CTAs, labels |
| `star` | `#f5c518` | Gold — timeline, IMDb |
| `text-muted` | `#6b6865` | Secondary text |

Rules: hard 90° corners only, no shadows, no gradients (except social brand tiles), 1px `border-rule` between every section. Font: Archivo Black, uppercase, tight tracking. `gap-px bg-rule` grid for 1px separators between cells.

## Key patterns
- **Blurred backdrop poster**: two stacked `<img>` — absolute blurred + relative contained — for 537×800 posters
- **Email anti-spam**: HTML entities `&#64;` for @, `&#46;` for . plus split `href` string
- **Pagination**: server-side via `?page=N` URL params
- **Client components**: only when needed (SiteHeader for hamburger, CookieBanner, ReviewRequestModal)
- **Images**: plain `<img>` tags (not `next/image`) with `eslint-disable-next-line @next/next/no-img-element`

## Public pages
| Route | Notes |
|---|---|
| `/` | Home — hero, submit+entries, mission+categories, credentials+socials, carousel, film reviews strip, next deadline, featured photos, FilmFreeway CTA, Babylon strip, rules teaser, testimonials, contact bar |
| `/submissions` | FilmFreeway CTA, 5-step process, screenings/awards info, full rules grid |
| `/winners` | Year accordion (`?open=YEAR`), per-edition posters |
| `/winners/[year]/[month]` | Two-col hero, winner table, poster grid |
| `/dates` | Deadlines (red) + Events (gold) tables |
| `/reviews` | Poster grid, blurred backdrop, 20/page pagination, ReviewRequestModal |
| `/reviews/[slug]` | Poster+stills left, review text right |
| `/events` | Babylon cinema — text hero, exterior+description, photo gallery sections |
| `/photos` | Cloudinary photo grid |
| `/shop` | Static — 3 items, no prices, enquire → /contact |
| `/contact` | Camera hero, socials bar, topics grid, email display |
| `/impressum` | Legal info — Cineberg, Pappelallee 32, 12157 Berlin |

## Admin pages
| Route | Notes |
|---|---|
| `/admin` | Dashboard with cards |
| `/admin/editions` | Editions + winners, CSV import, Cloudinary poster upload, carousel toggle |
| `/admin/dates` | CRUD for EventDate |
| `/admin/reviews` | CRUD for FilmReview + ReviewImage |
| `/admin/photos` | Cloudinary upload, reorder, featured-on-home toggle |
| `/admin/testimonials` | CRUD |
| `/admin/settings` | Notification email → `SiteSetting` key `notification_email` |

Admin nav: Dashboard · Editions & winners · Dates · Film Reviews · Photos · Settings
(Carousel and Testimonials in dashboard cards only)

## Email
`lib/email.ts` — lazy-initialises transporter inside function, silently skips if `SMTP_USER`/`SMTP_PASS` missing. Notification address read from `SiteSetting.notification_email`, falls back to `info@berlinindiefilmfestival.com`.

## Static assets (public/uploads/)
Gitignored by default; whitelisted individually in `.gitignore`:
`logo4-1000.jpg`, `logo-mark.png`, `biff-cover2b/c/3.jpg`, `dates-photo.jpg`, `camera-bw.jpg`, `cameraman.jpg`, `babylon/` (folder)

## Festival config
All festival-specific values (name, URLs, social links, legal, Cloudinary folders, colors) are in `lib/festival.ts`. That is the single file to change when cloning for a new festival.

## External URLs
- FilmFreeway submit: `https://filmfreeway.com/festivals/56006?utm_campaign=Berlin+Indie+Film+Festival&utm_medium=External&utm_source=Submission+Button`
- FilmFreeway profile: `https://filmfreeway.com/BerlinIndieFilmFestival`
- IMDb: `https://www.imdb.com/event/ev0025481/2021/1`
- Instagram: https://instagram.com/berlinindiefilmfestival
- Facebook: https://www.facebook.com/Berlin-Indie-Film-Festival-100152391903236

## Cloudinary folders
`biff/photos` · `biff/posters` · `biff/reviews/covers` · `biff/reviews/images`

## Components
- `SiteHeader` — sticky nav, logo-mark left, hamburger mobile
- `SiteFooter` — copyright, social icons, Contact / Impressum / Admin links
- `SocialLinks` — reusable; `variant="icon"` (footer) or `variant="button"` (contact page)
- `CookieBanner` — GDPR, localStorage `biff_cookie_consent`, fixed bottom
- `FeaturedCarousel` — CSS animation, no RAF/scrollLeft (iOS blocks programmatic scrollLeft)
- `ReviewRequestModal` — client, shows email address (form disabled pending TitanMail)
- `TestimonialsSection` — featured testimonials from DB

## Pending
- Contact/review request forms: disabled, showing email address only. Re-enable once Hostinger TitanMail is confirmed working and SMTP tested end-to-end.
