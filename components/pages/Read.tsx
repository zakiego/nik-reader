import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { CheckIcon, CopyIcon, RotateCcwIcon, XIcon } from "lucide-react";
import { type RefObject, useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "~/components/ui/input-group";
import { Skeleton } from "~/components/ui/skeleton";
import { Spinner } from "~/components/ui/spinner";
import { track } from "~/lib/analytics";
import { copyText } from "~/lib/clipboard";
import { NIK_LENGTH } from "~/lib/const";
import { type NikInput as NikValues, nikSchema } from "~/lib/nik-schema";
import { splitNik } from "~/lib/nik-segments";
import { cn } from "~/lib/utils";
import { getBirthDateDetails } from "~/utils/extract";
import { type ExtractedNik, extractDataFromNIK } from "~/utils/read";

/** KTP is issued at 17, so a younger 2000s reading is worth a second look. */
const KTP_AGE = 17;

/**
 * A read is near-instant once the region chunk is cached, so loading UI only
 * shows after this long. Anything faster would just flash.
 */
const LOADING_DELAY_MS = 150;

const onlyDigits = (text: string) =>
  text.replace(/\D/g, "").slice(0, NIK_LENGTH);

export const Read = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const form = useForm<NikValues>({
    resolver: zodResolver(nikSchema),
    defaultValues: { nik: "" },
  });

  /**
   * On a phone the result lands below the fold, often under the keyboard. When
   * it does, the heading takes focus (closing the keyboard) and scrolls up.
   */
  const revealResult = () => {
    requestAnimationFrame(() => {
      const heading = headingRef.current;
      if (!heading) return;
      const viewport = window.visualViewport;
      const bottom = viewport
        ? viewport.offsetTop + viewport.height
        : window.innerHeight;
      if (heading.getBoundingClientRect().top < bottom - 120) return;
      heading.focus({ preventScroll: true });
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      heading.scrollIntoView({
        block: "start",
        behavior: reduce ? "auto" : "smooth",
      });
    });
  };

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

  // The 16th digit reads the NIK, typed or pasted. A failed read waits for
  // "Coba lagi" instead of looping.
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

  const setNik = (digits: string) => {
    form.setValue("nik", digits, {
      shouldValidate: form.formState.isSubmitted,
    });
    // A result for a different NIK is stale, so drop it.
    if (readNik !== undefined && digits !== readNik) readNIK.reset();
  };

  const clearAll = () => {
    readNIK.reset();
    form.reset({ nik: "" });
    inputRef.current?.focus();
  };

  const hasResult = !!readNIK.data && !!readNik && !isLoading;
  const showResult = isLoading || readNIK.isError || hasResult;

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
        <Controller
          name="nik"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid || undefined}
              className="gap-2"
            >
              <FieldLabel htmlFor="nik-input">NIK</FieldLabel>
              <InputGroup className="h-12 bg-card">
                <InputGroupInput
                  ref={(element) => {
                    field.ref(element);
                    inputRef.current = element;
                  }}
                  id="nik-input"
                  name={field.name}
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={(event) => setNik(onlyDigits(event.target.value))}
                  // A whole NIK pasted into a half-typed field replaces it
                  // instead of being glued onto the end.
                  onPaste={(event) => {
                    const pasted = onlyDigits(
                      event.clipboardData.getData("text"),
                    );
                    if (pasted.length === NIK_LENGTH) {
                      event.preventDefault();
                      setNik(pasted);
                    }
                  }}
                  type="text"
                  inputMode="numeric"
                  enterKeyHint="search"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder="16 digit NIK"
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.invalid ? "nik-error" : undefined
                  }
                  readOnly={readNIK.isLoading}
                  className="h-full pl-4 font-mono text-base tracking-wider placeholder:font-sans placeholder:tracking-normal md:text-lg"
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText
                    aria-hidden="true"
                    className="font-mono text-xs"
                  >
                    {field.value.length}/{NIK_LENGTH}
                  </InputGroupText>
                  {field.value.length > 0 && (
                    <InputGroupButton
                      size="icon-sm"
                      aria-label="Hapus NIK"
                      onClick={clearAll}
                    >
                      <XIcon />
                    </InputGroupButton>
                  )}
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && (
                <FieldError id="nik-error" role={undefined}>
                  NIK harus 16 digit.
                </FieldError>
              )}
            </Field>
          )}
        />
        <Button
          type="submit"
          size="lg"
          // aria-disabled, not disabled: disabling the focused button would
          // drop keyboard focus to <body> right as the result lands.
          aria-disabled={readNIK.isLoading}
        >
          {isLoading ? (
            <>
              <Spinner aria-hidden="true" />
              Membaca…
            </>
          ) : (
            "Baca NIK"
          )}
        </Button>
      </form>

      {/* Always rendered, so screen readers hear one short line per read. */}
      <p role="status" className="sr-only">
        {isLoading
          ? "Membaca NIK…"
          : hasResult && readNik
            ? `Hasil untuk NIK ${splitNik(readNik)} sudah tampil.`
            : readNIK.isError
              ? "Gagal membaca NIK."
              : ""}
      </p>

      {showResult && (
        <section aria-labelledby="result-heading" aria-busy={isLoading}>
          <h2
            ref={headingRef}
            id="result-heading"
            tabIndex={-1}
            className="scroll-mt-4 text-sm font-medium text-muted-foreground focus:outline-none"
          >
            Hasil
          </h2>
          <div className="mt-2">
            {isLoading ? (
              <ResultSkeleton />
            ) : readNIK.isError ? (
              <Alert variant="destructive">
                <AlertTitle>Gagal memuat data wilayah</AlertTitle>
                <AlertDescription className="flex flex-col items-start gap-3">
                  Cek koneksi, lalu coba lagi.
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => readNik && readNIK.mutate({ nik: readNik })}
                  >
                    <RotateCcwIcon aria-hidden="true" />
                    Coba lagi
                  </Button>
                </AlertDescription>
              </Alert>
            ) : hasResult && readNik && readNIK.data ? (
              <Result key={readNik} nik={readNik} data={readNIK.data} />
            ) : null}
          </div>
        </section>
      )}
    </div>
  );
};

type Row = {
  label: string;
  value: string | null;
  missing: string;
  /** Short note under the value. */
  note?: string;
  /** The digits the value comes from. */
  digits: string;
};

const buildRows = (nik: string, data: ExtractedNik): Row[] => {
  const birth = getBirthDateDetails({ idBirthDate: nik.substring(6, 12) });

  return [
    {
      label: "Provinsi",
      value: data.provinsi,
      missing: "Tidak dikenal",
      digits: nik.substring(0, 2),
    },
    {
      label: "Kabupaten/Kota",
      value: data.kabupaten,
      missing: "Tidak dikenal",
      digits: nik.substring(2, 4),
    },
    {
      label: "Kecamatan",
      value: data.kecamatan,
      missing: "Tidak dikenal",
      digits: nik.substring(4, 6),
    },
    {
      label: "Jenis kelamin",
      // Gender lives in the birth day, so a day that isn't a date says nothing.
      // getGender prefixes ♂/♀ for the API; the row shows the word only.
      value: birth ? data.gender?.replace(/^[♂♀]\s*/, "") ?? null : null,
      missing: "Tidak valid",
      digits: nik.substring(6, 8),
    },
    {
      label: "Tanggal lahir",
      value: birth
        ? `${format(birth.date, "d MMMM yyyy", { locale: idLocale })} (${
            birth.age
          } tahun)`
        : null,
      missing: "Tidak valid",
      note:
        birth?.otherCenturyYear && birth.age < KTP_AGE
          ? `Bisa juga ${birth.otherCenturyYear}.`
          : undefined,
      digits: nik.substring(6, 12),
    },
    {
      label: "Nomor urut",
      value: data.uniqueId,
      missing: "Tidak valid",
      digits: nik.substring(12),
    },
  ];
};

// Rows land as one quick wave, top to bottom, all within ~290ms.
const ROW_DELAYS_MS = [0, 20, 35, 48, 58, 66];

const Result = ({ nik, data }: { nik: string; data: ExtractedNik }) => {
  const listRef = useRef<HTMLDListElement>(null);
  const rows = buildRows(nik, data);

  return (
    <div className="flex flex-col gap-4">
      <dl ref={listRef} className="divide-y border-y">
        {rows.map((row, index) => (
          <div
            key={row.label}
            className="flex animate-rise-in items-baseline gap-4 py-3"
            style={{ animationDelay: `${ROW_DELAYS_MS[index]}ms` }}
          >
            <dt className="w-28 shrink-0 text-sm text-muted-foreground sm:w-36">
              {row.label}
            </dt>
            <dd className="min-w-0 flex-1">
              <span
                className={cn(
                  "break-words font-medium",
                  row.value === null && "font-normal text-muted-foreground",
                )}
              >
                {row.value ?? row.missing}
              </span>
              {row.note && row.value !== null && (
                <span className="block text-sm text-muted-foreground">
                  {row.note}
                </span>
              )}
            </dd>
            <dd className="shrink-0 font-mono text-sm text-muted-foreground">
              <span className="sr-only">Digit </span>
              {row.digits}
            </dd>
          </div>
        ))}
      </dl>
      <CopyButton
        selectOnFail={listRef}
        text={[
          `NIK: ${nik}`,
          ...rows.map((row) => `${row.label}: ${row.value ?? row.missing}`),
        ].join("\n")}
      />
    </div>
  );
};

const ResultSkeleton = () => (
  <div className="divide-y border-y">
    {["w-28", "w-36", "w-32", "w-24", "w-40", "w-14"].map((width) => (
      <div key={width} className="flex items-center gap-4 py-3.5">
        <Skeleton className="h-4 w-28 shrink-0 sm:w-36" />
        <Skeleton className={cn("h-4", width)} />
      </div>
    ))}
  </div>
);

const CopyButton = ({
  text,
  selectOnFail,
}: {
  text: string;
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

  return (
    <div className="flex flex-col items-start gap-2">
      <Button variant="outline" size="sm" onClick={copy}>
        {/* Keyed so each state swap replays the entrance. */}
        <span key={state} className="flex animate-swap-in items-center gap-2">
          {state === "copied" ? (
            <CheckIcon aria-hidden="true" />
          ) : (
            <CopyIcon aria-hidden="true" />
          )}
          {state === "copied" ? "Tersalin" : "Salin hasil"}
        </span>
      </Button>
      {/* Always rendered so screen readers pick up changes. */}
      <p
        role="status"
        className={cn(
          state === "failed" ? "text-sm text-muted-foreground" : "sr-only",
        )}
      >
        {state === "failed"
          ? "Gagal menyalin. Teks sudah dipilih, salin manual."
          : state === "copied"
            ? "Hasil tersalin."
            : ""}
      </p>
    </div>
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
