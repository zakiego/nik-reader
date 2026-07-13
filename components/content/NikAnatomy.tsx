/**
 * Visual breakdown of the 16 digits of a NIK. Doubles as indexable content (the
 * "arti 16 digit NIK" queries) and an at-a-glance explainer for the tool. The
 * sample NIK is fictional and only illustrates the structure.
 */

type SegmentKey = "provinsi" | "kabupaten" | "kecamatan" | "birthDate" | "urut";

interface Segment {
  key: SegmentKey;
  digits: string;
  label: string;
  meaning: string;
  /** Tailwind classes for the chip + legend dot. */
  chip: string;
  dot: string;
}

// Fictional sample: 32 04 21 | 45 01 90 | 0001
// 32=provinsi, 04=kab/kota, 21=kecamatan, 450190=tanggal lahir (perempuan,
// tanggal 05 karena +40), 0001=nomor urut.
const SEGMENTS: Segment[] = [
  {
    key: "provinsi",
    digits: "32",
    label: "Kode Provinsi",
    meaning: "2 digit pertama menunjukkan provinsi tempat NIK diterbitkan.",
    chip: "bg-blue-50 text-blue-700 ring-blue-600/20",
    dot: "bg-blue-500",
  },
  {
    key: "kabupaten",
    digits: "04",
    label: "Kode Kabupaten / Kota",
    meaning: "Digit 3-4 adalah kode kabupaten atau kota.",
    chip: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
    dot: "bg-indigo-500",
  },
  {
    key: "kecamatan",
    digits: "21",
    label: "Kode Kecamatan",
    meaning: "Digit 5-6 adalah kode kecamatan.",
    chip: "bg-violet-50 text-violet-700 ring-violet-600/20",
    dot: "bg-violet-500",
  },
  {
    key: "birthDate",
    digits: "450190",
    label: "Tanggal Lahir (DDMMYY)",
    meaning:
      "Digit 7-12 adalah tanggal lahir: tanggal, bulan, tahun. Khusus perempuan, tanggalnya ditambah 40 (contoh 45 berarti tanggal 5).",
    chip: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    dot: "bg-emerald-500",
  },
  {
    key: "urut",
    digits: "0001",
    label: "Nomor Urut",
    meaning:
      "Digit 13-16 adalah nomor urut pendaftaran. Ini yang membedakan orang dengan wilayah dan tanggal lahir yang sama, dan tidak bisa ditebak.",
    chip: "bg-amber-50 text-amber-700 ring-amber-600/20",
    dot: "bg-amber-500",
  },
];

export const NikAnatomy = ({ highlight }: { highlight?: SegmentKey }) => {
  return (
    <div>
      {/* Readout */}
      <div className="rounded-2xl border border-line bg-surface-2 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
          {SEGMENTS.map((seg) => {
            const dimmed = highlight && highlight !== seg.key;
            return (
              <span
                key={seg.key}
                className={`tabular inline-flex items-center rounded-lg px-2.5 py-1.5 font-mono text-base font-semibold tracking-[0.15em] ring-1 transition-opacity ${
                  seg.chip
                } ${dimmed ? "opacity-40" : ""} ${
                  highlight === seg.key ? "ring-2" : ""
                }`}
              >
                {seg.digits}
              </span>
            );
          })}
        </div>
        <p className="mt-3 text-center text-xs text-faint">
          Contoh ilustrasi. Bukan NIK asli.
        </p>
      </div>

      {/* Legend */}
      <dl className="mt-5 space-y-4">
        {SEGMENTS.map((seg) => (
          <div
            key={seg.key}
            className={`flex gap-3 ${
              highlight && highlight !== seg.key ? "opacity-60" : ""
            }`}
          >
            <span
              className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${seg.dot}`}
              aria-hidden="true"
            />
            <div>
              <dt className="text-sm font-semibold text-content">
                {seg.label}{" "}
                <span className="tabular font-mono text-xs font-medium text-muted">
                  ({seg.digits})
                </span>
              </dt>
              <dd className="mt-0.5 text-sm leading-relaxed text-muted">
                {seg.meaning}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
};
