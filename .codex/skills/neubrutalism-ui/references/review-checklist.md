# UI Review Checklist

Use this when auditing existing work.

## Visual grammar

- [ ] No accidental gradients.
- [ ] No blurred Material-style shadows.
- [ ] Default radii remain square/near-square.
- [ ] Border widths are tokenized/consistent.
- [ ] Shadows use the approved offset tiers.
- [ ] Accent colors are curated rather than random.
- [ ] Not every component competes at maximum saturation.

## Hierarchy

- [ ] One clear dominant element per major section.
- [ ] Display typography is reserved for expressive moments.
- [ ] Body text remains calm and readable.
- [ ] Borders/shadows communicate structure rather than decoration alone.

## Interaction

- [ ] Hover states are clear where hover exists.
- [ ] Active states feel pressed/physical.
- [ ] Focus-visible is separate and obvious.
- [ ] Disabled state is clear.
- [ ] No essential behavior depends on hover.

## Accessibility

- [ ] Text contrast is adequate.
- [ ] UI boundaries/states remain visible.
- [ ] Color is not the only state cue.
- [ ] Hit areas are genuinely large enough.
- [ ] Semantic elements are used.
- [ ] DOM/source order remains logical.
- [ ] Reduced motion is respected.

## Responsive

- [ ] No important clipping at narrow widths.
- [ ] Overlaps degrade gracefully.
- [ ] Typography does not create unusable line wraps.
- [ ] Navigation remains conventional and usable.
- [ ] Cards stack in meaningful reading order.

## Themes

- [ ] Light theme looks intentional.
- [ ] Dark theme looks intentional.
- [ ] Structural shadow/border colors work in both.
- [ ] Accent foreground pairs remain readable.

## Surface intensity

- [ ] Homepage/portfolio can be expressive.
- [ ] Project narrative sections are calmer.
- [ ] Blog article body is substantially calmer.
- [ ] Forms remain mechanically aligned and conventional.
- [ ] CV prioritizes scanability.

## Maintainability

- [ ] Existing primitives are reused.
- [ ] New repeated patterns are componentized.
- [ ] Visual constants are tokenized where appropriate.
- [ ] No unnecessary duplicate component variants.
