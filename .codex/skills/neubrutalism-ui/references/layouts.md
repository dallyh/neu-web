# Layout and Composition Rules

## Principle: structured disruption

Build a stable grid first. Break it selectively.

Expression belongs mostly at the macro level:

- hero blocks
- project grids
- large headings
- framed media
- section composition

Mechanical alignment belongs at the micro level:

- labels
- form controls
- buttons
- card metadata
- tables
- error messages

## Base shell

Suggested container strategy:

```css
.page-shell {
    width: min(100% - 2rem, 90rem);
    margin-inline: auto;
}
```

Use wider layouts for portfolio grids and narrower layouts for reading content.

## Responsive breakpoints

Use project/framework conventions; do not overfit to exact device models.

Behavioral ranges:

- small: single-column, reduced overlap
- medium: selective two-column compositions
- large: full asymmetric grid treatment

## Homepage

Suggested desktop composition:

- top navigation framed as a strong horizontal object
- hero split roughly 60/40 or deliberately asymmetric
- headline crosses normal scale boundaries, not semantic DOM order
- supporting card/status block may offset from primary grid
- featured projects use 2–3 column grid depending width

On mobile:

- stack hero content
- remove unnecessary overlap
- keep one strong visual device, not several

## Portfolio index

Use a grid that can vary card span for featured work.

Acceptable:

- one featured project spanning two columns
- smaller cards beneath
- controlled vertical offset

Avoid masonry that produces unpredictable reading order unless carefully implemented.

## Project detail

Recommended sequence:

1. project hero
2. facts/role/stack summary
3. problem/context
4. solution/work
5. screenshots/diagrams
6. implementation details
7. outcome/lessons
8. next project/navigation

After the hero, reduce decorative intensity and optimize for narrative reading.

## Blog index

Cards may form a two- or three-column grid on wide screens.

Keep article metadata consistent across cards so the expressive layout does not damage scanning.

## Blog article

Recommended article shell:

- expressive full-width or wide header
- narrow reading column
- optional side metadata/TOC only when it does not crowd text
- figures may break out wider than prose
- code/tables may use wide breakouts

Avoid full-page checkerboard/color-block treatment behind long prose.

## CV

Desktop can use two columns:

- main: experience/projects
- side: profile/skills/contact/education

Mobile becomes one clear chronological column.

Print layout should become conventional and high-density enough to be useful.

## Overlap rules

Overlap is allowed only when:

- reading order stays obvious
- interactive targets do not cover each other
- no content is clipped at common widths
- focus outlines remain visible

Do not use negative margins as the default spacing mechanism.

## Rotation rules

Small rotation can be used for decorative labels or noncritical badges.

Do not rotate:

- body copy
- form controls
- main navigation items
- data tables
- primary CTA buttons by default
