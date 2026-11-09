import { SAMPLE_NIK, SEGMENTS, type SegmentKey } from "~/lib/nik-segments";
import { cn } from "~/lib/utils";

const MEANING: Record<SegmentKey, string> = {
  provinsi: "Provinsi tempat NIK dibuat.",
  kabupaten: "Kabupaten atau kota.",
  kecamatan: "Kecamatan di kabupaten/kota itu.",
  birthDate: "Format DDMMYY. Perempuan: tanggal ditambah 40 (45 = tanggal 5).",
  urut: "Nomor urut pendaftaran. Tidak bisa ditebak.",
};

/**
 * The 16 digits of a NIK, part by part, using a fictional sample. Doubles as
 * indexable content for the "arti 16 digit NIK" queries.
 */
export const NikAnatomy = ({ highlight }: { highlight?: SegmentKey }) => (
  <div id="arti-digit-nik" className="scroll-mt-6">
    <p className="font-mono text-lg font-medium tracking-wider">{SAMPLE_NIK}</p>
    <dl className="mt-3 divide-y border-y">
      {SEGMENTS.map((segment) => (
        <div
          key={segment.key}
          className={cn(
            "grid grid-cols-[5rem_1fr] gap-x-4 py-3 sm:grid-cols-[6.5rem_1fr]",
            highlight === segment.key && "-mx-3 rounded-lg bg-muted px-3",
          )}
        >
          <dt className="font-mono font-medium tracking-wider">
            {SAMPLE_NIK.slice(segment.start, segment.end)}
          </dt>
          <dd>
            <span className="block font-medium text-foreground">
              {segment.name}
            </span>
            <span className="block text-sm text-muted-foreground">
              {MEANING[segment.key]}
            </span>
          </dd>
        </div>
      ))}
    </dl>
    <p className="mt-2 text-xs text-muted-foreground">Contoh fiktif.</p>
  </div>
);
