# Design

The visual system for NIK Reader. Tokens live in `styles/globals.css`; Tailwind maps them in `tailwind.config.js`. UI is built from shadcn/ui components in `components/ui`.

## Direction

- KISS. One plain input, one button, the shortest labels that work. No helper paragraphs, instruction lists or demo buttons in the tools.
- Mono: warm white, near-black and warm grays. No accent color. The primary action is black (white in dark mode); color is only for errors.
- Light and dark follow the system.

## Color

| Role | Light | Dark |
| --- | --- | --- |
| `--background` | #fafaf9 | #0c0a09 |
| `--card` | white | #1c1917 |
| `--foreground` / `--primary` | #1c1917 | #fafaf9 |
| `--muted-foreground` | #78716c | #a8a29e |
| `--border` | #e7e5e4 | #292524 |
| `--input` | 3:1 against the card | 3:1 against the card |
| `--destructive` | red-600 | red-400 |

## Type

- Public Sans for interface and prose, JetBrains Mono for every NIK and digit. No third family.
- h1 bold, tracking -0.025em, balanced. Body 1rem / 1.75, prose at 65ch.
- All numbers use tabular figures.

## Shape and depth

- Radius scale: 6px (chips, badges), 12px (buttons, inputs, comboboxes, toggles, tabs), 16px (panels).
- Elevation is a 1px border. No shadows on panels or buttons; popovers and menus get one soft shadow. No gradients.

## Components

- Reader: `InputGroup` with the NIK as one mono string, a digit counter and a clear button, then "Baca NIK". The result is one bordered list: label, value, source digits.
- Generator: the NIK as one mono line (unknown digits as a faint dot), "Acak" and "Salin", then region comboboxes (Popover + Command), a gender toggle and a date input.
- Tool panels are a `Card`; the home page puts `Tabs` in the card header.
- FAQ is an `Accordion` with force-mounted answers. Related pages are an `ItemGroup`.

## Motion

- One curve: cubic-bezier(0.23, 1, 0.32, 1). Press feedback scale 0.97 at 150ms.
- Result rows enter as one quick wave, done under 300ms. Nothing animates on a keystroke.
- Reduced motion: entrances become fades, popovers stop zooming.

## Copy

Bahasa Indonesia, sentence case, as short as possible. Controls name their action ("Baca NIK", "Acak", "Salin").

## Assets

- Icons: `scripts/generate-icons.py` (needs Chrome).
- OG cards: `scripts/og/template.html` rendered by `scripts/og/generate.sh` into `public/og/<page>.png`. The card title is the page's h1.
