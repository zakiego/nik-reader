import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  ArrowDownIcon,
  CheckIcon,
  CircleAlertIcon,
  CopyIcon,
  RotateCcwIcon,
  SearchIcon,
  ShieldCheckIcon,
  XIcon,
} from "lucide-react";
import {
  type CSSProperties,
  type ReactNode,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { NikInput } from "~/components/nik/NikDigits";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "~/components/ui/empty";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "~/components/ui/field";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { Spinner } from "~/components/ui/spinner";
import { track } from "~/lib/analytics";
import { copyText } from "~/lib/clipboard";
import { NIK_LENGTH } from "~/lib/const";
import { type NikInput as NikValues, nikSchema } from "~/lib/nik-schema";
import {
  SAMPLE_NIK,
  SEGMENTS,
  type SegmentKey,
  digitRange,
  segmentAt,
  splitNik,
} from "~/lib/nik-segments";
import { cn } from "~/lib/utils";
import { getBirthDateDetails } from "~/utils/extract";
import { type ExtractedNik, extractDataFromNIK } from "~/utils/read";

/** Id of the NIK anatomy explainer that sits below the tool on every page using it. */
const ANATOMY_ID = "arti-digit-nik";

/** KTP is issued at 17, so a younger 2000s reading is worth a second look. */
const KTP_AGE = 17;

/**
 * A read is near-instant once the region chunk is cached, so loading UI only
 * shows after this long. Anything faster would just flash.
 */
const LOADING_DELAY_MS = 150;

export const Read = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  // Set when a button started the read (sample, retry): that button is about
  // to disappear, so focus has to land somewhere on purpose.
  const moveFocusAfterRead = useRef(false);

  /**
   * Brings the result into view once a read settles. On a phone the rows land
   * below the fold (often under the keyboard), so the heading takes focus,
   * which closes the keyboard, and scrolls to the top of the screen. When the
   * result is already in view and the read came from typing, focus stays in
   * the field.
   */
  const revealResult = () => {
    const force = moveFocusAfterRead.current;
    moveFocusAfterRead.current = false;
    requestAnimationFrame(() => {
      const heading = headingRef.current;
      if (!heading) return;
      const viewport = window.visualViewport;
      const bottom = viewport
        ? viewport.offsetTop + viewport.height
        : window.innerHeight;
      const offscreen = heading.getBoundingClientRect().top > bottom - 120;
      if (!force && !offscreen) return;
      heading.focus({ preventScroll: true });
      if (offscreen) {
        const reduce = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        heading.scrollIntoView({
          block: "start",
          behavior: reduce ? "auto" : "smooth",
        });
      }
    });
  };
  const form = useForm<NikValues>({
    resolver: zodResolver(nikSchema),
    defaultValues: { nik: "" },
    mode: "onTouched",
  });

  // Reading a NIK is a pure lookup, so it runs here in the browser. The region
  // datasets it needs arrive as a lazy chunk on first read; keeping this off the
  // server is what stops every read from costing a Pages Function invocation.
  const readNIK = useMutation({
    mutationFn: (values: NikValues) => extractDataFromNIK(values.nik),
    // Analytics gets the names of the fields that didn't decode, never the
    // decoded values, so a stale region dataset shows up without the NIK.
    onSuccess: (result) => {
      const missing = Object.entries(result)
        .filter(([, value]) => value === null)
        .map(([field]) => field);
      track("nik-read", { missing: missing.join(",") || "none" });
    },
    onError: (error) => {
      track("nik-read-error", {
        error: error instanceof Error ? error.name : "unknown",
      });
    },
    onSettled: revealResult,
  });

  const isLoading = useDelayedFlag(readNIK.isLoading, LOADING_DELAY_MS);
  const readNik = readNIK.variables?.nik;
  const value = useWatch({ control: form.control, name: "nik" });
  // Segments of the NIK on screen that didn't decode, marked in the field.
  const invalidSegments =
    readNIK.data && readNik === value
      ? findIssues(value, readNIK.data).map((issue) => issue.segment)
      : [];

  // The 16th digit reads the NIK, whether it was typed, pasted or filled in from
  // the sample. A failed read waits for "Coba lagi" instead of looping.
  // biome-ignore lint/correctness/useExhaustiveDependencies: only a new complete value should trigger a read
  useEffect(() => {
    if (
      value.length === NIK_LENGTH &&
      value !== readNik &&
      !readNIK.isLoading
    ) {
      readNIK.mutate({ nik: value });
    }
  }, [value]);

  const onSubmit = form.handleSubmit(
    (values) => {
      if (!readNIK.isLoading) readNIK.mutate(values);
    },
    () => inputRef.current?.focus(),
  );

  const clearAll = () => {
    readNIK.reset();
    form.reset({ nik: "" });
    inputRef.current?.focus();
  };

  const fillSample = () => {
    track("nik-sample");
    moveFocusAfterRead.current = true;
    form.setValue("nik", SAMPLE_NIK, { shouldValidate: true });
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <Controller
          name="nik"
          control={form.control}
          render={({ field, fieldState, formState }) => {
            const length = field.value.length;
            const remaining = NIK_LENGTH - length;
            const next = segmentAt(length);
            // Stay quiet while the field is empty and no submit happened,
            // so tabbing past it doesn't shout.
            const showError =
              fieldState.invalid && (length > 0 || formState.isSubmitted);

            return (
              <Field data-invalid={showError || undefined} className="gap-3">
                <FieldLabel htmlFor="nik-input">
                  Nomor Induk Kependudukan
                </FieldLabel>
                <NikInput
                  ref={(element) => {
                    field.ref(element);
                    inputRef.current = element;
                  }}
                  id="nik-input"
                  name={field.name}
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={(digits) => {
                    field.onChange(digits);
                    // A result for a different NIK is stale, so drop it.
                    if (readNik !== undefined && digits !== readNik) {
                      readNIK.reset();
                    }
                  }}
                  enterKeyHint="search"
                  aria-invalid={showError}
                  aria-describedby="nik-hint"
                  readOnly={readNIK.isLoading}
                  invalidSegments={invalidSegments}
                />
                {showError ? (
                  <FieldError id="nik-hint" role={undefined}>
                    {length === 0
                      ? "Masukkan 16 digit NIK dulu."
                      : `NIK harus 16 digit, kurang ${remaining} lagi.`}
                  </FieldError>
                ) : (
                  <FieldDescription id="nik-hint" className="min-h-5">
                    {length === 0
                      ? "Ketik atau tempel NIK. Spasi dan tanda baca dibuang otomatis."
                      : next
                        ? `${digitRange(next)}: ${
                            next.hint
                          }. ${length} dari 16 digit.`
                        : "16 digit lengkap."}
                  </FieldDescription>
                )}
              </Field>
            );
          }}
        />

        <div className="flex flex-col gap-2 min-[400px]:flex-row">
          <Button
            type="submit"
            size="lg"
            className="min-[400px]:min-w-44"
            // aria-disabled, not disabled: disabling the focused button would
            // drop keyboard focus to <body> right as the result lands.
            aria-disabled={readNIK.isLoading}
          >
            {isLoading ? (
              <>
                <Spinner data-icon="inline-start" aria-hidden="true" />
                Membaca…
              </>
            ) : (
              <>
                <SearchIcon data-icon="inline-start" aria-hidden="true" />
                Baca NIK
              </>
            )}
          </Button>
          {/* One slot: a way in while the field is empty, a way out after. */}
          {value.length > 0 ? (
            <Button type="button" variant="ghost" size="lg" onClick={clearAll}>
              <XIcon data-icon="inline-start" aria-hidden="true" />
              Kosongkan
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={fillSample}
            >
              Pakai contoh NIK
            </Button>
          )}
        </div>

        <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
          <ShieldCheckIcon
            aria-hidden="true"
            className="mt-px size-4 shrink-0 text-success"
          />
          Dibaca di browser kamu. NIK tidak dikirim ke server dan tidak
          disimpan.
        </p>
      </form>

      <Separator />

      <Result
        headingRef={headingRef}
        nik={readNik}
        data={readNIK.data}
        isLoading={isLoading}
        isError={readNIK.isError}
        onRetry={() => {
          if (!readNik) return;
          moveFocusAfterRead.current = true;
          readNIK.mutate({ nik: readNik });
        }}
        onReset={clearAll}
        onFix={(start) => {
          const input = inputRef.current;
          if (!input) return;
          input.focus({ preventScroll: true });
          input.setSelectionRange(start, start + 1);
          input.scrollIntoView({ block: "center" });
        }}
      />
    </div>
  );
};

const Result = ({
  headingRef,
  nik,
  data,
  isLoading,
  isError,
  onRetry,
  onReset,
  onFix,
}: {
  headingRef: RefObject<HTMLHeadingElement>;
  nik: string | undefined;
  data: ExtractedNik | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onReset: () => void;
  /** Puts the caret on the first digit of a segment that didn't decode. */
  onFix: (start: number) => void;
}) => {
  const hasResult = !!data && !!nik && !isLoading;
  const rowsRef = useRef<HTMLDivElement>(null);
  const issues = hasResult ? findIssues(nik, data) : [];

  // One short, always-rendered status line for screen readers, instead of a
  // live region that would read out every row.
  const status = isLoading
    ? "Membaca NIK…"
    : hasResult
      ? `Hasil untuk NIK ${splitNik(nik)} sudah tampil${
          issues.length > 0 ? ", sebagian tidak terbaca" : ""
        }.`
      : isError
        ? "Gagal membaca NIK."
        : "";

  return (
    <section aria-labelledby="result-heading" aria-busy={isLoading}>
      <p role="status" className="sr-only">
        {status}
      </p>
      <div className="flex items-baseline justify-between gap-3">
        <h2
          ref={headingRef}
          id="result-heading"
          tabIndex={-1}
          className="scroll-mt-4 rounded-sm text-base font-semibold focus:outline-none"
        >
          Hasil
        </h2>
        <Button
          variant="link"
          size="sm"
          asChild
          className="relative h-auto px-0 after:absolute after:-inset-x-2 after:-inset-y-3"
        >
          <a href={`#${ANATOMY_ID}`}>
            Arti tiap digit
            <ArrowDownIcon aria-hidden="true" />
          </a>
        </Button>
      </div>

      <div className="mt-4">
        {isLoading ? (
          <ResultSkeleton />
        ) : isError ? (
          <Alert variant="destructive" className="animate-rise-in">
            <CircleAlertIcon aria-hidden="true" className="size-4" />
            <AlertTitle>Gagal membaca NIK</AlertTitle>
            <AlertDescription className="flex flex-col items-start gap-3">
              Data wilayah tidak termuat. Cek koneksi internet, lalu coba lagi.
              <Button variant="outline" size="sm" onClick={onRetry}>
                <RotateCcwIcon data-icon="inline-start" aria-hidden="true" />
                Coba lagi
              </Button>
            </AlertDescription>
          </Alert>
        ) : hasResult ? (
          <div key={nik} className="flex flex-col gap-5">
            {issues.length > 0 && (
              <Alert className="animate-rise-in">
                <CircleAlertIcon aria-hidden="true" className="size-4" />
                <AlertTitle>Sebagian NIK tidak terbaca</AlertTitle>
                <AlertDescription>
                  <ul className="mt-1 flex flex-col gap-2">
                    {issues.map((issue) => {
                      const segment = SEGMENTS.find(
                        (s) => s.key === issue.segment,
                      );
                      return (
                        <li key={issue.segment}>
                          {issue.message}{" "}
                          {segment && (
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 align-baseline"
                              onClick={() => onFix(segment.start)}
                            >
                              Perbaiki {digitRange(segment).toLowerCase()}
                            </Button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            <ResultRows listRef={rowsRef} nik={nik} data={data} />
            <div className="flex animate-fade flex-col gap-2 [animation-delay:60ms] min-[400px]:flex-row min-[400px]:flex-wrap">
              {issues.length === 0 && (
                <CopyButton nik={nik} data={data} selectOnFail={rowsRef} />
              )}
              <Button variant="ghost" size="md" onClick={onReset}>
                <RotateCcwIcon data-icon="inline-start" aria-hidden="true" />
                Baca NIK lain
              </Button>
            </div>
          </div>
        ) : (
          <Empty className="gap-4 border border-dashed p-6 md:p-8">
            <EmptyHeader>
              <EmptyTitle className="text-base">
                Belum ada NIK yang dibaca
              </EmptyTitle>
              <EmptyDescription>
                Tiap hasil muncul di sini bersama digit asalnya. Tidak punya NIK
                untuk dicoba? Pakai contoh fiktif di atas.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    </section>
  );
};

type Row = {
  key: string;
  seg: SegmentKey;
  label: string;
  value: string | null;
  missing: string;
  meta?: string;
  /** Digits the value comes from; the part before `newFrom` is dimmed. */
  digits: { text: string; newFrom: number };
  mono?: boolean;
};

/** What didn't decode, worded so the visitor knows which digits to check. */
type Issue = { segment: SegmentKey; message: string };

/** What didn't decode, worded so the visitor knows which digits to check. */
const findIssues = (nik: string, data: ExtractedNik): Issue[] => {
  const issues: Issue[] = [];
  const region = (
    [
      { ok: data.provinsi, segment: "provinsi", label: "provinsi" },
      { ok: data.kabupaten, segment: "kabupaten", label: "kabupaten/kota" },
      { ok: data.kecamatan, segment: "kecamatan", label: "kecamatan" },
    ] as const
  ).find((level) => level.ok === null);
  if (region) {
    const segment = SEGMENTS.find((s) => s.key === region.segment);
    if (segment) {
      issues.push({
        segment: segment.key,
        message: `Kode ${region.label} ${nik.slice(
          0,
          segment.end,
        )} tidak ada di data wilayah.`,
      });
    }
  }
  if (!getBirthDateDetails({ idBirthDate: nik.substring(6, 12) })) {
    issues.push({
      segment: "birthDate",
      message: `${nik.substring(6, 12)} bukan tanggal lahir yang valid.`,
    });
  }
  return issues;
};

const buildRows = (nik: string, data: ExtractedNik): Row[] => {
  const dayDigits = nik.substring(6, 8);
  const rawDay = Number(dayDigits);
  const isFemale = rawDay > 40;
  const birth = getBirthDateDetails({ idBirthDate: nik.substring(6, 12) });

  let birthMeta: string | undefined;
  if (birth) {
    birthMeta = `${birth.age} tahun`;
    if (birth.otherCenturyYear && birth.age < KTP_AGE) {
      birthMeta += `. Bisa juga ${birth.otherCenturyYear}, karena NIK hanya menyimpan 2 digit tahun.`;
    }
  }

  return [
    {
      key: "provinsi",
      seg: "provinsi",
      label: "Provinsi",
      value: data.provinsi,
      missing: "Tidak ada di data wilayah",
      digits: { text: nik.substring(0, 2), newFrom: 0 },
    },
    {
      key: "kabupaten",
      seg: "kabupaten",
      label: "Kabupaten/Kota",
      value: data.kabupaten,
      missing: "Tidak ada di data wilayah",
      digits: { text: nik.substring(0, 4), newFrom: 2 },
    },
    {
      key: "kecamatan",
      seg: "kecamatan",
      label: "Kecamatan",
      value: data.kecamatan,
      missing: "Tidak ada di data wilayah",
      digits: { text: nik.substring(0, 6), newFrom: 4 },
    },
    {
      key: "gender",
      seg: "birthDate",
      label: "Jenis kelamin",
      // Gender lives in the birth day, so a day that isn't a date says nothing.
      // getGender prefixes ♂/♀ for the API; the row shows the word only.
      value: birth ? data.gender?.replace(/^[♂♀]\s*/, "") ?? null : null,
      missing: "Tidak terbaca",
      meta: isFemale
        ? `Tanggal lahir ditambah 40 (${dayDigits} = ${rawDay - 40} + 40).`
        : "Tanggal lahir ditulis apa adanya.",
      digits: { text: dayDigits, newFrom: 0 },
    },
    {
      key: "birthDate",
      seg: "birthDate",
      label: "Tanggal lahir",
      value: birth
        ? format(birth.date, "d MMMM yyyy", { locale: idLocale })
        : null,
      missing: "Tanggal tidak valid",
      meta: birthMeta,
      digits: { text: nik.substring(6, 12), newFrom: 0 },
    },
    {
      key: "uniqueId",
      seg: "urut",
      label: "Nomor urut",
      value: data.uniqueId,
      missing: "Tidak terbaca",
      meta: "Pembeda orang dengan wilayah dan tanggal lahir yang sama.",
      digits: { text: nik.substring(12), newFrom: 0 },
      mono: true,
    },
  ];
};

const GROUPS: { title: string; keys: string[] }[] = [
  { title: "Wilayah penerbitan", keys: ["provinsi", "kabupaten", "kecamatan"] },
  { title: "Pemilik", keys: ["gender", "birthDate", "uniqueId"] },
];

// Rows enter as one wave in reading order, with gaps that shrink so the tail
// catches up. Stacked (phone), that's all six rows top to bottom. Side by side
// (md+), the two columns move together row by row. Either way the last row
// lands under 300ms.
const STACKED_DELAYS_MS = [0, 25, 45, 60, 70, 78];
const COLUMN_DELAYS_MS = [0, 35, 60];

const ResultRows = ({
  listRef,
  nik,
  data,
}: {
  listRef: RefObject<HTMLDivElement>;
  nik: string;
  data: ExtractedNik;
}) => {
  const rows = buildRows(nik, data);

  return (
    <div ref={listRef} className="grid gap-x-10 gap-y-5 md:grid-cols-2">
      {GROUPS.map((group, groupIndex) => (
        <div key={group.title}>
          <h3 className="text-xs font-medium text-muted-foreground">
            {group.title}
          </h3>
          <dl className="mt-1 divide-y">
            {rows
              .filter((row) => group.keys.includes(row.key))
              .map((row, index) => (
                <div
                  key={row.key}
                  data-seg={row.seg}
                  className="animate-rise-in py-3 [animation-delay:var(--delay-stacked)] md:[animation-delay:var(--delay-columns)]"
                  style={
                    {
                      "--delay-stacked": `${
                        STACKED_DELAYS_MS[groupIndex * 3 + index]
                      }ms`,
                      "--delay-columns": `${COLUMN_DELAYS_MS[index]}ms`,
                    } as CSSProperties
                  }
                >
                  <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span
                      aria-hidden="true"
                      className="size-2 shrink-0 rounded-sm bg-seg"
                    />
                    {row.label}
                    <DigitsBadge {...row.digits} />
                  </dt>
                  <dd
                    className={cn(
                      "mt-1 break-words pl-4 text-base font-medium",
                      row.mono && "font-mono",
                      row.value === null && "font-normal text-muted-foreground",
                    )}
                  >
                    {row.value ?? row.missing}
                  </dd>
                  {row.meta && row.value !== null && (
                    <dd className="mt-0.5 text-pretty pl-4 text-sm text-muted-foreground">
                      {row.meta}
                    </dd>
                  )}
                </div>
              ))}
          </dl>
        </div>
      ))}
    </div>
  );
};

const DigitsBadge = ({ text, newFrom }: { text: string; newFrom: number }) => (
  <Badge variant="segment" className="ml-auto shrink-0">
    <span className="sr-only">Digit </span>
    {newFrom > 0 && (
      <span className="text-muted-foreground">{text.slice(0, newFrom)}</span>
    )}
    {text.slice(newFrom)}
  </Badge>
);

const ResultSkeleton = () => (
  <div className="grid gap-x-10 gap-y-5 md:grid-cols-2">
    {[
      ["w-36", "w-40", "w-44"],
      ["w-28", "w-36", "w-16"],
    ].map((widths) => (
      <div key={widths.join()}>
        <Skeleton className="h-3 w-24" />
        <div className="mt-1 divide-y">
          {widths.map((width) => (
            <div key={width} className="py-3">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className={cn("ml-4 mt-2 h-5", width)} />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const CopyButton = ({
  nik,
  data,
  selectOnFail,
}: {
  nik: string;
  data: ExtractedNik;
  /** Selected when copying fails, so the text can be copied by hand. */
  selectOnFail: RefObject<HTMLElement>;
}) => {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (state !== "copied") return;
    const timer = setTimeout(() => setState("idle"), 2000);
    return () => clearTimeout(timer);
  }, [state]);

  const copy = async () => {
    const text = [
      `NIK: ${nik}`,
      ...buildRows(nik, data).map(
        (row) => `${row.label}: ${row.value ?? row.missing}`,
      ),
    ].join("\n");

    if (await copyText(text)) {
      setState("copied");
      track("nik-copy");
      return;
    }

    if (selectOnFail.current) {
      window.getSelection()?.selectAllChildren(selectOnFail.current);
    }
    setState("failed");
  };

  const labels: Record<typeof state, ReactNode> = {
    idle: (
      <>
        <CopyIcon aria-hidden="true" />
        Salin hasil
      </>
    ),
    copied: (
      <>
        <CheckIcon aria-hidden="true" />
        Tersalin
      </>
    ),
    failed: (
      <>
        <CopyIcon aria-hidden="true" />
        Coba salin lagi
      </>
    ),
  };

  return (
    <>
      <Button variant="secondary" size="md" onClick={copy}>
        {/* Keyed so each state swap replays the entrance. */}
        <span key={state} className="flex animate-swap-in items-center gap-2">
          {labels[state]}
        </span>
      </Button>
      {/* Always rendered so screen readers pick up changes; only the failure
          note is visible. */}
      <p
        role="status"
        className={cn(
          state === "failed"
            ? "order-last w-full text-xs text-muted-foreground"
            : "sr-only",
        )}
      >
        {state === "failed"
          ? "Browser ini tidak mengizinkan menyalin otomatis. Teks hasil sudah dipilih, salin secara manual."
          : state === "copied"
            ? "Hasil tersalin."
            : ""}
      </p>
    </>
  );
};

/** `value`, but only once it has stayed true for `delay` ms. */
const useDelayedFlag = (value: boolean, delay: number) => {
  const [delayed, setDelayed] = useState(false);

  useEffect(() => {
    if (!value) {
      setDelayed(false);
      return;
    }
    const timer = setTimeout(() => setDelayed(true), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return delayed;
};
