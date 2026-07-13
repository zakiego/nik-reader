/**
 * Central site metadata used for SEO (titles, Open Graph, Twitter, canonical).
 * The absolute URL is env-driven so it can be set per deployment; the fallback
 * is a sensible default; override with NEXT_PUBLIC_SITE_URL in production.
 */
export const SITE = {
  name: "NIK Reader",
  title: "NIK Reader & Generator · Baca & Cek Detail NIK Online",
  tagline: "Baca & generate NIK Indonesia",
  description:
    "Baca NIK (Nomor Induk Kependudukan) untuk melihat provinsi, kabupaten/kota, kecamatan, jenis kelamin, dan tanggal lahir, atau generate contoh NIK. Gratis, cepat, langsung di browser.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nik.zakiego.com",
  locale: "id_ID",
  author: "Zakiego",
  authorUrl: "https://zakiego.com",
  twitter: "@zakiego",
  /** Used for Article structured data (dates the guide content is valid for). */
  datePublished: "2024-01-01",
  dateModified: "2026-01-01",
  keywords: [
    "NIK",
    "cek NIK",
    "cek NIK online",
    "cek NIK KTP",
    "baca NIK",
    "cek tanggal lahir dari NIK",
    "cara membaca NIK",
    "generate NIK",
    "NIK generator",
    "Nomor Induk Kependudukan",
    "arti NIK",
    "KTP",
    "provinsi kabupaten kecamatan",
  ],
} as const;
