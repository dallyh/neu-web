# Implementation Guidance

## Framework strategy

The design system is framework-independent. Preserve the semantic tokens and behavior if implementation technology changes.

## Astro

Prefer Astro components for static/content-heavy surfaces:

- layout shell
- blog/article cards
- project cards
- CV sections
- footer

Use client-side islands only where interaction warrants them:

- theme toggle
- mobile navigation
- search
- interactive filtering

Avoid hydrating components solely for hover effects that CSS can handle.

## React

Use React for genuinely stateful components. Keep visual primitives composable.

Prefer variants through explicit props/classes rather than copy/pasted components.

Example conceptual API:

```tsx
<Button variant="primary" size="md">View project</Button>
<Card tone="yellow" interactive>
  ...
</Card>
```

## Tailwind

If using Tailwind, create reusable theme tokens/utilities rather than repeating arbitrary values everywhere.

Avoid a codebase full of:

```text
shadow-[5px_5px_0_0_#000]
border-[3px]
```

on every component when a semantic class/token can express the same rule.

Arbitrary values are acceptable during prototyping but should consolidate into the system.

## DaisyUI

DaisyUI can provide behavior/structure, but its visual defaults must not define the site.

Override or neutralize:

- rounded cards/buttons
- soft shadows
- default gradients
- understated borders

Map its semantic colors into this design system and retain neubrutalist geometry.

## CSS architecture

Recommended ordering:

1. tokens
2. reset/base
3. typography
4. layout primitives
5. neubrutalist primitives
6. components
7. page-specific composition
8. utilities

## Component variants

Use a small variant vocabulary.

Good:

```text
primary
secondary
accent
neutral
inverse
subtle
```

Avoid dozens of near-identical one-off tone names.

## Raw values

A raw value is acceptable when:

- it is genuinely component-specific
- it solves a local layout geometry problem
- promoting it to a global token would reduce clarity

A raw value is not acceptable merely because creating/reusing a token was inconvenient.

## Print

For CV and optionally articles, implement print CSS:

- white background
- dark text
- remove decorative hard shadows
- minimize nonessential color fills
- preserve links in readable form where useful
- avoid page breaks inside important experience blocks when possible
