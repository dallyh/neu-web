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
entry.id       = locale folder + stable English filename
```

`getSlugWithoutLocale(entry.id)` removes the locale folder to derive blog and portfolio URLs. Stable English filenames preserve legacy analytics paths. Blog detail URLs use `/{locale}/blog/posts/{filename}/`, and project detail URLs use `/{locale}/portfolio/{filename}/`. Translated siblings are still resolved through `translationKey`; no blog or portfolio `slug` frontmatter is needed.

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

## Blog comments

`src/components/blog/Comments.astro` loads Giscus automatically into a clipped preview with a gradient fading to the theme’s page background. The localized “Show comments” button reveals its full height and removes the overlay. The collapsed widget is inert and hidden from assistive technology until expanded. It preserves the existing `dallyh/daliborhon.dev` repository, Comments category, and pathname mapping so historical blog URLs keep their discussions. UI labels come from Intlayer; the widget receives the active locale. A document attribute observer and system-theme listener keep its light/dark theme synchronized without requiring a custom theme event. Loading failures offer another attempt and a direct GitHub Discussions link, which also works without JavaScript. Comments are hidden when printing.

## Analytics

`BaseLayout` includes the self-hosted Umami tracker only in production builds with `PREVIEW=false`. The typed public `UMAMI_URL` and `UMAMI_SITE_ID` settings default to the existing analytics instance and website ID. Set them, along with `PREVIEW`, during the build; changing runtime variables cannot change a prerendered tracking script. Docker supports both build arguments and Coolify BuildKit secret injection for these values.

`src/lib/umami/auth.ts` and `client.ts` provide server-only `getToken()` and `getPageViews(path)` helpers. Login is lazy and shared across concurrent calls; expired tokens are renewed on one HTTP 401 retry. Requests have a ten-second timeout, validate their responses, and log errors with `console.error` without logging credentials or tokens. Page-view queries use Umami's `path` filter and return a primitive `number`, throwing on failure rather than reporting a false zero. `UMAMI_USERNAME` and `UMAMI_PASSWORD` are optional server secrets needed only when querying the API, and can be supplied to the Node container at runtime. No API login runs just from importing a helper or building the site.

## Open Graph images

Static PNG endpoints live at `/{locale}/og.png` and `/{locale}/blog/posts/{slug}/og.png`. They are prerendered with Satori and Sharp at 1200 × 630, using separate website and blog TSX templates in `src/lib/open-graph/`. The templates use Satori's JSX runtime; React and browser hydration are unnecessary.

Images use the light-theme color tokens from `tokens.css` and local Fontsource WOFF files for Bebas Neue, Plus Jakarta Sans, and DM Sans, including Latin Extended fallback glyphs. WOFF is required because Satori does not accept the WOFF2 files used by Astro's Fonts API. Fonts are cached in memory during rendering, with no remote font requests for OG generation.

Website labels and hero copy come from Intlayer; blog titles, descriptions, and dates come from the localized content entry. `BaseLayout` defaults to the current locale's website image and emits absolute Open Graph and Twitter image URLs. Blog detail pages override it with their post image. Post images follow the same centralized draft filtering as detail routes, so production builds do not publish draft images. `PUBLIC_SITE_URL` must be configured for production builds.

## Draft behavior

During production builds, drafts must be excluded.

During local development it is acceptable to expose drafts, preferably with a visible draft indicator.

Keep draft filtering centralized.
