# Braidel Design System

Braidel is a two-sided **workforce + booking marketplace built exclusively for the hair braiding industry**. It connects three user types:

- **Salon Owners** — post staffing opportunities, review applicants, hire skilled braiders.
- **Braiders** — build a portfolio, find work near them, apply to opportunities, take client bookings.
- **Clients** — discover braiders/salons and book braiding services.

Surfaces: a **Next.js web app** today, with a **future mobile app**. The brand is rooted in Black and African hair‑braiding culture and must feel **elevated, warm, and trustworthy — never generic**.

> **Brand essence:** warm neutrals (creams, warm browns, deep charcoal) + a confident **terracotta** primary and **deep gold** secondary; clean humanist sans typography; soft, card‑based, mobile‑aware layouts.

---

## Sources & provenance

This system was authored **from the written brand brief** (company description + art direction) — there was **no existing codebase, Figma file, or brand kit** supplied. Everything here (palette, type pairing, logo mark, components) is an **original interpretation** of the brief, intended as a starting point to validate before deep build.

If/when canonical sources arrive (production repo, Figma, licensed fonts, real photography), reconcile this system against them — see **Caveats** at the bottom.

---

## Index — what's in this project

| Path | What it is |
|---|---|
| `styles.css` | Global entry point — `@import`s every token + font file. Consumers link this one file. |
| `tokens/fonts.css` | Webfont loading (Google Fonts substitutes — see Caveats). |
| `tokens/colors.css` | Color ramps + semantic aliases. |
| `tokens/typography.css` | Families, weights, size scale, leading, tracking. |
| `tokens/spacing.css` | 4px spacing scale, containers, control heights. |
| `tokens/effects.css` | Radii, shadows, motion (easing + durations). |
| `components/forms/` | `Button`, `Input`, `Select`, `Checkbox`, `Switch`. |
| `components/display/` | `Card` (+ `CardMedia`/`CardBody`), `Badge`, `Tag`, `Avatar` (+ `AvatarGroup`), `Rating`. |
| `components/navigation/` | `Tabs`. |
| `components/feedback/` | `Alert`. |
| `ui_kits/marketing/` | Public site recreation (landing, find braiders, braider profile). |
| `ui_kits/app/` | Authenticated product (salon dashboard, braider dashboard, messaging). |
| `guidelines/*.card.html` | Foundation specimen cards shown in the Design System tab. |
| `assets/` | Logo mark + brand assets. |
| `SKILL.md` | Portable Agent Skill wrapper. |

Every reusable component has a sibling `.d.ts` (props), `.prompt.md` (usage), and a directory `*.card.html` (live demo).

---

## CONTENT FUNDAMENTALS — how Braidel writes

**Voice:** warm, direct, and respectful — like a trusted peer in the industry, not a corporate platform. Confident about craft; never slangy-for-the-sake-of-it, never stiff.

- **Person:** speak to the user as **"you"**; the brand is **"we"** sparingly. Address each role in *their* language ("find work near you" for braiders; "post an opportunity" for salons; "book your style" for clients).
- **Casing:** **Sentence case everywhere** — buttons, headings, nav, labels. Never Title Case UI, never ALL CAPS except the mono eyebrow label.
- **Tone:** plain and human. "Find skilled braiders," "Post an opportunity," "You're 2 steps from going live." Verbs lead actions.
- **Length:** short. Headlines ≤ 6 words. Button labels 1–3 words and specific ("Apply now," "Post a job," "Message," not "Submit"/"Click here").
- **Numbers & data:** concrete and tabular — "4.9 ★ · 128 reviews," "$160–$320," "2.3 mi." Set in mono with tabular figures.
- **Craft vocabulary:** use real braiding terms with respect and correct spelling — *knotless braids, box braids, cornrows, locs, faux locs, Senegalese twists, feed‑in braids, stitch braids*. These power filters and specialties.
- **Emoji:** **not used** in product UI. Status is communicated with badges, dots, and color — never emoji.
- **Inclusivity:** centered on Black hair culture; imagery and copy celebrate the craft and the professionals. Avoid exoticizing language.

**Example microcopy**
- Empty state: *"No opportunities here yet — widen your search radius or check back soon."*
- Success: *"Application sent. The salon can message you directly."*
- CTA pair: *"Find braiders" / "I'm a braider"*

---

## VISUAL FOUNDATIONS

**Overall feel.** Warm, editorial, tactile. Cream canvas, generous whitespace, soft cards that feel like swatches of fabric. Terracotta is the single hero color; gold is a supporting jewel tone (ratings, "top rated"). Deep charcoal grounds the page and powers dark feature panels.

**Color.**
- **Page** is warm cream (`--bg-page` = `cream-50`), **not** white. Cards sit on **warm white** (`--surface-card`).
- **Brand** terracotta `#C75D3F` for primary actions; **secondary** gold `#C2922F` used sparingly. Status hues (sage/clay/teal) are reserved for system feedback only.
- **Text** is warm charcoal, never pure black; muted text is warm brown, not gray.
- Imagery skews **warm** — golden, natural light, rich skin tones, real braiding work. No cool/blue filters, no heavy B&W. A faint film grain is acceptable; harsh saturation is not.

**Backgrounds.** Mostly flat warm fills. **No decorative multi‑hue gradients.** The only "gradient" permitted is a very subtle tonal radial used for image *placeholders* (cream→sand). Dark sections use solid `charcoal-900`. Optional: a low‑contrast woven/texture motif may be layered at low opacity in hero zones — keep it subtle.

**Type.** Display = **Bricolage Grotesque** (warm, slightly idiosyncratic) for headlines and brand moments; Body/UI = **Hanken Grotesk** (humanist, highly legible); **JetBrains Mono** for eyebrows (uppercase, tracked `0.16em`) and tabular data. Tight tracking on large display; normal on body. Emphasis = weight, not color.

**Cards.** The core unit. `--surface-card`, `1px` subtle border, `--radius-lg` (20px), resting `--shadow-sm`. Interactive cards **lift 3px** and deepen to `--shadow-lg` on hover, with a slightly stronger border. Media sits flush at the top (`4:3`), body padded `--space-5`.

**Borders.** Hairline, warm (`--border-subtle`/`--border-default`), never gray-blue. Inputs use `1.5px` borders that shift to terracotta on focus.

**Shadows.** Warm‑tinted (rgb 43,33,24), layered and soft — never pure black, never hard. Five steps `xs→xl`. Elevation communicates interactivity, not decoration.

**Radii.** Controls `md` (14px), cards `lg` (20px), feature panels `xl` (28px), chips/avatars/switches `pill`. Nothing fully sharp; nothing cartoonishly round.

**Motion.** Calm and confident. `--dur-fast` 120ms for hovers, `--dur-base` 200ms for state changes. Easing `--ease-out` for most; `--ease-spring` only on small playful elements (toggle thumb, checkmark pop). Press states **shrink slightly** (`scale .99` + 1px down). Hover states **darken** the fill (terracotta‑500→600) or warm the surface (`bg-subtle`); no opacity dimming on solid buttons. **Respect `prefers-reduced-motion`.**

**Focus.** Always visible: a `3px` terracotta‑alpha ring (`--shadow-focus`). Never remove outlines without replacement.

**Transparency & blur.** Used sparingly — sticky headers may use a translucent cream with backdrop blur. Avoid glassmorphism elsewhere.

**Layout.** Max content width ~1200px; text columns ~680px. Fluid `--gutter`. Sticky top nav on marketing; persistent left sidebar on app (collapses on mobile). Mobile‑first: 44px minimum touch targets, single‑column card stacks.

---

## ICONOGRAPHY

- **System:** **[Lucide](https://lucide.dev)** — clean, rounded‑join, 1.5–2px stroke icons. This is a **substitution** (no icon set was supplied); it matches the warm, friendly-but-professional tone. In HTML demos load from CDN: `https://unpkg.com/lucide@latest`. If a canonical set arrives, swap globally.
- **Stroke & size:** default `1.6–2px` stroke, `20–24px` box, `currentColor` so icons inherit text color. Icons are **monochrome**, never multicolor.
- **Inline SVGs:** small UI affordances baked into components (select chevron, checkbox tick, tag ✕, alert glyphs, rating star) are hand-tuned inline SVGs matching Lucide's weight — kept inside the component files.
- **The braid mark** (`assets/braidel-mark.svg`) is the brand glyph: two interwoven terracotta + gold strands. Use as app icon, favicon, and avatar fallback. Don't recolor or rotate it.
- **Emoji / unicode as icons:** **never.** Status uses badges + dots. The only non-icon glyph used decoratively is the rating **★**, rendered as an SVG in the `Rating` component (not the emoji).

---

## Using the system

```html
<!-- One link gets all tokens + fonts -->
<link rel="stylesheet" href="styles.css">
```
```jsx
// Components are exposed on window.BraidelDesignSystem_<hash> in card HTML,
// or imported directly in a real build. Always style via the CSS custom
// properties (var(--brand), var(--surface-card)…) — never hard-code hex.
<Button variant="primary">Post an opportunity</Button>
```

---

## CAVEATS — please review

1. **Fonts are substitutes.** Bricolage Grotesque / Hanken Grotesk / JetBrains Mono are loaded from Google Fonts as stand‑ins for the intended voice. **If Braidel has licensed brand fonts, send the files** and I'll swap `tokens/fonts.css` to real `@font-face` rules.
2. **Icons are Lucide (substitute).** Confirm or provide the canonical icon set.
3. **Logo is an original proposal.** The braid mark + "Braidel" wordmark were designed here from scratch. Treat as a **direction to react to**, not a final identity.
4. **No real photography.** UI kits use tonal placeholders where braiding portfolio images belong. Real imagery will significantly change the warmth — please share approved photos.
5. **Terracotta vs. gold ratio, and overall warmth**, are judgment calls — tell me if you want it bolder, calmer, lighter, or darker.

**👉 Your move:** tell me which direction feels right, send any real fonts/logo/photos you have, and point me at the first screen to build out (the brief lists Landing → Find Braiders → profiles → dashboards). I'll iterate from there.
