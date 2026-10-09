# Personal Website Design System

## 1. Purpose

This file is the visual source of truth for the personal website: portfolio, project case studies, blog, CV, about pages, and supporting UI.

The direction is **modern neubrutalism**: explicit structure, hard-edged geometry, bold typography, flat color, visible borders, zero-blur shadows, and intentional asymmetry. It must feel designed by a technically minded person rather than generated from a generic SaaS template.

The visual layer may be loud. The interaction model must remain conventional, predictable, accessible, and easy to scan.

---

## 2. Brand Character

The site should feel:

- technical
- confident
- direct
- playful in controlled doses
- handcrafted
- structured
- slightly rebellious
- readable
- fast

It should not feel:

- corporate-generic
- glassmorphic
- overly polished
- randomly chaotic
- cartoonish
- retro merely for nostalgia
- visually exhausting

The identity comes from a consistent system, not from adding more decoration.

---

## 3. Core Visual Grammar

### Geometry

- Default corner radius: `0`.
- Small decorative radius may be used only when a component specifically benefits from it; maximum `2px`.
- Do not introduce generic `8px`, `12px`, `16px`, or pill-shaped cards unless the semantics explicitly require a pill/chip.
- Default structural border: `3px`.
- Secondary/subtle border: `2px`.
- Hero/emphasis border: `4px` only when hierarchy calls for it.
- Borders must communicate structure, interactivity, selection, focus, or state. Decorative borders without a job should be removed.

### Shadows

All signature shadows are hard, offset, and have **zero blur**.

- small: `3px 3px 0`
- medium: `5px 5px 0`
- large: `8px 8px 0`

Do not use Material-style blurred elevation, ambient shadows, glow, or glass effects.

### Color

Use a structurally simple palette:

- one page background
- one surface color
- one structural foreground/border color
- a small set of saturated accents

Do not use gradients.

Do not make every section a different saturated color. Loud color must reinforce hierarchy.

### Typography

Font roles:

- Display: `Bebas Neue`, 400 (the supplied display weight)
- Heading/UI: `Plus Jakarta Sans`, 600–700
- Body: `DM Sans`, 400 by default
- Mono/meta/code: `JetBrains Mono`, 400–700

Fallbacks should remain sensible system sans/mono stacks.

Display typography carries the personality. Body typography stays deliberately calm.

---

## 4. Tokens

Use CSS variables. Do not scatter raw visual values across components unless there is a documented reason.

Core token families:

```text
color
border width
shadow offset
radius
spacing
font family
font size
line height
content width
transition duration
z-index
```

Canonical values are defined in `src/styles/tokens.css`.

---

## 5. Light Theme

Palette in `src/styles/tokens.css`:

```css
--nb-bg: #fffdf5;
--nb-surface: #ffffff;
--nb-surface-muted: #f1eee5;
--nb-ink: #111111;
--nb-primary: #ffd23f;
--nb-secondary: #74b9ff;
--nb-accent: #ff6b6b;
--nb-success: #88d498;
--nb-warning: #ffa552;
--nb-lavender: #b8a9fa;
```

The structural color is `--nb-ink`.

---

## 6. Dark Theme

Dark mode must be intentionally designed, not produced by simply inverting colors.

Palette in `src/styles/tokens.css`:

```css
--nb-bg: #151515;
--nb-surface: #202020;
--nb-surface-muted: #2a2a2a;
--nb-ink: #f8f5e9;
--nb-primary: #ffd23f;
--nb-secondary: #74b9ff;
--nb-accent: #ff7a70;
--nb-success: #88d498;
--nb-warning: #ffad66;
--nb-lavender: #c0b3ff;
```

Hard shadows should normally use `--nb-ink`, so dark mode uses a light structural shadow rather than silently falling back to black.

Use black text on bright accent surfaces when that is the higher-contrast pairing.

---

## 7. Typography Scale

Use fluid type where possible.

Type scale in `src/styles/tokens.css`:

```text
Display XL: clamp(3.5rem, 10vw, 8rem)
Display:    clamp(2.75rem, 7vw, 6rem)
H1:         clamp(2.4rem, 5vw, 4.5rem)
H2:         clamp(1.9rem, 3.5vw, 3rem)
H3:         clamp(1.35rem, 2vw, 2rem)
Body lg:    1.125rem
Body:       1rem
Small:      .875rem
Meta:       .8125rem
```

Rules:

- Hero/display text may be tightly tracked.
- Body copy should have generous line-height, normally `1.6–1.75`.
- Blog and project prose should target roughly `90ch`, with generous line height.
- Avoid all-caps body copy.
- All-caps is acceptable for short labels, tags, eyebrow text, and compact navigation emphasis.

---

## 8. Spacing and Layout

Use a stable underlying grid, then disrupt it selectively.

### Page shell

- Maximum wide layout: approximately `1440px`.
- Standard content width: approximately `1200px`.
- Blog and project reading width: approximately `90ch`.
- Horizontal page padding should scale from `16px` on small screens to `32–48px` on desktop.

### Composition rules

Good:

- visible grid structure
- asymmetric hero compositions
- offset cards
- intentional overlap
- large blank areas paired with oversized type
- content blocks that visibly interlock

Bad:

- arbitrary rotations everywhere
- random misalignment at form-control level
- overlapping text that damages legibility
- decorative chaos without hierarchy
- breaking reading order for visual novelty

Macro layout may be asymmetric. Micro layout must remain mechanically aligned.

---

## 9. Interaction Model

Interactive components should feel physical.

### Default

- hard shadow visible
- explicit border
- clear label

### Hover

Typical behavior:

```css
transform: translate(-2px, -2px);
```

Increase shadow offset proportionally.

### Active

Typical behavior:

```css
transform: translate(3px, 3px);
box-shadow: none;
```

The component appears to press into its shadow.

### Transition

Keep interaction transitions fast:

```text
100–150ms
```

Do not animate everything. Avoid perpetual decorative motion.

Respect `prefers-reduced-motion`.

---

## 10. Intensity by Surface

The system is intentionally adaptive.

| Surface         | Intensity | Treatment                                              |
| --------------- | --------: | ------------------------------------------------------ |
| Homepage hero   |      100% | oversized type, large shadow, strongest composition    |
| Portfolio index |       90% | bold project cards, accent surfaces, expressive grid   |
| Project detail  |       70% | strong header, calmer narrative sections               |
| About           |       70% | personality with conventional reading flow             |
| CV              |       60% | highly structured, limited accent use                  |
| Blog index      |       70% | expressive cards and metadata                          |
| Blog article    |       35% | calm prose, fewer shadows, controlled accents          |
| Forms           |       50% | strong boundaries but conventional layout              |
| Navigation      |       80% | recognizable signature component, predictable behavior |

Never apply maximum visual intensity to every component on the page.

---

## 11. Homepage

The homepage should communicate identity immediately.

Current structure in `src/pages/[locale]/index.astro`:

1. navigation
2. hero statement, identity text, and portfolio/blog links
3. featured posts
4. selected work
5. newest posts
6. footer

Each card section uses `ContentGrid` and shows up to three entries.

Hero requirements:

- distinctive display type
- obvious hierarchy
- one main accent color
- one supporting visual device such as an offset label, code fragment, or framed status panel
- no generic stock illustration
- no generic gradient orb

---

## 12. Portfolio

Project cards are major identity carriers.

Each project card should support:

- project title
- concise summary
- role
- technology tags
- year/status
- optional image/screenshot
- clear link affordance

Cards may use different accent fills, but the set must be curated rather than random.

Project detail pages should calm down after the hero. Case-study text, screenshots, diagrams, code, and results need conventional reading flow.

---

## 13. Blog

The blog shell can be expressive. The article body should not shout.

### Blog index

Use:

- strong article cards
- obvious date/topic metadata
- visible tags
- bold headings
- controlled accent surfaces

### Article

Use strong styling for:

- article header
- metadata
- tags
- callouts
- code blocks
- inline figures
- previous/next navigation

Use restrained styling for:

- paragraphs
- lists
- normal links
- footnotes
- tables

Do not put a heavy shadow on every paragraph container.

---

## 14. CV

The CV needs to work both as a branded page and as practical information.

The localized resume MDX provides the profile, technical skills, certifications, experience, and education. `src/components/resume/` renders its grids and timeline; `/about/cv/` supplies the page header and print button. Public contact details and the contact form are on `/about/`.

Use a strong structural grid, compact metadata, and restrained accent colors.

A print stylesheet must remove unnecessary background fills/shadows and preserve readable black-on-white output.

---

## 15. Components

Canonical component guidance is documented in:

`.codex/skills/neubrutalism-ui/references/components.md`

The visual system should include at least:

- Navbar
- Hero
- Button
- IconButton
- ProjectCard
- ArticleCard
- Tag/Badge
- Input
- Textarea
- Select
- Checkbox/Radio
- Callout
- CodeBlock
- Timeline
- CVExperience
- SkillList
- Dialog
- MobileMenu
- Footer

Prefer reusable primitives over page-specific one-off styling.

---

## 16. Accessibility

Accessibility is part of the design definition.

Minimum expectations:

- WCAG 2.2 AA contrast where applicable
- normal text contrast at least `4.5:1`
- large text contrast at least `3:1`
- component boundary/state contrast at least `3:1` where required
- visible keyboard focus
- meaningful outline offset so focus does not disappear into thick borders/shadows
- target sizes at least `24×24px`, preferably `44×44px` for primary controls
- no information communicated by color alone
- semantic HTML
- logical DOM/reading order
- reduced-motion support

Bright colors do not automatically mean accessible colors. Test combinations.

---

## 17. Responsive Rules

Mobile is not a shrunk desktop poster.

At smaller sizes:

- reduce shadow offsets where necessary
- remove nonessential overlaps
- preserve large typography but cap it before it destroys line wrapping
- stack grids naturally
- keep tap targets generous
- prefer horizontal scrolling only for code/tables where unavoidable
- never hide essential information merely to preserve a composition

Navigation should become a clear, conventional mobile menu.

---

## 18. Images and Media

Screenshots and project imagery should feel integrated into the structural system.

Use:

- framed screenshots
- 2–3px structural borders
- occasional offset shadow
- captions in mono/meta style

Avoid:

- floating borderless screenshots with ambient shadows
- meaningless device mockups everywhere
- decorative imagery that competes with project content

---

## 19. Code Blocks

Code blocks should feel engineered rather than decorative.

- use mono typography
- clear border
- restrained background
- optional accent title bar
- horizontal overflow when necessary
- syntax highlighting must retain sufficient contrast
- copy button must be keyboard accessible

Do not put oversized shadows around every code block in long articles.

---

## 20. Design Anti-Patterns

Reject these unless specifically justified:

- gradients
- glassmorphism
- blurred box shadows
- generic rounded SaaS cards
- excessive pill-shaped UI
- low-contrast gray-on-gray surfaces
- random accent colors
- arbitrary rotations on functional controls
- extreme hover motion
- decorative animation loops
- border/shadow applied to every object
- huge type inside dense functional areas
- body text using display fonts

---

## 21. Definition of Done for UI Work

A UI change is complete only when:

1. It uses existing design tokens or intentionally updates them.
2. It is visually consistent in light and dark themes.
3. It works at mobile, tablet, and desktop widths.
4. It has keyboard-visible focus.
5. Its content hierarchy remains clear without relying on color alone.
6. It does not introduce gradients, blur shadows, or generic rounded-card styling.
7. It uses the appropriate intensity for the page type.
8. It preserves semantic structure and readable source order.
9. Repeated patterns are implemented as reusable components/primitives.
10. Long-form content stays calmer than marketing/portfolio surfaces.
