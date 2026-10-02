# Editorial Content

The first published entries describe this website itself. Their English and Czech MDX files share `translationKey` values while using localized slugs. New entries should follow that pattern; set `draft: true` to exclude an entry from production routes and indexes.

Blog, portfolio, and resume content live in Astro Content Collections as MDX.

## Folder convention

```text
src/content/
  blog/
    en/
      astro-content-collections.mdx
    cs/
      kolekce-obsahu-astro.mdx

  portfolio/
    en/
      project-name.mdx
    cs/
      nazev-projektu.mdx
  resume/
    en/
      resume.mdx
    cs/
      resume.mdx
  privacy-policy/
    en.mdx
    cs.mdx
  tags.json
```

The physical filename may be localized. Do not depend on identical filenames for translation matching.

## Shared identity

Translated versions use the same `translationKey`.

English:

```yaml
locale: en
translationKey: astro-content-collections
slug: astro-content-collections
```

Czech:

```yaml
locale: cs
translationKey: astro-content-collections
slug: kolekce-obsahu-v-astro
```

## Blog frontmatter

Recommended schema:

```yaml
---
title: "Content collections in Astro"
description: "..."
locale: en
translationKey: astro-content-collections
slug: astro-content-collections
publishedAt: 2026-09-28
updatedAt: 2026-09-28
tags: [architecture, internet]
draft: false
featured: false
image: ../assets/astro-content/cover.webp
imageAlt: "Localized description of the cover illustration."
---
```

Then the article body follows in MDX.

## Portfolio frontmatter

Recommended schema:

```yaml
---
title: "Example Project"
description: "A concise localized project summary."
locale: en
translationKey: example-project
slug: example-project
date: 2026-09-28
tags:
    - astro
    - typescript
stack:
    - Astro
    - TypeScript
featured: true
draft: false
role: "Design & Development"
repositoryUrl: "https://example.com"
githubUrl: "https://github.com/owner/repository"
externalUrl: "https://example.com"
image: ../assets/example/cover.webp
imageAlt: "Localized description of the project image."
---
```

`githubUrl` is optional and must point to a public GitHub repository. Project cards use GitHub's creation date ahead of the MDX `date` when the API responds, and show the repository's language breakdown. The MDX date remains the fallback and controls editorial ordering. `repositoryUrl` can still point to a non-GitHub source repository. Set the optional server-side `GITHUB_TOKEN` to raise API rate limits; failed or unavailable GitHub responses leave the card usable with its MDX date.

Language colors come from the `githubLanguages` content collection, loaded from `ozh/github-colors` during content sync. Entries with no color use a design-token fallback. If the color source is unavailable, previously stored colors are retained when available and cards still render with fallback colors.

## Resume frontmatter

One published resume entry per locale supplies the localized About summary and CV page. Its stable `translationKey` connects the translations. Keep biographical and career prose in MDX, while page labels and form messages belong in Intlayer.

```yaml
---
title: "Curriculum vitae"
description: "A concise overview of my work and experience."
locale: en
translationKey: personal-resume
summary: "A short introduction for the About page."
draft: false
---
```

The body contains the printable CV. `draft: true` removes the entry from the About and CV routes. The published English and Czech resumes live at `src/content/resume/en.mdx` and `cs.mdx`, sharing `translationKey: personal-resume`. Their `summary` supplies the About page introduction.

Resume MDX imports the presentation components from `src/components/resume/`: `Hero`, `DevGrid`/`DevGridItem`, `CertGrid`/`CertCard`, and `Timeline`/`TimelineItem`. Keep the profile, skill labels, certification names, and career descriptions in the localized MDX. Use `slot="exp"` and `slot="edu"` for timeline entries. Assets are imported from `./assets/`; `CertCard` supports an optional `imgInverted` for dark-theme logos. Technology icons use the existing `astro-iconset` integration with only the required Devicon icons included in its configuration.

The CV page supplies its own H1, so resume bodies start with H2 sections. Components use CSS print rules rather than a server-side print flag: technology labels, certifications, and experience remain visible, while decorative icons, logos, backgrounds, and shadows are removed for printing. Migration files are moved into the canonical entries to avoid duplicate About/CV routes for a locale.

Set `showTableOfContents: true` in any blog, portfolio, or resume entry to show its heading list. It defaults to `false`; readers can expand or collapse a displayed list. The list is hidden when printing.

## MDX components

The shared renderer in `src/components/mdx/MdxContent.astro` is used by blog, portfolio, and CV pages. It replaces Markdown headings, links, and images with site components. Heading `#` links use Astro's generated IDs, and external HTTP(S) links open in a new tab with an accessible indication.

Fenced code blocks in Markdown and MDX use `astro-expressive-code`, configured in `ec.config.mjs`. It uses GitHub's light and dark code themes, follows the site's `data-theme` setting and system preference, and uses the site's font, border, focus, and hard-shadow tokens.

Authors can use the `Callout` component without importing it in each MDX file:

```mdx
<Callout type="tip" title="Optional title">
    A short **formatted** note.
</Callout>
```

Supported types are `note`, `tip`, `success`, `caution`, and `danger`. If omitted, the type is `note` and the label comes from Intlayer. Keep the rest of the body in normal Markdown/MDX.

Allow a controlled set of design-system components in MDX, for example:

- `Callout`
- `Figure`
- `ImageGallery`
- `CodeExample`
- `ProjectMetric`

Do not allow arbitrary page-layout components inside editorial MDX.

The MDX author should focus on content rather than manually reconstructing the site's layout.

## Cover assets

The first entries use generated WebP illustrations stored beside their content collections. Local paths in frontmatter are resolved by Astro's image pipeline; absolute HTTPS URLs are also supported.

- `src/content/blog/assets/foundation.webp`: geometric content blocks connected to a browser window; warm cream, yellow, blue, and coral; hard outlines and shadows; no text, flags, gradients, or blur.
- `src/content/portfolio/assets/website.webp`: layered website panels and interface shapes on blue; hard outlines and shadows; no people, text, flags, or gradients.

Cards and detail pages render `image` when present. Put the localized image description in `imageAlt`; use an empty description only for a purely decorative image.

## Privacy policy

Localized policy MDX files live in `src/content/privacy-policy/{locale}.mdx`. Their frontmatter has `title`, `locale`, `effectiveDate`, `slug`, and a stable `translationKey`. The `locale` and `slug` control the localized URL. The footer links to the policy for the active locale; translated siblings provide locale-switching links.

## Tags

Blog posts use a `tags` array of references, whose IDs must exist in the `tags` collection. The collection is loaded from one JSON file, `src/content/tags.json`, with entries shaped like:

```json
[{ "id": "architecture", "label": { "en": "Architecture", "cs": "Architektura" }, "description": { "en": "...", "cs": "..." } }]
```

Every configured locale needs a label and description. Public routes are `/{locale}/tags/` and `/{locale}/tags/{id}/`; the blog index, cards, and detail pages link to the referenced tags. Each tag page lists posts whose `tags` array contains that tag. Portfolio `tags` remain simple technical metadata until a portfolio taxonomy is needed.

Blog and portfolio indexes use Astro pagination with six published entries per page. The first page stays at `/{locale}/blog/` or `/{locale}/portfolio/`; later pages use `/{locale}/blog/{page}/` and `/{locale}/portfolio/{page}/`. Drafts are filtered before pagination, and the shared pagination control uses Astro's generated page URLs.
Each index route sets its own `pagination.itemsPerPage` in `getStaticPaths()`; change that value to adjust the page size (currently six for both).

Tag labels and descriptions are localized editorial metadata. Technical proper terms such as `Astro`, `TypeScript`, or `.NET` may use the same spelling across locales.

For human-language concepts, the stable tag ID is the key and its displayed label is localized in the tag entry.

## URLs

Use the explicit localized `slug` from frontmatter.

Do not expose `translationKey` as the URL unless they intentionally happen to be the same.

## Ordering

Blog:

1. published date descending
2. optionally feature pinned content through explicit `featured`

Portfolio:

- use explicit date/order logic
- do not rely on filesystem enumeration order

## Drafts

Drafts are visible in development indexes and detail pages, with a localized badge on content cards. They must never be present in production indexes, feeds, sitemap entries, or generated detail pages.

## RSS

Each configured locale has a static feed at `/{locale}/rss.xml`, generated by `src/pages/[locale]/rss.xml.ts`. Feeds include all published blog posts for that locale, sorted newest first, with localized channel metadata and tag labels. The shared content helper receives `includeDrafts: false`, so feeds omit drafts in development too.

The Astro Container API renders posts through the shared MDX components with the table of contents disabled. HTML is sanitized for feed readers: images and article structure are preserved, while scripts, styles, SVG icons, and code-copy buttons are removed. Links and image sources are resolved against each post's canonical URL. Set `PUBLIC_SITE_URL` before building so feed URLs point to the deployed site. Every page advertises its locale's feed through an RSS alternate link, and the footer provides a subscription link.
