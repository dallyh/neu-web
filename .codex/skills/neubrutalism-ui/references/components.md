# Component Rules

## Shared principles

A component should have one clear structural role. Use border, fill, and shadow deliberately rather than stacking all three at maximum strength by default.

Interactive components need default, hover, active, focus-visible, and disabled states where relevant.

## Button

Default anatomy:

- 3px border
- flat fill
- medium hard shadow
- bold heading/UI font
- minimum practical height around 44px for primary actions
- no large radius

Variants:

- primary: primary accent fill
- secondary: surface fill
- inverted: ink fill with background-colored text
- ghost: transparent/surface, border retained, shadow reduced or omitted
- danger: accent/error color with tested contrast

Hover: lift approximately 2px against shadow direction.
Active: move toward shadow and remove/reduce shadow.
Focus-visible: separate outline with positive outline-offset.

## Icon Button

- Actual hit target should be at least 40–44px when practical.
- Icon alone must have accessible name.
- Do not rely on oversized border to imply a larger target.

## Project Card

Required content hierarchy:

1. title
2. one-paragraph or one-sentence summary
3. role/status/year metadata
4. technology tags
5. clear action/link affordance
6. optional project image

Use medium shadow by default. Featured cards may use large shadow. Do not apply maximal shadow to every card.

Cards may use curated accent fills. Preserve readable text contrast.

## Article Card

Keep slightly calmer than project cards.

Prioritize:

- title
- date
- reading/topic metadata
- short excerpt
- tag(s)

Avoid making every article tile a different bright color.

## Badge / Tag

- small border: 2–3px
- small hard shadow optional
- mono or heading/UI font
- short text only
- pills are allowed only if explicitly chosen as a semantic chip pattern; square/near-square is preferred

## Navbar

Navigation can be visually strong but behavior must be conventional.

Requirements:

- visible current-page state
- keyboard accessible
- logo/name acts as home link
- mobile menu remains predictable
- no hover-only navigation

Use one strong structural border/shadow treatment rather than multiple competing effects.

## Mobile Menu

- open/close control has accessible name and state
- focus handling remains logical
- full-screen or framed panel is acceptable
- menu items remain large and easy to tap
- avoid complex overlaps on narrow screens

## Input / Textarea / Select

Forms use the design grammar at reduced intensity.

- 2–3px border
- no decorative heavy shadow by default; small or medium only when it clarifies interactivity
- square corners
- explicit label
- visible focus
- help/error text in addition to color
- sensible native/select behavior

Do not rotate, offset, or misalign form controls for style.

## Checkbox / Radio

Preserve clear selected state using shape/icon + color, not color alone.

Prefer custom styling only if keyboard and screen-reader behavior remains intact.

## Callout

Callouts can use an accent surface and border, but their internal text remains conventional.

Variants:

- info
- note
- warning
- success

Add icon/label so meaning is not color-only.

## Code Block

- mono font
- 2–3px border
- restrained background
- optional title bar / language label
- copy action with accessible label
- horizontal overflow instead of wrapping where code semantics would be harmed
- modest or no shadow inside long articles

## Timeline / CV Experience

Use clear chronology, not decorative complexity.

Each entry should expose:

- organization/client
- role
- date range
- location/engagement type if useful
- concise outcomes/responsibilities
- optional technologies

Desktop may use a visible grid/rail. Mobile should become a clean vertical flow.

## Dialog

Dialogs may use large shadow because they are overlays.

Requirements:

- focus trap/appropriate dialog semantics
- visible close action
- Escape behavior where expected
- background interaction blocked appropriately
- do not let decorative border consume focus indication

## Footer

Footer can be bold and graphic, but should remain simple:

- contact/CTA
- navigation
- social links
- copyright/meta
- optional build/stack note in mono
