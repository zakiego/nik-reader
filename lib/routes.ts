/**
 * Central registry of the site's indexable pages. Drives the sitemap, the
 * internal "related pages" links, breadcrumbs, and per-page SEO metadata so
 * every surface stays in sync from a single source of truth.
 */
export type IconKey = "search" | "calendar" | "sparkles" | "book";

export interface RouteMeta {
  /** Path portion of the URL, e.g. "/" or "/nik-generator". */
  path: string;
  /** Full <title> tag content (site name already included where wanted). */
  seoTitle: string;
  /** Visible page heading (exactly one <h1> per page). */
  h1: string;
  /** Meta description + Open Graph description. */
  description: string;
  /** Short label used for internal links and breadcrumbs. */
  navLabel: string;
  /** Compact label used in the top navigation pills. */
  navShort: string;
  /** One-line blurb shown on related-page cards. */
  navBlurb: string;
  /** Icon shown on nav feature cards (resolved in the UI layer). */
  iconKey: IconKey;
  /** Sitemap hints. */
  priority: number;
  changefreq: "daily" | "weekly" | "monthly";
}

export const ROUTES = {
  home: {
    path: "/",
    seoTitle: "Cek NIK Online: Baca & Cek Detail NIK KTP | NIK Reader",
    h1: "Baca dan Periksa NIK",
    description:
      "Cek NIK online gratis. Baca 16 digit NIK KTP untuk melihat provinsi, kabupaten/kota, kecamatan, jenis kelamin, dan tanggal lahir langsung di browser.",
    navLabel: "Baca & Periksa NIK",
    navShort: "Cek NIK",
    navBlurb: "Baca & cek detail dari 16 digit NIK KTP.",
    iconKey: "search",
    priority: 1.0,
    changefreq: "weekly",
  },
  birthDate: {
    path: "/cek-tanggal-lahir-dari-nik",
    seoTitle: "Cek Tanggal Lahir dari NIK Online (Laki-laki & Perempuan)",
    h1: "Membaca Tanggal Lahir dari NIK",
    description:
      "Cara cek tanggal lahir dari NIK online. Baca tanggal lahir dari 16 digit NIK KTP, termasuk aturan +40 untuk perempuan. Gratis dan langsung di browser.",
    navLabel: "Tanggal Lahir dari NIK",
    navShort: "Tanggal Lahir",
    navBlurb: "Lihat tanggal lahir dari NIK, termasuk aturan perempuan.",
    iconKey: "calendar",
    priority: 0.9,
    changefreq: "weekly",
  },
  generator: {
    path: "/nik-generator",
    seoTitle: "NIK Generator: Buat Contoh NIK & KTP Online Gratis",
    h1: "Generator NIK",
    description:
      "NIK generator online untuk membuat contoh NIK dan KTP dummy. Buat NIK acak untuk keperluan testing dan edukasi. Bukan data asli, gratis, tanpa disimpan.",
    navLabel: "Generator NIK",
    navShort: "Generator",
    navBlurb: "Buat contoh NIK acak untuk testing & edukasi.",
    iconKey: "sparkles",
    priority: 0.8,
    changefreq: "weekly",
  },
  guide: {
    path: "/cara-membaca-nik",
    seoTitle: "Cara Membaca NIK: Arti 16 Digit Nomor Induk Kependudukan",
    h1: "Panduan Membaca NIK",
    description:
      "Panduan lengkap cara membaca NIK. Pahami arti 16 digit Nomor Induk Kependudukan: kode wilayah, tanggal lahir, jenis kelamin, dan nomor urut.",
    navLabel: "Panduan Membaca NIK",
    navShort: "Panduan",
    navBlurb: "Arti tiap bagian dari 16 digit NIK.",
    iconKey: "book",
    priority: 0.7,
    changefreq: "monthly",
  },
} satisfies Record<string, RouteMeta>;

export const ALL_ROUTES: RouteMeta[] = Object.values(ROUTES);
