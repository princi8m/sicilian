# Design Brief — Berlin Indie Film Festival

## Aesthetic
Light Bauhaus — ink on paper. White/cream base, black structure, single red accent.
Heavy geometric grotesque type, ALL CAPS. Visible grid lines. Zero ornament.

## Palette (light Bauhaus)
- Background:        #f5f3ee   (warm off-white / paper)
- Surface/panels:    #ffffff
- Grid lines/rules:  #161616   (1px near-black, always visible — structure should show)
- Text primary:      #141414
- Text muted:        #73726c
- Accent (red):      #8a1f2b   — functional blocks ONLY: submit panel, 01/02/03 numerals,
                                "Next Event" tag, hover/active states, category labels,
                                deadline badges. NEVER large red washes.

## Typography
- Display / nav / labels: Archivo 800 — UPPERCASE, tight tracking everywhere.
- Body / UI: Archivo 400 — same family, regular weight.
- No serif. No mixed families.

## Bauhaus Rules (apply everywhere)
- Hard 90° corners — NO rounded-* classes anywhere.
- No shadows, no gradients, no glow — flat fills only.
- Visible 1px #161616 rules separating sections, rows, cards.
- All elements squared and grid-aligned.

## Photography
- Event photos and header image: grayscale + high contrast (contrast-125 grayscale).
  On a light base, low-contrast photos look washed out — boost contrast.
- Featured-film posters: vertical 2:3, object-contain (whole poster, uncropped),
  #ffffff card with 1px #161616 border, rendered grayscale.

## Home Page Structure
1. Header: uppercase wordmark left, uppercase nav right, 1px bottom rule.
2. Hero grid: stacked uppercase festival name (left 3fr); red submit block + B&W photo (right 2fr).
3. Numbered entry points: 01 Submissions · 02 Dates & Deadlines · 03 Winners,
   large red numerals, rows separated by 1px rules.
4. Featured films poster strip — slow CSS auto-scroll, seamless loop, pauses on hover.
5. Next Event bar: red tag + title + date + venue.

## Layout conventions
- max-width 1100px, centered, 1.25rem side padding.
- Section eyebrows: text-xs font-black tracking-[0.2em] uppercase text-text-muted.
- Primary CTAs: border on accent bg (white border on red), or border-only on light bg.
- Thin rules in #161616 (border-rule token). No opacity-based borders.
