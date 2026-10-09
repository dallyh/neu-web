# Content Collections

`src/content.config.ts` defines six collections using Astro Content Collections and Zod. This document describes the active schemas; UI strings remain in `src/i18n/site.content.ts`.

## Sources

| Collection        | Loader/source                                               |
| ----------------- | ----------------------------------------------------------- |
| `blog`            | `glob`, `src/content/blog/**/*.{md,mdx}`                    |
| `portfolio`       | `glob`, `src/content/portfolio/**/*.{md,mdx}`               |
| `resume`          | `glob`, `src/content/resume/**/*.{md,mdx}`                  |
| `privacyPolicy`   | `glob`, `src/content/privacy-policy/**/*.{md,mdx}`          |
| `tags`            | `file`, `src/content/tags.json`                             |
| `githubLanguages` | `githubLanguageColorsLoader()`, GitHub language colors JSON |

Blog and portfolio entries live in `en/` and `cs/` directories with collection-local `assets/` folders. Resumes live at `src/content/resume/en.mdx` and `cs.mdx`, with assets in `resume/assets/`. Policies live at `privacy-policy/en.mdx` and `cs.mdx`.

## Shared validation

- `locale` is a string validated against Intlayer's configured locales (`en` and `cs` in `intlayer.config.ts`).
- `translationKey` is a non-empty string identifying translated siblings. It does not define the URL.
- Dates use `z.coerce.date()` and resolve to JavaScript `Date` values.
- Blog/portfolio `image` uses `image().or(z.url()).optional()`: a local image resolved by Astro or a remote URL. Local paths are relative to the content file; `imageAlt` contains the localized description.
- Fields with defaults can be omitted from frontmatter. An optional field has no schema default.

## Blog schema

| Field                 | Validation                    | Required/default        |
| --------------------- | ----------------------------- | ----------------------- |
| `title`               | String                        | Required                |
| `description`         | String                        | Required                |
| `locale`              | Configured locale string      | Required                |
| `translationKey`      | Non-empty string              | Required                |
| `publishedAt`         | Coerced date                  | Required                |
| `updatedAt`           | Coerced date                  | Optional                |
| `tags`                | Array of references to `tags` | Required; `[]` is valid |
| `draft`               | Boolean                       | `false`                 |
| `featured`            | Boolean                       | `false`                 |
| `showTableOfContents` | Boolean                       | `false`                 |
| `image`               | Astro image or URL            | Optional                |
| `imageAlt`            | String                        | Optional                |

Referenced tag IDs must exist in `src/content/tags.json`. Cards, article headers, and the blog index link tags to their localized tag pages.

## Portfolio schema

| Field                 | Validation                                   | Required/default |
| --------------------- | -------------------------------------------- | ---------------- |
| `title`               | String                                       | Required         |
| `description`         | String                                       | Required         |
| `locale`              | Configured locale string                     | Required         |
| `translationKey`      | Non-empty string                             | Required         |
| `date`                | Coerced date                                 | Required         |
| `tags`                | Array of strings                             | `[]`             |
| `stack`               | Array of strings                             | `[]`             |
| `featured`            | Boolean                                      | `false`          |
| `showTableOfContents` | Boolean                                      | `false`          |
| `draft`               | Boolean                                      | `false`          |
| `role`                | String                                       | Optional         |
| `repositoryUrl`       | URL                                          | Optional         |
| `githubUrl`           | URL accepted by `parseGitHubRepositoryUrl()` | Optional         |
| `externalUrl`         | URL                                          | Optional         |
| `image`               | Astro image or URL                           | Optional         |
| `imageAlt`            | String                                       | Optional         |

Portfolio tags are technical strings, not references to the blog taxonomy. `ProjectCard` uses Octokit to fetch repository creation dates and language byte counts when `githubUrl` is set. GitHub's creation date takes precedence over the frontmatter date for display; editorial sorting still uses `date`. Failed requests leave available metadata and the frontmatter fallback usable. `repositoryUrl` also supports non-GitHub repositories.

## Resume schema

| Field                 | Validation               | Required/default |
| --------------------- | ------------------------ | ---------------- |
| `title`               | String                   | Required         |
| `description`         | String                   | Required         |
| `locale`              | Configured locale string | Required         |
| `translationKey`      | Non-empty string         | Required         |
| `summary`             | Non-empty string         | Required         |
| `draft`               | Boolean                  | `false`          |
| `showTableOfContents` | Boolean                  | `false`          |

The published resumes share `translationKey: personal-resume`. Their summaries supply the About pages; their MDX bodies supply `/about/cv/`. `getResumes()` excludes drafts in every environment.

Resume MDX imports `Hero`, `DevGrid`/`DevGridItem`, `CertGrid`/`CertCard`, and `Timeline`/`TimelineItem` from `src/components/resume/`. Timeline slots are `exp` and `edu`. Certification images use `ContentImage` with `fit="contain"`. The CV page supplies its H1, so body sections start with H2. Print styles retain the CV text and remove navigation and decorative backgrounds, images, and shadows.

## Privacy-policy schema

| Field            | Validation               | Required/default |
| ---------------- | ------------------------ | ---------------- |
| `title`          | Non-empty string         | Required         |
| `locale`         | Configured locale string | Required         |
| `effectiveDate`  | Coerced date             | Required         |
| `slug`           | Non-empty string         | Required         |
| `translationKey` | Non-empty string         | Required         |

Unlike blog and portfolio, policies use their explicit localized `slug`. `src/pages/[locale]/[slug].astro` renders them, and the footer links to the active locale's policy. The schema has no draft field.

## Tags schema

`tags.json` is an array of entries with an `id` and these schema fields:

| Field         | Validation                                                                             | Required/default |
| ------------- | -------------------------------------------------------------------------------------- | ---------------- |
| `label`       | Record of string keys to non-empty strings; value required for every configured locale | Required         |
| `description` | Record of string keys to non-empty strings; value required for every configured locale | Required         |

The file loader uses `id` as the entry identity. Labels and descriptions are localized editorial metadata. Public routes are `/{locale}/tags/` and `/{locale}/tags/{id}/`; results contain posts whose tag references match that ID.

## GitHub-language schema

| Field   | Validation                                            | Required/default |
| ------- | ----------------------------------------------------- | ---------------- |
| `color` | Six-digit hex color (`/^#[0-9a-fA-F]{6}$/`) or `null` | Required         |

The loader fetches `https://raw.githubusercontent.com/ozh/github-colors/master/colors.json` during content sync and uses each language name as its entry ID. Invalid entries are skipped. Fetch failures retain cached colors when available; language indicators use a design-token fallback if a color is missing.

## URLs, translations, and ordering

Blog and portfolio have no `slug` field. `getSlugWithoutLocale(entry.id)` removes the leading locale directory and preserves the rest of the ID. Keep English filenames stable across translations to retain historical URLs and analytics:

- Blog: `/{locale}/blog/posts/{filename}/`.
- Portfolio: `/{locale}/portfolio/{filename}/`.
- Privacy policy: `/{locale}/{slug}/`.

Translated siblings are matched by `translationKey`, not filename equality. Missing translations link to the corresponding section in the target locale.

`getEntries()` sorts blog by `publishedAt` descending and portfolio by `date` descending. The homepage filters featured entries for its featured sections and uses the newest three posts for latest writing.

Blog and portfolio indexes paginate after locale/draft filtering, with `pagination.itemsPerPage: 6` in each route's `getStaticPaths()`. Page one uses the section root; later pages use `/{locale}/{section}/{page}/`. `Pagination.astro` renders first, previous, current, next, and last controls.

## Drafts

Blog and portfolio drafts appear in development and are excluded in production. `ContentCard` shows a localized draft badge. RSS passes `includeDrafts: false` even in development. Resume drafts are always excluded from About/CV routes.

## Rendering and assets

`src/components/mdx/MdxContent.astro` renders blog, portfolio, and CV content. It maps H1–H6, links, images, and `Callout` to the site's components. Heading anchors use Astro-generated IDs; external HTTP(S) links include an accessible indication and open in a new tab. `showTableOfContents` controls the toggleable heading list, hidden when printing.

`Callout` is available without an MDX import:

```mdx
<Callout type="tip" title="Optional title">
    A short **formatted** note.
</Callout>
```

Types are `note`, `tip`, `success`, `caution`, and `danger`. The default type is `note`; default labels come from Intlayer. Fenced code uses `astro-expressive-code`, configured in `ec.config.mjs`, with theme-aware colors and project fonts.

Cards and detail pages render frontmatter images through `ContentImage.astro`, which handles local Astro images and remote sources. Collection assets live beside their content; resume MDX imports its assets directly.

## RSS

`src/pages/[locale]/rss.xml.ts` prerenders `/{locale}/rss.xml` for each configured locale. Feeds contain published posts, newest first, with localized channel metadata and tag labels. Astro's Container API renders the shared MDX components with the table of contents disabled. Sanitization removes scripts, styles, SVG icons, and code-copy buttons while preserving article structure and images. Links and image sources become absolute URLs. `PUBLIC_SITE_URL` supplies the production origin; `BaseLayout` and the footer expose the active locale's feed.
