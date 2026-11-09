# Design

The visual system for NIK Reader, recorded from the shipped code. Tokens live in `styles/globals.css`; Tailwind maps them in `tailwind.config.js`. UI is built from shadcn/ui components in `components/ui`.

## Direction contract

- Mode: Operate (the tool) on top of Read (the explainer content below it).
- World: KTP ink. A cool paper background, one ink-blue accent taken from the e-KTP, slate neutrals.
- The idea that belongs to this product: the NIK is the interface. The 16 digits always appear in their real groups (2·2·2·6·4), colored by meaning, in the reader, the generator preview, the explainer and the OG cards. Each decoded row carries the digits it came from in the same color.
- Light and dark follow the system.

## Color

| Role | Light | Dark | Use |
| --- | --- | --- | --- |
| `--background` | oklch(0.982 0.005 250) | oklch(0.17 0.02 262) | Page |
| `--card` | white | oklch(0.205 0.024 262) | Panels, inputs |
| `--foreground` | oklch(0.24 0.035 262) | oklch(0.95 0.008 250) | Text, every digit |
| `--muted-foreground` | oklch(0.5 0.03 258) | oklch(0.73 0.025 258) | Secondary text |
| `--primary` | oklch(0.45 0.16 258), #0850ab | oklch(0.74 0.12 254) | The one accent: primary action, active state, links, the mark |
| `--input` | oklch(0.64 0.035 256) | oklch(0.47 0.03 260) | Control edges, 3:1 on the card |
| `--success` / `--destructive` | green / red | lighter pair | Privacy note / errors |

Segment colors are the one stated exception to a single accent. They mark bars, dots, cell tints and digit chips, never text:

| Segment | Digits | Color |
| --- | --- | --- |
| Provinsi | 1–2 | deepest blue (= primary) |
| Kabupaten/kota | 3–4 | mid blue |
| Kecamatan | 5–6 | light blue |
| Tanggal lahir (and gender) | 7–12 | warm amber |
| Nomor urut | 13–16 | neutral slate |

Region is one hue in three steps because it is a hierarchy. Put `data-seg="<key>"` on an element and use `bg-seg`, `bg-seg/10`, `border-seg/40` inside it.

## Type

- Public Sans for interface and prose (`--font-sans`), JetBrains Mono for every digit (`--font-mono`). No third family.
- h1 2.125rem → 3rem (home) or 1.875rem → 2.5rem, bold, tracking -0.025em, balanced.
- h2 1.25rem → 1.375rem, semibold, tracking -0.015em.
- Body 1rem / 1.75, prose at 65ch, in `foreground/80`.
- All numbers use tabular figures.

## Shape and depth

- Radius scale: 6px (digit cells, chips, badges), 12px (buttons, inputs, comboboxes, toggles, tabs), 16px (panels). Mapped in `tailwind.config.js` so `rounded-md` = 6, `rounded-lg`/`rounded-xl` = 12, `rounded-2xl` = 16.
- Elevation is a 1px border. No shadows on panels or buttons; popovers and menus get one soft shadow.
- No gradients, no glass except the pinned generator preview on phones.

## Components

- `NikInput` / `NikReadout` (`components/nik/NikDigits.tsx`): the segmented field and its read-only twin. One real input underneath (input-otp). One row from `md`, region over person below that, so 16 cells fit 320px.
- `RegionCombobox`: Popover + Command, searchable by name or code.
- Tool panels are a `Card`; the home page puts `Tabs` in the card header.
- FAQ is an `Accordion` with force-mounted answers. Related pages are an `ItemGroup`.

## Motion

- One curve: `--ease-out` cubic-bezier(0.23, 1, 0.32, 1). Press feedback scale 0.97 at 150ms.
- Result rows enter as one wave under 300ms: row by row across both columns on desktop, top to bottom on phones.
- Nothing animates on a keystroke. Generator segment bars ease as picks land (200ms).
- Reduced motion: entrances become fades, popovers stop zooming, transforms snap.

## Copy

Bahasa Indonesia, "kamu", sentence case for controls. Controls name their action ("Baca NIK", "Pakai contoh NIK", "Acak"). The privacy line sits next to the field.

## Assets

- Icons: `scripts/generate-icons.py` (needs Chrome).
- OG cards: `scripts/og/template.html` rendered by `scripts/og/generate.sh` into `public/og/<page>.png`. The card title is the page's h1.
