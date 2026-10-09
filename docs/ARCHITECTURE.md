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
│ docs/DESIGN.md + tokens + UI primitives     │
└─────────────────────────────────────────────┘
```

These layers should cooperate but not absorb each other's responsibilities.

## Source tree

```text
src/
  actions/index.ts                 # setLocale and sendContact
  components/
    ContentCard.astro
    ContactForm.astro
    about/                        # ContactLinks
    blog/                         # Comments, ReadingStats, ViewCount
    layout/                       # Header, Footer, LocaleSwitcher, ThemeToggle
    mdx/                          # MdxContent, headings, links, images, Callout, TOC
    portfolio/                    # ProjectCard, GitHubLanguages
    resume/                       # Hero, grids, certifications, timeline
    ui/                           # ContentGrid, ContentImage, PageHeader, Pagination, Tag
  content/
    blog/{en,cs,assets}/
    portfolio/{en,cs,assets}/
    resume/{en.mdx,cs.mdx,assets}/
    privacy-policy/{en,cs}.mdx
    tags.json
  content.config.ts
  i18n/site.content.ts            # Intlayer site dictionary
  icons/                          # Local SVG icons
  layouts/BaseLayout.astro
  lib/
    content.ts
    urls.ts
    tags.ts
    resume.ts
    privacy.ts
    contact-links.ts
    github.ts
    github-url.ts
    github-language-colors-loader.ts
    open-graph/                   # TSX templates, rendering, fonts, URLs, tokens
    umami/                        # Authentication and page-view queries
  pages/
    index.ts                      # Preference-based locale redirect
    [locale]/
      index.astro
      [slug].astro                # Privacy policy
      about/{index,cv}.astro
      blog/[...page].astro
      blog/posts/[...slug]/{index.astro,og.png.ts}
      portfolio/{[...page],[slug]}.astro
      tags/{index,[slug]}.astro
      rss.xml.ts
      og.png.ts
  styles/
    tokens.css
    tailwind.css
    ec-overrides.css
```

`astro.config.mjs` configures the standalone Node adapter, typed environment variables, Fontsource fonts, Expressive Code, MDX, `astro-iconset`, Intlayer, and Tailwind's Vite plugin. `intlayer.config.ts` configures locales and routing; `ec.config.mjs` configures code rendering. UI declarations use the `site` dictionary in `src/i18n/site.content.ts`.

Tailwind CSS v4 is wired through its Vite plugin. `tokens.css` remains the source for light/dark colors, typography, and hard shadows; `tailwind.css` exposes those tokens as utilities and holds shared utilities, component styles, base rules, MDX prose, motion, and print rules. Page and component styling lives in Astro utility classes.

Actions use `nb-action` directly on links and buttons, and content cards use `nb-card` on the article element. Both own their CSS box shadow and increase its offset as they lift on hover; actions remove the shadow while pressed. Shadow-only wrapper elements are unnecessary. The default shadow follows the theme's ink color; `nb-shadow-inverted` can override its color and the border on the same element. Disabled actions do not lift, and reduced-motion preferences suppress transforms.

`nb-card` also supplies the shared border, square corners, surface/text colors, responsive padding, and focus-within outline for content, contact, and tag cards. Keep layout classes and accent color overrides on individual cards; do not repeat their shared structural styles.

`src/components/ui/ContentGrid.astro` owns the shared card-list layout: one column by default, two at `md`, and three at `lg`, with `gap-8`. Homepage sections, blog and portfolio indexes, tag results, and the tags index place their own cards in its default slot. Pages retain data fetching, card props, heading levels, image priority, and empty states. The optional `class` prop supports additional layout classes.

Astro's Fonts API uses the Fontsource provider to self-host Bebas Neue, Plus Jakarta Sans, DM Sans, and JetBrains Mono. `BaseLayout.astro` registers the font variables, and the typography tokens in `tokens.css` map them to display, heading, body, and mono roles. The configured Latin and Latin Extended subsets cover English and Czech pages. Production builds require access to Fontsource when the font cache is empty.

## Rendering philosophy

Content pages are prerendered. The standalone Node server handles Actions, the root redirect, and server islands such as page-view counts.

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

The contact form renders hCaptcha explicitly after its API-ready callback, using the active locale and the site's light/dark theme. Theme changes recreate the widget, resetting its verification while preserving form fields; a system color-scheme change applies only when no explicit site theme is selected. Recreation is deferred while a contact submission is in progress. The browser always renders the configured site key, including in development; use hCaptcha’s published test site key locally because the development Action verifies with its test key/secret pair. Public profile and email links come from `src/lib/contact-links.ts`.

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

## Helper APIs

Reuse these exports rather than duplicating queries or route construction in pages.

| Module in `src/lib/`               | Exports and behavior                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content.ts`                       | `getEntries(collection, locale?, options?)` filters drafts/locales and sorts newest first; `options.includeDrafts: false` excludes development drafts. `getEntryBySlug(collection, locale, slug)` resolves an entry. `getTranslations(collection, translationKey)` and `getTranslatedSibling(collection, entry, locale)` resolve translations. `getSlugWithoutLocale(id)` derives a stable filename slug; `contentUrl(collection, entry)` builds the detail URL. Collections are `blog` or `portfolio`. |
| `urls.ts`                          | `withTrailingSlash(path)`, `sectionUrl(section, locale)`, `listingPageUrl(section, locale, page)`, and `rssUrl(locale)` build shared URLs with Intlayer.                                                                                                                                                                                                                                                                                                                                                |
| `tags.ts`                          | `getTags()`, `getBlogTags(entry)`, `tagLabel(tag, locale)`, `tagDescription(tag, locale)`, `tagUrl(tagOrId, locale)`, and `getPostsByTag(tagId, locale)` resolve tag references and localized metadata.                                                                                                                                                                                                                                                                                                 |
| `resume.ts`                        | `getResumes()` returns non-draft resumes, including in development.                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `privacy.ts`                       | `getPrivacyPolicies()`, `privacyPolicyLocale(entry)`, and `privacyPolicyUrl(entry)` resolve localized policies.                                                                                                                                                                                                                                                                                                                                                                                         |
| `github.ts`                        | `getGitHubProjectData(githubUrl?)` caches Octokit repository creation dates and language byte counts; partial failures retain available data.                                                                                                                                                                                                                                                                                                                                                           |
| `github-url.ts`                    | `parseGitHubRepositoryUrl(url)` validates and parses repository URLs.                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `github-language-colors-loader.ts` | `githubLanguageColorsLoader()` supplies the `githubLanguages` collection.                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `contact-links.ts`                 | `contactLinks` stores public GitHub, LinkedIn, and email destinations independently of private Resend settings.                                                                                                                                                                                                                                                                                                                                                                                         |
| `open-graph/urls.ts`               | `websiteOgUrl(locale)` and `blogOgUrl(entry)` build image URLs.                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `umami/auth.ts`, `umami/client.ts` | `getToken()` and `getPageViews(path)` query the server-side analytics API.                                                                                                                                                                                                                                                                                                                                                                                                                              |

## Homepage and navigation

The homepage fetches both collections and renders the hero, featured posts, selected work, and newest posts in that order. Each card section shows up to three entries through `ContentGrid`. Blog and portfolio indexes use Astro pagination with six entries per page, configured separately in each route's `getStaticPaths()`.

`Header` supplies navigation with a mobile menu, the DH SVG logo, locale switching, and theme controls. `BaseLayout` sets localized metadata, canonical/hreflang URLs, RSS discovery, and Open Graph images. Native cross-document view transitions are enabled only when reduced motion is not requested; no client router is used.

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

`getEntries()` includes blog/portfolio drafts in development and excludes them in production. `ContentCard` renders a localized draft badge. RSS explicitly disables drafts even in development. `getResumes()` excludes draft resumes in all environments; the privacy-policy schema has no draft field.
