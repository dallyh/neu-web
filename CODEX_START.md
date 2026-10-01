# Codex Start Here

For a fresh Codex session, use this repository in the following order:

1. Read `AGENTS.md`.
2. Read `DESIGN.md`.
3. Read `.codex/skills/neubrutalism-ui/SKILL.md` if it exists.
4. Read:
    - `docs/ARCHITECTURE.md`
    - `docs/I18N.md`
    - `docs/CONTENT.md`
5. Inspect the existing source tree before generating files.

## Project contract

This is a multilingual Astro personal website.

- **UI strings:** `astro-intlayer`
- **Blog content:** localized MDX in Astro Content Collections
- **Portfolio content:** localized MDX in Astro Content Collections
- **Visual system:** `DESIGN.md`
- **Implementation style:** Astro-first, minimal client JavaScript
- **Translation identity:** `translationKey`, not slug
- **Localized routes:** locale prefix in URL

## First implementation milestone

Create the minimum complete vertical slice:

- Astro + MDX + Intlayer configured
- locales configured
- `BaseLayout.astro`
- translated header/navigation
- locale switcher
- blog and portfolio collections
- one EN/CS blog pair
- one EN/CS portfolio pair
- localized blog/project indexes
- localized detail routes
- correct `<html lang>`
- alternate-language links
- design tokens loaded
- build passes

Do not attempt to populate the full portfolio or blog yet. Prove the architecture first.
