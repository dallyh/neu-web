# Theme and Token Guidance

## Principle

The light and dark themes are related systems, not automatic inversions.

Use semantic variables so components do not need theme-specific hard-coded colors.

## Required semantic tokens

At minimum:

```text
--nb-bg
--nb-surface
--nb-surface-muted
--nb-ink
--nb-text
--nb-text-muted
--nb-primary
--nb-secondary
--nb-accent
--nb-success
--nb-warning
--nb-focus
--nb-border-width
--nb-shadow-color
--nb-shadow-sm
--nb-shadow-md
--nb-shadow-lg
--nb-radius
```

## Shadow color

The shadow is part of the structural language.

Default it to the theme structural color rather than permanently using black.

Light theme:

```text
shadow = dark ink
```

Dark theme:

```text
shadow = light ink
```

Accent-colored shadows may be used selectively but should not become the default.

## Accent surfaces

For accent backgrounds, choose a dedicated readable foreground token if needed.

Do not assume `--nb-ink` is correct for every saturated background in both themes.

## DaisyUI mapping

If using DaisyUI, map semantic DaisyUI variables to the design system instead of allowing default theme values to leak into components.

Suggested conceptual mapping:

```text
base-100 -> background/surface
base-content -> ink/text
primary -> primary accent
secondary -> secondary accent
accent -> coral/accent
neutral -> structural ink/surface inverse
success -> success
warning -> orange/warning
error -> coral/error
```

Then override component geometry/shadow separately so DaisyUI's default radii/shadows do not weaken the system.

## Theme toggle

Theme switch should:

- be keyboard accessible
- expose a label
- avoid flashing incorrect theme on load if SSR/static rendering is used
- respect system preference when no explicit user preference exists
