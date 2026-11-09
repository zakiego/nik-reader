# Product

<!-- impeccable:product-schema 1 -->

<!-- Written from the repository and the 2026-11 redesign brief. Facts marked
     (inferred) came from the code and copy, not from an interview. -->

## Platform

web

## Users

People in Indonesia who need to make sense of a 16-digit NIK (Nomor Induk Kependudukan), mostly arriving from Google searches like "cek NIK", "cek tanggal lahir dari NIK" or "nik generator", mostly on phones (inferred). Three jobs: checking what a NIK on a form says (admin and HR staff), getting a correctly structured sample NIK for testing (developers), and understanding how the number is built (curious readers). Many don't want to type a real NIK.

## Product Purpose

Decode a NIK into province, regency/city, district, gender and birth date, show which digits each answer came from, and build sample NIKs from a chosen region, gender and birth date. Success is a visitor understanding their number in one paste, without sending it anywhere.

## Positioning

It reads the structure of the number only, in the browser. It never looks up a person, never claims a NIK is valid or registered, and never stores or sends the NIK (analytics strips anything NIK-shaped).

## Capabilities and Constraints

- Reading runs client-side against region data bundled as a lazy chunk (`lib/region-client`, `utils/read`); `lib/region` must not be imported from client components.
- The last four digits (nomor urut) can't be decoded or generated.
- Birth year is two digits, so the century is inferred; ages under 17 get a second reading.
- A woman's birth day is stored plus 40.
- Deployed to Cloudflare Pages at nik.zakiego.com; Umami goals depend on the event names in `lib/analytics.ts`.

## Brand Commitments

- Name: NIK Reader. Mark: the ID-card glyph on a KTP-blue tile (`components/site/BrandMark.tsx`, `scripts/generate-icons.py`).
- Copy is Bahasa Indonesia, informal "kamu".
- Must not imitate Dukcapil or any government branding.

## Evidence on Hand

No testimonials, usage numbers or partners. Don't invent any. The sample NIK (`SAMPLE_NIK`) is fictional and labelled as such wherever it appears.

## Product Principles

1. The NIK is the interface: show the digits in their real groups and tie every answer to its digits.
2. Privacy is a feature you can see: say where the number goes (nowhere) next to the field.
3. Explain, don't verify: never imply a NIK is real, valid or belongs to someone.
4. A phone with one thumb is the main device.

## Accessibility & Inclusion

WCAG 2.2 AA. The NIK field is one real input for screen readers; result rows read as a description list; reduced motion keeps fades and drops movement.
