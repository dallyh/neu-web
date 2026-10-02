# AGENTS.md — Personal Website

This file is the primary entrypoint for Codex and other coding agents working in this repository.

## 0. Package manager and Node.js

This project uses:

- Node.js managed through NVM
- pnpm as the only package manager
- `pnpm-lock.yaml` as the canonical dependency lockfile

Before installing dependencies or running project commands, use the Node.js version defined by `.nvmrc`:

```bash
nvm use
```

Use pnpm consistently for all package-management and project commands.

```bash
pnpm install
pnpm dev
pnpm build
pnpm check

pnpm add <package>
pnpm add -D <package>
pnpm remove <package>
pnpm update
```

## 1. Project goal

Build a multilingual personal website containing:

- portfolio / project case studies
- blog
- CV / experience
- about/contact surfaces

The visual language is modern neubrutalism. `DESIGN.md` is the source of truth for visual decisions.

Before making UI changes, read:

1. `AGENTS.md`
2. `DESIGN.md`
3. `.codex/skills/neubrutalism-ui/SKILL.md` when present
4. `docs/ARCHITECTURE.md`
5. `docs/I18N.md`
6. `docs/CONTENT.md`

Do not invent a parallel design system, translation system, or content architecture.

---

## 2. Core technology

Use:

- Astro
- TypeScript
- `astro-intlayer` / Intlayer for application and UI strings
- Astro Content Collections
- MDX via `@astrojs/mdx`
- localized MDX files for portfolio and blog content

Prefer Astro components and server-rendered HTML by default.

Only add a client-side framework or hydrated island when interaction genuinely requires it.

---

## 3. Separation of translated content

There are two translation domains and they MUST remain separate.

### UI/application strings → Intlayer

Examples:

- navigation labels
- buttons
- form labels
- pagination
- filter labels
- empty states
- section labels
- accessibility labels
- footer text
- generic metadata labels such as "Published", "Reading time", "Projects"

Use `.content.ts` Intlayer dictionaries and consume them through `astro-intlayer`.

Do NOT hard-code user-visible UI text in `.astro`, `.ts`, or component files when it should be translated.

### Editorial content → MDX

Examples:

- blog post title and prose
- project title and project case-study text
- project summary
- project outcomes
- article excerpts
- long-form CV/about content if stored as editorial content

Do NOT put blog or portfolio prose into Intlayer dictionaries.

Every localized editorial document is its own MDX entry.

---

## 4. Locale routing

Locale-aware URLs are required.

Examples:

- `/en/`
- `/cs/`
- `/en/blog/`
- `/cs/blog/`
- `/en/blog/posts/2025-02-12-example-post/`
- `/cs/blog/posts/2025-02-12-example-post/`
- `/en/portfolio/example-project/`
- `/cs/portfolio/example-project/`

Use Intlayer's locale utilities and Astro integration rather than manually parsing locale URL prefixes when an official helper exists.

Locale switching should preserve the equivalent content page where a translated sibling exists.

If no translation exists, fall back to the corresponding locale section/index rather than silently displaying content in the wrong language.

Do not assume English and Czech are the final locale set. Read configured locales from Intlayer configuration.

---

## 5. Content organization

Canonical structure:

```text
src/
  content/
    blog/
      en/
        example-post.mdx
      cs/
        example-post.mdx
    portfolio/
      en/
        example-project.mdx
      cs/
        example-project.mdx
```

Localized siblings share a stable `translationKey`.

Blog and portfolio URL slugs are derived from `entry.id` with the locale folder removed. Keep the English filenames stable across locales to preserve historical analytics URLs; blog detail routes include `/blog/posts/`.

Example:

```yaml
translationKey: content-collections-in-astro
```

and:

```yaml
translationKey: content-collections-in-astro
```

Never use the translated slug as the cross-locale identity.

See `docs/CONTENT.md`.

---

## 6. Content collection rules

Use Astro Content Collections and Zod schemas.

Blog entries should support at minimum:

- `title`
- `description`
- `locale`
- `translationKey`
- `publishedAt`
- `updatedAt` optional
- `tags` (an array of references to the `tags` collection)
- `draft`
- `featured`
- `image` optional

Portfolio entries should support at minimum:

- `title`
- `description`
- `locale`
- `translationKey`
- `date`
- `tags`
- `featured`
- `draft`
- `externalUrl` optional
- `repositoryUrl` optional
- `image` optional
- `role` optional
- `stack`

Do not duplicate whole MDX documents in TypeScript data structures.

---

## 7. Intlayer rules

Use `astro-intlayer` as the single UI i18n system.

Expected integration:

```ts
import { defineConfig } from "astro/config";
import { intlayer } from "astro-intlayer";

export default defineConfig({
    integrations: [intlayer()],
});
```

Typical server-side component use:

```astro
---
import { useIntlayer } from "astro-intlayer";

const content = useIntlayer("navigation");
---

<a href="/">{content.home}</a>
```

For locale information use `useLocale()`.

For localized URLs prefer Intlayer URL helpers such as `getLocalizedUrl()` and `getPathWithoutLocale()` where applicable.

Do not create a second translation helper such as `t.ts`, JSON translation maps, or manual locale maps unless there is a documented technical reason.

See `docs/I18N.md`.

---

## 8. UI implementation rules

`DESIGN.md` owns visual direction.

When the neubrutalism skill exists, use it.

Key constraints:

- no gradients unless explicitly approved
- no blurred material-style shadows
- hard offset shadows
- strong visible borders
- restrained radius
- deliberate accent colors
- visible focus states
- interaction must not rely on color alone
- blog article bodies are calmer than portfolio/landing surfaces
- preserve readable line length for prose
- support light and dark themes
- preserve reduced-motion behavior
- CV must remain printable

Never turn the site into generic rounded SaaS UI.

---

## 9. Component architecture

Prefer small reusable primitives and composition.

Suggested structure:

```text
src/components/
  layout/
    Header.astro
    Footer.astro
    LocaleSwitcher.astro
    ThemeToggle.astro

  ui/
    Button.astro
    Card.astro
    Tag.astro
    Callout.astro
    SectionHeading.astro

  blog/
    BlogCard.astro
    BlogList.astro
    ArticleMeta.astro

  portfolio/
    ProjectCard.astro
    ProjectGrid.astro
    ProjectMeta.astro

src/layouts/
  BaseLayout.astro
  ArticleLayout.astro
  ProjectLayout.astro
```

Do not create one-off components when an existing primitive can be composed.

Avoid overly generic components with dozens of visual props.

---

## 10. Astro-first rules

Prefer:

1. static HTML
2. Astro component logic
3. small vanilla browser script
4. hydrated framework component only if necessary

Do not ship JavaScript for static presentation.

Do not use client hydration for:

- navigation that can be normal links
- static cards
- article metadata
- static locale lists
- simple disclosure patterns that can use semantic HTML

---

## 11. Accessibility

Every change must preserve:

- semantic landmarks
- logical heading hierarchy
- keyboard operation
- visible `:focus-visible`
- WCAG AA contrast for normal text
- appropriate alt text
- accessible names for icon-only controls
- `lang` matching the active locale
- reduced-motion preferences

Decorative brutalist styling must never obscure usability.

---

## 12. SEO and metadata

Every localized page should provide correct:

- `<html lang>`
- title
- description
- canonical URL
- alternate/hreflang URLs when translated siblings exist
- Open Graph metadata
- article metadata for blog posts where relevant

A locale switch and `hreflang` links must be based on actual translated siblings, not guessed filename equality.

---

## 13. Code quality

Use strict TypeScript.

Prefer named, typed helper functions for:

- filtering entries by locale
- resolving translated siblings
- generating content URLs
- sorting posts/projects
- draft filtering

Do not scatter locale filtering and URL construction logic across page files.

Centralize content helpers, for example:

```text
src/lib/
  content.ts
  i18n.ts
  urls.ts
```

Keep content schemas in `src/content.config.ts`.

---

## 14. Development workflow for agents

Before implementing a feature:

1. inspect existing structure
2. read relevant design and architecture docs
3. identify reusable components
4. identify whether text belongs to Intlayer or MDX
5. identify whether the feature needs client JavaScript
6. implement the smallest coherent change
7. run formatting/type/build checks available in the repo
8. check both light and dark themes
9. check at least two locales
10. check keyboard/focus behavior for interactive UI

When modifying content architecture, update the relevant documentation in the same change.

---

## 15. Things agents must not do

Do not:

- translate MDX content using Intlayer dictionaries
- hard-code translated UI strings
- create duplicate i18n systems
- derive translation identity from localized slugs
- add framework islands unnecessarily
- introduce gradients/glassmorphism into the design language
- remove design tokens in favor of arbitrary repeated values
- create English-only assumptions in reusable components
- generate locale paths by string concatenation if Intlayer already provides the correct helper
- expose draft content in production
- silently fall back to another language for missing editorial content

---

## 16. Initial implementation priority

Unless the user specifies otherwise, build in this order:

1. Astro project/integrations
2. Intlayer configuration
3. content collection schemas
4. locale-aware base layout
5. header/navigation/locale switcher/theme control
6. homepage
7. portfolio index and detail
8. blog index and detail
9. CV/about page
10. SEO/RSS/sitemap refinements

The first milestone should prove the architecture with at least:

- two locales
- one translated UI dictionary
- one blog translation pair
- one portfolio translation pair
- working localized routes
- locale switching
- light/dark design tokens
