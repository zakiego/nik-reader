import Link from "next/link";
import { JsonLd } from "~/components/JsonLd";
import { Layout } from "~/components/Layout";
import { Seo } from "~/components/Seo";
import { ContentSection } from "~/components/content/ContentSection";
import { Faq } from "~/components/content/Faq";
import { PageHero } from "~/components/content/PageHero";
import { Predict } from "~/components/pages/Predict";
import { ROUTES } from "~/lib/routes";
import {
  type Crumb,
  type FaqItem,
  breadcrumbSchema,
  faqSchema,
  graph,
  webApplicationSchema,
} from "~/lib/structured-data";

const meta = ROUTES.generator;

const CRUMBS: Crumb[] = [
  { name: "Beranda", path: ROUTES.home.path },
  { name: meta.navLabel, path: meta.path },
];

const FAQ: FaqItem[] = [
  {
    q: "Apa itu NIK generator?",
    a: "NIK generator adalah alat untuk membuat contoh NIK yang mengikuti struktur resmi: kode wilayah, tanggal lahir, dan jenis kelamin. Cocok untuk menguji formulir, belajar pola NIK, atau membuat data dummy.",
  },
  {
    q: "Apakah NIK hasil generator ini asli atau valid?",
    a: "Tidak. NIK yang dibuat hanya mengikuti pola, bukan nomor yang terdaftar di database kependudukan. Empat digit terakhirnya pun tidak bisa ditebak, jadi ini murni contoh.",
  },
  {
    q: "Untuk apa contoh NIK ini bisa dipakai?",
    a: "Untuk keperluan yang tidak melibatkan identitas asli: menguji validasi form, membuat data contoh saat coding, mockup desain, atau belajar bagaimana NIK disusun.",
  },
  {
    q: "Kenapa 4 digit terakhir ditampilkan sebagai xxxx?",
    a: "Empat digit terakhir adalah nomor urut pendaftaran yang diberikan sistem. Angka ini tidak mengikuti pola dan tidak bisa dibuat, jadi kami tandai xxxx.",
  },
  {
    q: "Bolehkah contoh NIK ini dipakai untuk mendaftar layanan resmi?",
    a: "Tidak. Menggunakan NIK palsu untuk layanan resmi atau untuk menyamar sebagai orang lain melanggar aturan. Alat ini hanya untuk testing dan edukasi.",
  },
];

export default function NikGenerator() {
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
          webApplicationSchema(),
          faqSchema(FAQ),
        )}
      />

      <Layout currentPath={meta.path} breadcrumbs={CRUMBS}>
        <PageHero
          title={meta.h1}
          lead="Buat contoh NIK online. Pilih wilayah, jenis kelamin, dan tanggal lahir, lalu NIK contoh terbentuk otomatis mengikuti struktur resmi. Untuk testing dan edukasi, bukan data asli."
          className="mt-6"
        />

        <div className="mt-8">
          <Predict />
        </div>

        <ContentSection title="Cara membuat contoh NIK">
          <ol className="list-decimal space-y-2 pl-5 marker:font-medium marker:text-faint">
            <li>Pilih provinsi, kabupaten/kota, dan kecamatan.</li>
            <li>Pilih jenis kelamin dan isi tanggal lahir.</li>
            <li>
              NIK contoh terbentuk otomatis di kartu pratinjau. Empat digit
              terakhir tetap <span className="font-mono">xxxx</span> karena
              tidak bisa ditebak.
            </li>
          </ol>
        </ContentSection>

        <ContentSection title="Catatan penting soal contoh NIK">
          <p>
            Contoh NIK di sini hanya meniru pola angka, bukan nomor yang benar-
            benar terdaftar. Gunakan dengan bijak:
          </p>
          <ul className="list-disc space-y-1.5 pl-5 marker:text-faint">
            <li>Cocok untuk data dummy, testing form, dan bahan belajar.</li>
            <li>
              Bukan pengganti NIK asli dan tidak akan lolos verifikasi resmi.
            </li>
            <li>
              Jangan dipakai untuk menyamar atau mendaftar atas nama orang lain.
            </li>
          </ul>
          <p>
            Penasaran cara kerja tiap digit? Baca panduan{" "}
            <Link
              href={ROUTES.guide.path}
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-hover"
            >
              cara membaca NIK
            </Link>{" "}
            atau{" "}
            <Link
              href={ROUTES.home.path}
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-hover"
            >
              cek NIK yang sudah ada
            </Link>
            .
          </p>
        </ContentSection>

        <Faq items={FAQ} />
      </Layout>
    </>
  );
}
