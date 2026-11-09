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
    a: "Ketik atau tempel 16 digit NIK pada kolom di atas. Begitu digit ke-16 masuk, detail seperti provinsi, kabupaten/kota, kecamatan, jenis kelamin, dan tanggal lahir langsung ditampilkan. Semua proses berjalan di browser kamu.",
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
        ogImage={meta.ogImage}
        ogHeading={meta.h1}
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
          size="lg"
          title={meta.h1}
          lead="Lihat provinsi, kota, kecamatan, jenis kelamin, dan tanggal lahir dari NIK."
        />

        <div className="mt-8">
          <NikTool />
        </div>

        <ContentSection title="Arti 16 digit NIK">
          <p>16 digit NIK tersusun seperti ini:</p>
          <NikAnatomy />
          <p>
            Penjelasan lengkap tiap bagian ada di panduan{" "}
            <Link href={ROUTES.guide.path}>cara membaca NIK</Link>.
          </p>
        </ContentSection>

        <ContentSection title="Informasi yang tidak ada di NIK">
          <p>
            NIK memang bisa dibaca strukturnya, tapi ia tidak memuat identitas
            pribadi pemiliknya. Dari nomornya saja, kamu tidak bisa mengetahui:
          </p>
          <ul>
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
