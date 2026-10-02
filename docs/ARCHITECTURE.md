# Architecture

## Overview

The site uses three distinct layers.

```text
┌─────────────────────────────────────────────┐
│ UI / application                            │
│ Astro components + astro-intlayer           │
├─────────────────────────────────────────────┤
│ Editorial content                           │
│ Astro Content Collections + localized MDX   │
├─────────────────────────────────────────────┤
│ Visual system                               │
│ DESIGN.md + design tokens + UI primitives   │
└─────────────────────────────────────────────┘
```

These layers should cooperate but not absorb each other's responsibilities.

## Suggested source tree

```text
src/
  components/
    layout/
    ui/
    blog/
    portfolio/

  content/
    blog/
      en/
      cs/
    portfolio/
      en/
      cs/
    resume/
      en/
      cs/
    tags.json

  content.config.ts

  layouts/
    BaseLayout.astro
    ArticleLayout.astro
    ProjectLayout.astro

  lib/
    content.ts
    i18n.ts
    urls.ts

  pages/
    [...localized routing structure...]

  styles/
    tokens.css
    tailwind.css

  content declarations/
    *.content.ts
```

Intlayer content declaration files may live anywhere covered by Intlayer's configured content directory. Prefer placing them close to the UI domain they describe or in one clearly named i18n/content area; choose one convention and keep it consistent.

Tailwind CSS v4 is wired through its Vite plugin. `tokens.css` remains the source for light/dark colors, typography, and hard shadows; `tailwind.css` exposes those tokens as utilities and holds only base, MDX prose, motion, and print rules. Page and component styling lives in Astro utility classes.

Actions use `nb-action` directly on links and buttons, and content cards use `nb-card` on the article element. Both own their CSS box shadow and increase its offset as they lift on hover; actions remove the shadow while pressed. Shadow-only wrapper elements are unnecessary. The default shadow follows the theme's ink color; `nb-shadow-inverted` can override its color and the border on the same element. Disabled actions do not lift, and reduced-motion preferences suppress transforms.

`nb-card` also supplies the shared border, square corners, surface/text colors, responsive padding, and focus-within outline for content, contact, and tag cards. Keep layout classes and accent color overrides on individual cards; do not repeat their shared structural styles.

Astro's Fonts API uses the Fontsource provider to self-host Bebas Neue, Plus Jakarta Sans, DM Sans, and JetBrains Mono. `BaseLayout.astro` registers the font variables, and the typography tokens in `tokens.css` map them to display, heading, body, and mono roles. The configured Latin and Latin Extended subsets cover English and Czech pages. Production builds require access to Fontsource when the font cache is empty.

## Rendering philosophy

The site is content-heavy and should be mostly static.

Use Astro rendering for:

- page layouts
- project lists
- blog lists
- article/project detail
- localized metadata
- navigation
- footer
- tags

Use browser-side JavaScript only for genuinely interactive behavior such as a persisted theme toggle if CSS alone is insufficient.

The localized About and CV pages are prerendered from the `resume` MDX collection. The form uses a small browser script to call a typed Astro Action, which runs on the standalone Astro Node adapter. The action validates fields, verifies hCaptcha server-side, and sends plain-text mail through Resend. Astro's `env.schema` declares the contact configuration: the public hCaptcha site key is built into the prerendered page, while the Resend key and hCaptcha secret stay in the server environment. The CV hides site navigation when printed.

## Data flow

### UI strings

```text
*.content.ts
    ↓
Intlayer dictionary build
    ↓
useIntlayer("key")
    ↓
Astro component
```

### Blog / portfolio / tags

```text
*.mdx
    ↓
Astro Content Collection
    ↓
getCollection()
    ↓
locale / draft filtering
    ↓
route / component
    ↓
render(entry)
```

Blog entries hold an array of `tags` references. The `tags` collection is loaded from `src/content/tags.json`; route helpers resolve the referenced entries and their localized labels. Tag pages live under each locale's `/tags/` section.

## Cross-locale identity

Never join translations by slug.

Use:

```text
translationKey = permanent conceptual identity
locale         = language of this specific entry
slug           = localized URL segment
```

This allows naturally translated URLs without losing a stable relationship between sibling translations.

## Helpers

Centralize repeated logic.

Recommended APIs:

```ts
getBlogEntries(locale);
getPortfolioEntries(locale);

getBlogEntryBySlug(locale, slug);
getPortfolioEntryBySlug(locale, slug);

getTranslations(collection, translationKey);
getTranslatedSibling(entry, targetLocale);

getBlogUrl(entry);
getPortfolioUrl(entry);
```

Do not duplicate this logic in route files.

## Draft behavior

During production builds, drafts must be excluded.

During local development it is acceptable to expose drafts, preferably with a visible draft indicator.

Keep draft filtering centralized.
