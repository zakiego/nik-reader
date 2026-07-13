import Link from "next/link";
import { JsonLd } from "~/components/JsonLd";
import { Layout } from "~/components/Layout";
import { Seo } from "~/components/Seo";
import { ContentSection } from "~/components/content/ContentSection";
import { Faq } from "~/components/content/Faq";
import { NikAnatomy } from "~/components/content/NikAnatomy";
import { PageHero } from "~/components/content/PageHero";
import { Read } from "~/components/pages/Read";
import { ROUTES } from "~/lib/routes";
import {
  type Crumb,
  type FaqItem,
  type HowToStep,
  breadcrumbSchema,
  faqSchema,
  graph,
  howToSchema,
} from "~/lib/structured-data";

const meta = ROUTES.birthDate;

const CRUMBS: Crumb[] = [
  { name: "Beranda", path: ROUTES.home.path },
  { name: meta.navLabel, path: meta.path },
];

const STEPS: HowToStep[] = [
  {
    name: "Ambil digit ke-7 sampai ke-12",
    text: "Setelah 6 digit kode wilayah, ambil 6 angka berikutnya. Bagian inilah yang menyimpan tanggal lahir dalam format tanggal-bulan-tahun (DDMMYY).",
  },
  {
    name: "Baca dua digit tanggal",
    text: "Dua digit pertama adalah tanggal lahir. Jika angkanya lebih dari 40, kurangi 40. Angka di atas 40 menandakan pemiliknya perempuan.",
  },
  {
    name: "Baca dua digit bulan",
    text: "Dua digit berikutnya adalah bulan lahir, dari 01 (Januari) sampai 12 (Desember).",
  },
  {
    name: "Baca dua digit tahun",
    text: "Dua digit terakhir adalah tahun lahir. Karena hanya dua digit, abadnya (19xx atau 20xx) disimpulkan dari rentang tahun yang wajar.",
  },
];

const FAQ: FaqItem[] = [
  {
    q: "Bagaimana cara melihat tanggal lahir dari NIK?",
    a: "Masukkan 16 digit NIK pada kolom di atas dan tekan Baca. Tanggal lahir dihitung otomatis dari digit ke-7 sampai ke-12. Secara manual, ambil 6 angka setelah kode wilayah dan baca sebagai tanggal, bulan, lalu tahun.",
  },
  {
    q: "Kenapa tanggal lahir di NIK perempuan lebih dari 31?",
    a: "Untuk perempuan, tanggal lahir pada NIK sengaja ditambah 40. Jadi tanggal 5 tertulis 45, tanggal 12 tertulis 52. Kalau dua digit tanggalnya di atas 40, kurangi 40 untuk mendapat tanggal asli, dan itu artinya pemiliknya perempuan.",
  },
  {
    q: "Bagaimana cara membaca tanggal lahir NIK laki-laki?",
    a: "Untuk laki-laki, dua digit tanggal ditulis apa adanya tanpa ditambah 40. Jadi kalau tertulis 05, berarti tanggal 5 dan pemiliknya laki-laki.",
  },
  {
    q: "Apakah tahun lahir dari NIK selalu terbaca tepat?",
    a: "NIK hanya menyimpan 2 digit tahun, jadi abadnya ditebak dari rentang yang masuk akal (19xx atau 20xx). Untuk hampir semua kasus ini tepat, tapi untuk tahun di sekitar pergantian abad sebaiknya dicek ulang.",
  },
  {
    q: "Apakah tanggal lahir dari NIK pasti akurat?",
    a: "Tanggal lahir mengikuti data saat NIK diterbitkan. Selama data pendaftaran benar, hasilnya akurat. Alat ini hanya membaca angka yang sudah ada di dalam NIK.",
  },
];

export default function CekTanggalLahirDariNik() {
  return (
    <>
      <Seo
        titleFull={meta.seoTitle}
        description={meta.description}
        path={meta.path}
      />
      <JsonLd
        data={graph(
          breadcrumbSchema(CRUMBS),
          howToSchema({
            name: "Cara melihat tanggal lahir dari NIK",
            description: meta.description,
            steps: STEPS,
          }),
          faqSchema(FAQ),
        )}
      />

      <Layout currentPath={meta.path} breadcrumbs={CRUMBS}>
        <PageHero
          title={meta.h1}
          lead="Cara cek tanggal lahir dari NIK. Masukkan 16 digit NIK KTP untuk membaca tanggal lahir otomatis, lengkap dengan aturan +40 untuk perempuan."
          className="mt-6"
        />

        <div className="mt-8">
          <Read />
        </div>

        <ContentSection title="Cara melihat tanggal lahir dari NIK manual">
          <p>
            Tanggal lahir tersembunyi di digit ke-7 sampai ke-12 pada NIK.
            Berikut cara membacanya tanpa alat:
          </p>
          <ol className="list-decimal space-y-2 pl-5 marker:font-medium marker:text-faint">
            {STEPS.map((step) => (
              <li key={step.name}>
                <span className="font-medium text-content">{step.name}.</span>{" "}
                {step.text}
              </li>
            ))}
          </ol>
        </ContentSection>

        <ContentSection title="Perbedaan tanggal lahir laki-laki dan perempuan">
          <p>
            Inilah bagian yang paling sering membingungkan. Pada NIK, dua digit
            tanggal lahir menentukan jenis kelamin:
          </p>
          <ul className="list-disc space-y-1.5 pl-5 marker:text-faint">
            <li>
              <span className="font-medium text-content">Laki-laki:</span>{" "}
              tanggal ditulis apa adanya, 01 sampai 31.
            </li>
            <li>
              <span className="font-medium text-content">Perempuan:</span>{" "}
              tanggal ditambah 40, jadi 41 sampai 71. Kurangi 40 untuk tanggal
              aslinya.
            </li>
          </ul>
          <p>
            Contoh: NIK dengan tanggal <span className="font-mono">67</span>{" "}
            berarti lahir tanggal 27 (67 − 40) dan berjenis kelamin perempuan.
          </p>
        </ContentSection>

        <ContentSection title="Letak tanggal lahir di dalam NIK">
          <p>
            Bagian tanggal lahir (disorot hijau) berada tepat setelah kode
            wilayah:
          </p>
          <NikAnatomy highlight="birthDate" />
        </ContentSection>

        <Faq items={FAQ} />

        <p className="mt-10 text-sm text-muted">
          Ingin membaca seluruh bagian NIK, bukan cuma tanggal lahir? Gunakan{" "}
          <Link
            href={ROUTES.home.path}
            className="font-medium text-primary underline underline-offset-2 hover:text-primary-hover"
          >
            alat cek NIK lengkap
          </Link>
          .
        </p>
      </Layout>
    </>
  );
}
