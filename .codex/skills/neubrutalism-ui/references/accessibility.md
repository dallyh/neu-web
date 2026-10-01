# Accessibility Rules

## Baseline

Target WCAG 2.2 AA for the public website.

## Contrast

Check actual foreground/background pairs.

Minimums commonly relevant to this system:

- normal text: 4.5:1
- large text: 3:1
- meaningful UI component boundaries/states: 3:1 where applicable

Bright accent colors are not automatically accessible.

Prefer dark text on light saturated accents when that produces better contrast.

## Focus

Every interactive element must expose a visible keyboard focus state.

Because components already have heavy borders/shadows:

- use `outline`
- use positive `outline-offset`
- do not rely only on changing border color

Example:

```css
:focus-visible {
    outline: 3px solid var(--nb-focus);
    outline-offset: 4px;
}
```

## Target size

Do not confuse visual bulk with actual hit area.

- absolute minimum: 24×24px where WCAG permits
- preferred primary/control target: ~44×44px or larger

## Color independence

Never communicate selected/error/success state through color alone.

Add one or more of:

- icon
- label
- border/shape change
- text
- checkmark

## Semantics

Use native semantic elements first:

- `button` for actions
- `a` for navigation
- `nav`
- `main`
- `article`
- headings in logical order
- `label` connected to form fields

Do not turn generic `div` elements into controls unless there is a strong reason and all required keyboard semantics are implemented.

## Reading order

Visual asymmetry must not require a scrambled DOM order.

Source order should remain meaningful when CSS is removed and for assistive technology.

## Motion

Support reduced motion.

```css
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        scroll-behavior: auto !important;
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

Do not use motion as the sole state signal.

## Forms

- labels stay visible; placeholders are not labels
- errors use text and programmatic association where possible
- required state is explicit
- focus should move appropriately after submission errors when needed

## Images

Provide meaningful `alt` text for informative images.

Decorative imagery should use empty alt where appropriate.

Project screenshots need concise alt descriptions when they communicate content.

## Links

Links inside body text should remain distinguishable without relying solely on color. Underline or an equivalent strong cue is preferred.

## Testing expectation

For substantial UI changes, check at least:

- keyboard-only traversal
- focus visibility
- light/dark contrast
- 200% zoom/reflow behavior
- narrow mobile width
- reduced-motion mode
