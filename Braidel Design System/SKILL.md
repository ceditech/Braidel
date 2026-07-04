---
name: braidel-design
description: Use this skill to generate well-branded interfaces and assets for Braidel, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

# Braidel Design System

Braidel is a two-sided **workforce + booking marketplace for the hair braiding industry** — connecting salon owners, braiders, and clients. The brand is warm, elevated, and rooted in Black/African hair-braiding culture: cream + warm-brown + deep-charcoal neutrals, a **terracotta** primary accent, **deep gold** secondary, clean humanist sans type, and soft card-based layouts.

## How to use this skill

1. **Read `readme.md` first** — it is the full design guide (brand context, CONTENT FUNDAMENTALS, VISUAL FOUNDATIONS, ICONOGRAPHY, and a file index). Then explore the other files.
2. **Tokens & styling:** link `styles.css` (it `@import`s every token + font). Always style via the CSS custom properties — `var(--brand)`, `var(--surface-card)`, `var(--text-body)`, `var(--space-*)`, `var(--radius-*)`, `var(--shadow-*)` — never hard-code hex.
3. **Components** live in `components/*/` as React (`Button`, `Input`, `Select`, `Checkbox`, `Switch`, `Card`/`CardMedia`/`CardBody`, `Badge`, `Tag`, `Avatar`/`AvatarGroup`, `Rating`, `Tabs`, `Alert`). Each has a `.d.ts` (props), `.prompt.md` (usage), and a `*.card.html` live demo. In standalone HTML, load the compiled `_ds_bundle.js` and read components off the `window.BraidelDesignSystem_*` namespace (see any `*.card.html`).
4. **Full screens** are recreated in `ui_kits/marketing/` (landing, find braiders, braider profile) and `ui_kits/app/` (salon + braider dashboards, applicants, post opportunity, find work, messaging, settings). Copy these patterns for new screens.
5. **Assets** are in `assets/` (the braid logo mark). Icons follow **Lucide** style — see `ui_kits/shared/Icon.jsx` for an inline set.

## When creating artifacts

- **Throwaway prototypes / slides / mocks:** copy the assets you need and produce self-contained static HTML files for the user to view.
- **Production code:** read the rules here and become an expert in the brand; reuse the token names and component APIs.

## If invoked with no other guidance

Ask what the user wants to build or design, ask a few focused questions (which role/surface, fidelity, variations), then act as an expert Braidel designer who outputs HTML artifacts _or_ production code as needed.

## Voice cheat-sheet

Sentence case everywhere. Speak to the user as "you". Short, specific labels ("Apply now", "Post a job"). Real braiding vocabulary (knotless, box braids, locs, cornrows, Senegalese twists). No emoji in UI. Numbers/data in mono with tabular figures. Warm imagery only.
