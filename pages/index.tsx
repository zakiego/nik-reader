import Link from "next/link";
import { JsonLd } from "~/components/JsonLd";
import { Layout } from "~/components/Layout";
import { NikTool } from "~/components/NikTool";
import { Seo } from "~/components/Seo";
import { ContentSection } from "~/components/content/ContentSection";
import { Faq } from "~/components/content/Faq";
import { NikAnatomy } from "~/components/content/NikAnatomy";
import { PageHero } from "~/components/content/PageHero";
import { ROUTES } from "~/lib/routes";
import {
  type FaqItem,
  authorSchema,
  faqSchema,
  graph,
  webApplicationSchema,
  websiteSchema,
} from "~/lib/structured-data";

const meta = ROUTES.home;

const FAQ: FaqItem[] = [
  {
    q: "Bagaimana cara cek NIK online?",
    a: "Ketik 16 digit NIK pada kolom di atas, lalu tekan tombol Baca. Detail seperti provinsi, kabupaten/kota, kecamatan, jenis kelamin, dan tanggal lahir langsung ditampilkan. Semua proses berjalan di browser kamu.",
  },
  {
    q: "Apakah cek NIK di sini gratis?",
    a: "Ya, sepenuhnya gratis dan tanpa perlu mendaftar. Kamu bisa cek NIK sebanyak yang kamu mau.",
  },
  {
    q: "Apakah NIK yang saya masukkan disimpan?",
    a: "Tidak. NIK dibaca hanya untuk menampilkan hasil dan tidak kami simpan di database mana pun.",
  },
  {
    q: "Apa saja yang bisa dilihat dari sebuah NIK?",
    a: "NIK memuat kode wilayah (provinsi, kabupaten/kota, kecamatan tempat KTP diterbitkan), tanggal lahir, jenis kelamin, dan nomor urut pendaftaran. Semua itu tersimpan di dalam 16 digit angkanya.",
  },
  {
    q: "Apakah bisa cek nama atau alamat lengkap dari NIK?",
    a: "Tidak. NIK tidak memuat nama, alamat jalan, atau nomor telepon pemiliknya. Untuk mencocokkan NIK dengan identitas resmi, itu hanya bisa dilakukan lewat Dukcapil/Disdukcapil. Alat ini hanya membaca struktur angkanya, bukan data kependudukan pemiliknya.",
  },
  {
    q: "Apakah alat ini bisa cek NIK KTP dari semua provinsi?",
    a: "Ya. Kode wilayah mencakup seluruh provinsi, kabupaten/kota, dan kecamatan di Indonesia, jadi NIK KTP dari daerah mana pun bisa dibaca.",
  },
];

export default function Home() {
  return (
    <>
      <Seo
        titleFull={meta.seoTitle}
        description={meta.description}
        path={meta.path}
      />
      <JsonLd
        data={graph(
          websiteSchema(),
          authorSchema(),
          webApplicationSchema(),
          faqSchema(FAQ),
        )}
      />

      <Layout currentPath={meta.path}>
        <PageHero
          kicker="Nomor Induk Kependudukan"
          size="lg"
          title={meta.h1}
          lead="Masukkan 16 digit NIK untuk membaca provinsi, kabupaten/kota, kecamatan, jenis kelamin, dan tanggal lahir. Contoh NIK juga dapat dibuat melalui tab Generate."
        />

        <div className="mt-8">
          <NikTool />
        </div>

        <ContentSection title="Arti 16 digit NIK">
          <p>
            Setiap NIK terdiri dari 16 digit yang tidak acak. Angka-angka itu
            menyimpan kode wilayah, tanggal lahir, jenis kelamin, dan nomor urut
            pendaftaran. Begini susunannya:
          </p>
          <NikAnatomy />
          <p>
            Penjelasan lengkap tiap bagian ada di panduan{" "}
            <Link
              href={ROUTES.guide.path}
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-hover"
            >
              cara membaca NIK
            </Link>
            .
          </p>
        </ContentSection>

        <ContentSection title="Cara memeriksa NIK">
          <ol className="list-decimal space-y-2 pl-5 marker:font-medium marker:text-faint">
            <li>Buka tab Baca, lalu ketik 16 digit NIK pada kolom input.</li>
            <li>
              Pastikan jumlah digit sudah 16 (penghitung berubah hijau saat
              lengkap).
            </li>
            <li>
              Tekan tombol Baca. Detail NIK langsung muncul di kartu hasil.
            </li>
          </ol>
          <p>
            Ingin fokus ke tanggal lahir? Lihat halaman{" "}
            <Link
              href={ROUTES.birthDate.path}
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-hover"
            >
              cek tanggal lahir dari NIK
            </Link>
            .
          </p>
        </ContentSection>

        <ContentSection title="Informasi yang tidak ada di NIK">
          <p>
            NIK memang bisa dibaca strukturnya, tapi ia tidak memuat identitas
            pribadi pemiliknya. Dari nomornya saja, kamu tidak bisa mengetahui:
          </p>
          <ul className="list-disc space-y-1.5 pl-5 marker:text-faint">
            <li>Nama pemilik NIK</li>
            <li>Alamat lengkap (jalan, RT/RW, nomor rumah)</li>
            <li>Nomor telepon atau data kontak</li>
            <li>Foto atau data KK</li>
          </ul>
          <p>
            Pencocokan NIK dengan identitas resmi hanya bisa dilakukan lewat
            layanan Dukcapil/Disdukcapil. Alat ini murni membaca pola angka
            untuk keperluan edukasi.
          </p>
        </ContentSection>

        <Faq items={FAQ} />
      </Layout>
    </>
  );
}
