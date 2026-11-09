import { NikReadout } from "~/components/nik/NikDigits";
import { Card, CardContent } from "~/components/ui/card";
import {
  SAMPLE_NIK,
  SEGMENTS,
  type SegmentKey,
  digitRange,
  splitNik,
} from "~/lib/nik-segments";
import { cn } from "~/lib/utils";

const MEANING: Record<SegmentKey, string> = {
  provinsi: "Provinsi tempat NIK diterbitkan.",
  kabupaten: "Kabupaten atau kota di dalam provinsi itu.",
  kecamatan: "Kecamatan di dalam kabupaten/kota itu.",
  birthDate:
    "Tanggal, bulan dan tahun lahir. Khusus perempuan, tanggalnya ditambah 40, jadi 45 berarti tanggal 5.",
  urut: "Nomor urut pendaftaran. Ini yang membedakan orang dengan wilayah dan tanggal lahir yang sama, dan tidak bisa ditebak.",
};

/**
 * The 16 digits of a NIK taken apart, in the same cells and colors the reader
 * uses. Doubles as indexable content (the "arti 16 digit NIK" queries) and as
 * the target of the reader's "Arti tiap digit" link. The sample is fictional.
 */
export const NikAnatomy = ({ highlight }: { highlight?: SegmentKey }) => (
  <div id="arti-digit-nik" className="scroll-mt-6">
    <Card>
      <CardContent className="p-4 sm:p-6">
        <figure className="flex flex-col gap-3">
          <NikReadout
            digits={SAMPLE_NIK}
            label={`Contoh NIK ${splitNik(SAMPLE_NIK)}`}
            highlight={highlight}
          />
          <figcaption className="text-xs text-muted-foreground">
            Contoh fiktif, bukan NIK asli.
          </figcaption>
        </figure>
      </CardContent>
    </Card>

    <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
      {SEGMENTS.map((segment) => (
        <div
          key={segment.key}
          data-seg={segment.key}
          className={cn(
            "flex flex-col gap-1",
            segment.key === "urut" && "sm:col-span-2",
          )}
        >
          <dt className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <span aria-hidden="true" className="size-2 rounded-sm bg-seg" />
            {segment.name}
            <span className="font-mono text-xs font-normal text-muted-foreground">
              {digitRange(segment)}
            </span>
          </dt>
          <dd className="pl-4 text-sm leading-relaxed text-muted-foreground">
            {MEANING[segment.key]}
          </dd>
        </div>
      ))}
    </dl>
  </div>
);
