---
name: neubrutalism-ui
description: Design, implement, refactor, or review UI for this personal portfolio/blog/CV using its neubrutalist design system. Use for pages, components, CSS/Tailwind/DaisyUI styling, responsive layouts, theming, visual QA, accessibility, and design-system consistency.
---

# Neubrutalism UI

Use this skill for UI work in this repository.

## Start here

1. Read `docs/DESIGN.md` before making design decisions.
2. Inspect existing project components and styles before adding new primitives.
3. Reuse `/src/styles/tokens.css`, `/src/styles/tailwind.css`, and the existing Tailwind utilities where applicable.
4. Load only the references needed for the task:
    - `references/components.md` for component behavior and anatomy.
    - `references/layouts.md` for page composition and responsive rules.
    - `references/accessibility.md` for focus, contrast, semantics, and motion.
    - `references/themes.md` for light/dark and token usage.
    - `references/content-surfaces.md` for portfolio/blog/CV-specific intensity.
    - `references/implementation.md` for Astro/React/Tailwind/DaisyUI implementation choices.
    - `references/review-checklist.md` when auditing existing UI.

## Workflow

### When creating UI

1. Identify the surface: homepage, portfolio, project detail, blog index, blog article, CV, about, form, navigation, or shared component.
2. Apply the intensity level defined in `docs/DESIGN.md`.
3. Build a conventional semantic UX skeleton first.
4. Apply neubrutalist tokens as the visual layer.
5. Use hard zero-blur shadows, explicit borders, flat fills, square geometry, and systematic typography.
6. Keep expressive disruption at the macro/layout level; keep controls and text mechanically aligned.
7. Implement hover, active, focus-visible, disabled, and relevant validation states.
8. Verify mobile behavior and dark theme.
9. Preserve accessibility and source-order semantics.

### When modifying existing UI

- Prefer extending an existing primitive over introducing a duplicate.
- Do not replace deliberate project styling with generic framework defaults.
- Do not globally increase visual loudness to solve a local hierarchy problem.
- Keep blog article prose and functional UI calmer than hero/portfolio surfaces.

### When reviewing UI

Use `references/review-checklist.md` and report concrete violations with file/component references when possible.

## Non-negotiable rules

- No gradients.
- No blurred shadows for signature elevation.
- Default radius is zero.
- Use project tokens instead of arbitrary raw values where practical.
- Do not communicate state by color alone.
- Focus-visible styles must remain distinct from borders and shadows.
- Respect reduced motion.
- Long-form reading must remain calm and readable.
- Do not make every component equally loud.

## Interaction grammar

Typical interactive lift:

```css
transform: translate(-2px, -2px);
```

Typical pressed state:

```css
transform: translate(3px, 3px);
box-shadow: none;
```

Use short transitions, typically 100–150ms. Reduce or disable transform motion under `prefers-reduced-motion`.

## Definition of done

Before considering UI work complete, verify:

- correct page intensity
- token reuse
- light/dark parity
- keyboard focus
- accessible contrast
- responsive layout
- semantic HTML
- reusable patterns
- no accidental gradients/blurred shadows/generic rounded cards
- calm long-form body treatment where applicable
