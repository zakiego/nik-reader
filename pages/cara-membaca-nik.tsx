import Link from "next/link";
import { JsonLd } from "~/components/JsonLd";
import { Layout } from "~/components/Layout";
import { Seo } from "~/components/Seo";
import { ContentSection } from "~/components/content/ContentSection";
import { Faq } from "~/components/content/Faq";
import { NikAnatomy } from "~/components/content/NikAnatomy";
import { PageHero } from "~/components/content/PageHero";
import { ROUTES } from "~/lib/routes";
import {
  type Crumb,
  type FaqItem,
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  graph,
} from "~/lib/structured-data";

const meta = ROUTES.guide;

const CRUMBS: Crumb[] = [
  { name: "Beranda", path: ROUTES.home.path },
  { name: meta.navLabel, path: meta.path },
];

const FAQ: FaqItem[] = [
  {
    q: "Apa kepanjangan NIK?",
    a: "NIK adalah singkatan dari Nomor Induk Kependudukan, yaitu nomor identitas tunggal setiap penduduk Indonesia yang tercantum di KTP dan Kartu Keluarga.",
  },
  {
    q: "Berapa jumlah digit NIK?",
    a: "NIK terdiri dari 16 digit angka. Susunannya: 6 digit kode wilayah, 6 digit tanggal lahir, dan 4 digit nomor urut.",
  },
  {
    q: "Apakah NIK sama dengan nomor KK?",
    a: "Berbeda. NIK bersifat pribadi dan melekat pada satu orang, sedangkan nomor Kartu Keluarga (KK) mewakili satu keluarga. Keduanya sama-sama 16 digit tapi maknanya berbeda.",
  },
  {
    q: "Apakah NIK bisa berubah?",
    a: "Tidak. NIK diberikan sekali saat pendaftaran dan berlaku seumur hidup, bahkan tidak berubah meskipun pemiliknya pindah domisili.",
  },
  {
    q: "Apakah NIK sama dengan NIK KTP?",
    a: "Sama. NIK KTP hanya cara lain menyebut NIK, yaitu 16 digit angka yang tercetak pada KTP elektronik.",
  },
];

export default function CaraMembacaNik() {
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
          articleSchema({
            title: meta.seoTitle,
            description: meta.description,
            path: meta.path,
          }),
          faqSchema(FAQ),
        )}
      />

      <Layout currentPath={meta.path} breadcrumbs={CRUMBS}>
        <PageHero
          title={meta.h1}
          lead="Pahami arti setiap bagian dari 16 digit Nomor Induk Kependudukan, dari kode wilayah sampai tanggal lahir dan jenis kelamin."
          className="mt-5"
        />

        <ContentSection title="Apa itu NIK?" className="mt-10">
          <p>
            NIK atau Nomor Induk Kependudukan adalah nomor identitas tunggal
            setiap penduduk Indonesia. Nomor ini terdiri dari 16 digit,
            diberikan sekali saat pendaftaran, dan berlaku seumur hidup. NIK
            tercantum di KTP elektronik dan Kartu Keluarga.
          </p>
          <p>
            Yang menarik, 16 digit itu tidak dibuat acak. Setiap kelompok angka
            punya arti tersendiri, sehingga NIK bisa dibaca untuk mengetahui
            wilayah, tanggal lahir, dan jenis kelamin pemiliknya.
          </p>
        </ContentSection>

        <ContentSection title="Struktur 16 digit NIK">
          <p>Secara ringkas, NIK dibagi menjadi tiga bagian besar:</p>
          <NikAnatomy />
        </ContentSection>

        <ContentSection title="1. Kode wilayah (digit 1-6)">
          <p>
            Enam digit pertama adalah kode wilayah tempat NIK diterbitkan,
            mengikuti data wilayah administratif:
          </p>
          <ul className="list-disc space-y-1.5 pl-5 marker:text-faint">
            <li>Digit 1-2: kode provinsi.</li>
            <li>Digit 3-4: kode kabupaten atau kota.</li>
            <li>Digit 5-6: kode kecamatan.</li>
          </ul>
          <p>
            Kode ini menunjukkan wilayah saat KTP dibuat, yang biasanya sama
            dengan domisili waktu itu. Jadi kode wilayah bukan alamat rumah,
            melainkan daerah pendaftaran.
          </p>
        </ContentSection>

        <ContentSection title="2. Tanggal lahir & jenis kelamin (digit 7-12)">
          <p>
            Enam digit berikutnya adalah tanggal lahir dengan format
            tanggal-bulan-tahun (DDMMYY). Di sinilah jenis kelamin ikut
            tersimpan:
          </p>
          <ul className="list-disc space-y-1.5 pl-5 marker:text-faint">
            <li>Laki-laki: tanggal ditulis apa adanya (01-31).</li>
            <li>Perempuan: tanggal ditambah 40 (41-71).</li>
          </ul>
          <p>
            Pelajari lebih detail di halaman{" "}
            <Link
              href={ROUTES.birthDate.path}
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-hover"
            >
              cek tanggal lahir dari NIK
            </Link>
            .
          </p>
        </ContentSection>

        <ContentSection title="3. Nomor urut (digit 13-16)">
          <p>
            Empat digit terakhir adalah nomor urut pendaftaran yang diberikan
            komputer. Nomor ini membedakan dua orang yang kebetulan punya kode
            wilayah dan tanggal lahir yang sama. Karena diberikan sistem, empat
            digit ini tidak mengikuti pola dan tidak bisa ditebak.
          </p>
        </ContentSection>

        <ContentSection title="Yang tidak tercantum di dalam NIK">
          <p>
            Meskipun bisa dibaca, NIK tidak memuat identitas pribadi. Dari
            angkanya saja, kamu tidak bisa mengetahui nama, alamat lengkap,
            nomor telepon, atau data keluarga pemiliknya. Untuk mencocokkan NIK
            dengan identitas resmi, itu hanya bisa dilakukan lewat layanan
            Dukcapil/Disdukcapil.
          </p>
          <p>
            Sudah paham strukturnya? Coba langsung{" "}
            <Link
              href={ROUTES.home.path}
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-hover"
            >
              cek NIK
            </Link>{" "}
            atau{" "}
            <Link
              href={ROUTES.generator.path}
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-hover"
            >
              buat contoh NIK
            </Link>{" "}
            sendiri.
          </p>
        </ContentSection>

        <Faq items={FAQ} />
      </Layout>
    </>
  );
}
