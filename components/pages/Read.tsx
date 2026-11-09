import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  ArrowDownIcon,
  CheckIcon,
  CircleAlertIcon,
  CopyIcon,
  IdCardIcon,
  RotateCcwIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import {
  type ReactNode,
  type RefObject,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
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
import { NIK_LENGTH } from "~/lib/const";
import { type NikInput, nikSchema } from "~/lib/nik-schema";
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
  const form = useForm<NikInput>({
    resolver: zodResolver(nikSchema),
    defaultValues: { nik: "" },
    mode: "onTouched",
  });

  // Reading a NIK is a pure lookup, so it runs here in the browser. The region
  // datasets it needs arrive as a lazy chunk on first read; keeping this off the
  // server is what stops every read from costing a Pages Function invocation.
  const readNIK = useMutation({
    mutationFn: (values: NikInput) => extractDataFromNIK(values.nik),
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
  });

  const isLoading = useDelayedFlag(readNIK.isLoading, LOADING_DELAY_MS);
  const readNik = readNIK.variables?.nik;

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

  return (
    <div className="mt-8 [-webkit-tap-highlight-color:transparent]">
      <form onSubmit={onSubmit} noValidate>
        <FieldGroup className="gap-4">
          <Controller
            name="nik"
            control={form.control}
            render={({ field, fieldState, formState }) => {
              const length = field.value.length;
              const remaining = NIK_LENGTH - length;
              const isComplete = length === NIK_LENGTH;
              // Stay quiet while the field is empty and no submit happened,
              // so tabbing past it doesn't shout.
              const showError =
                fieldState.invalid && (length > 0 || formState.isSubmitted);

              return (
                <Field data-invalid={showError || undefined}>
                  <FieldLabel htmlFor="nik-input">
                    Nomor Induk Kependudukan
                  </FieldLabel>
                  <InputGroup className="h-12 bg-card">
                    <InputGroupInput
                      {...field}
                      ref={(element) => {
                        field.ref(element);
                        inputRef.current = element;
                      }}
                      id="nik-input"
                      type="text"
                      inputMode="numeric"
                      enterKeyHint="search"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      placeholder="16 digit NIK"
                      aria-invalid={showError}
                      aria-describedby="nik-hint"
                      readOnly={readNIK.isLoading}
                      className="tabular h-full pl-4 font-mono text-base tracking-[0.06em] text-foreground placeholder:font-sans placeholder:tracking-normal min-[360px]:text-lg min-[360px]:tracking-[0.18em] md:text-lg"
                      onChange={(event) => {
                        // Strip spaces and dashes before trimming to 16, so a
                        // pasted "3204 2145 0190 0001" keeps all its digits.
                        const digits = event.target.value
                          .replace(/\D/g, "")
                          .slice(0, NIK_LENGTH);
                        field.onChange(digits);
                        // A result for a different NIK is stale, so drop it.
                        if (readNik !== undefined && digits !== readNik) {
                          readNIK.reset();
                        }
                      }}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText
                        aria-hidden="true"
                        className={cn(
                          "tabular font-mono text-xs",
                          isComplete && "text-success",
                        )}
                      >
                        {length}/{NIK_LENGTH}
                      </InputGroupText>
                      {length > 0 && (
                        <InputGroupButton
                          size="icon-sm"
                          className="relative after:absolute after:-inset-1.5"
                          aria-label="Kosongkan NIK"
                          onClick={clearAll}
                        >
                          <XIcon />
                        </InputGroupButton>
                      )}
                    </InputGroupAddon>
                  </InputGroup>
                  {showError ? (
                    <FieldError id="nik-hint" role={undefined}>
                      {length === 0
                        ? "Masukkan 16 digit NIK dulu."
                        : `NIK harus 16 digit, kurang ${remaining} lagi.`}
                    </FieldError>
                  ) : (
                    <FieldDescription id="nik-hint">
                      {isComplete
                        ? "Lengkap. Tekan Baca NIK."
                        : length > 0
                          ? `Kurang ${remaining} digit lagi.`
                          : "Ketik atau tempel NIK. Spasi dan tanda baca dibuang otomatis."}
                    </FieldDescription>
                  )}
                </Field>
              );
            }}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full"
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
              <>
                <SearchIcon aria-hidden="true" />
                Baca NIK
              </>
            )}
          </Button>
        </FieldGroup>
      </form>

      <ResultCard
        nik={readNik}
        data={readNIK.data}
        isLoading={isLoading}
        isError={readNIK.isError}
        onRetry={() => readNik && readNIK.mutate({ nik: readNik })}
        onReset={clearAll}
      />
    </div>
  );
};

const ResultCard = ({
  nik,
  data,
  isLoading,
  isError,
  onRetry,
  onReset,
}: {
  nik: string | undefined;
  data: ExtractedNik | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onReset: () => void;
}) => {
  const hasResult = !!data && !!nik && !isLoading;
  const rowsRef = useRef<HTMLDListElement>(null);

  // One short, always-rendered status line for screen readers, instead of a
  // live region that would read out every row.
  const status = isLoading
    ? "Membaca NIK…"
    : hasResult
      ? `Hasil untuk NIK ${splitNik(nik)} sudah tampil.`
      : "";

  return (
    <Card className="dark mt-8 shadow-panel">
      <p role="status" className="sr-only">
        {status}
      </p>
      <CardHeader className="gap-1 space-y-0 border-b px-6 py-4 sm:px-7">
        <div className="flex items-center justify-between gap-3">
          <CardTitle role="heading" aria-level={2} className="text-sm">
            Detail NIK
          </CardTitle>
          {/* Underlined at rest: hover never fires on a phone, so the link
              needs a cue that doesn't depend on it. */}
          <Button
            variant="link"
            size="sm"
            className="relative h-auto shrink-0 px-0 text-muted-foreground underline decoration-muted-foreground/50 after:absolute after:-inset-x-2 after:-inset-y-3"
            asChild
          >
            <a href={`#${ANATOMY_ID}`}>
              Lihat arti tiap digit
              <ArrowDownIcon aria-hidden="true" />
            </a>
          </Button>
        </div>
        {hasResult && (
          <CardDescription
            key={nik}
            className="tabular animate-fade font-mono tracking-wider"
          >
            {splitNik(nik)}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent aria-busy={isLoading} className="px-6 py-2 sm:px-7">
        {isLoading ? (
          <ResultSkeleton />
        ) : isError ? (
          <Alert variant="destructive" className="my-4 animate-row-in">
            <CircleAlertIcon aria-hidden="true" className="size-4" />
            <AlertTitle>Gagal membaca NIK</AlertTitle>
            <AlertDescription className="flex flex-col items-start gap-3">
              Data wilayah tidak termuat. Cek koneksi internet, lalu coba lagi.
              <Button variant="secondary" size="sm" onClick={onRetry}>
                <RotateCcwIcon aria-hidden="true" />
                Coba lagi
              </Button>
            </AlertDescription>
          </Alert>
        ) : hasResult ? (
          <ResultRows key={nik} ref={rowsRef} nik={nik} data={data} />
        ) : (
          <Empty className="animate-fade gap-4 p-4 md:p-6">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="rounded-full">
                <IdCardIcon aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle className="text-base">
                Belum ada NIK yang dibaca
              </EmptyTitle>
              <EmptyDescription>
                Ketik atau tempel NIK di atas, lalu tekan Baca NIK. Tiap hasil
                ditampilkan bersama digit asalnya.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>

      {hasResult && (
        <CardFooter className="animate-fade flex-col gap-2 border-t px-6 py-4 [animation-delay:80ms] min-[360px]:flex-row min-[360px]:flex-wrap sm:px-7">
          <CopyButton nik={nik} data={data} selectOnFail={rowsRef} />
          <Button
            variant="ghost"
            size="md"
            className="w-full min-[360px]:w-auto min-[360px]:flex-1 sm:flex-none"
            onClick={onReset}
          >
            <RotateCcwIcon aria-hidden="true" />
            Baca NIK lain
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

type Row = {
  key: string;
  label: string;
  value: string | null;
  missing: string;
  meta?: string;
  /** Digits the value comes from; the part before `newFrom` is dimmed. */
  digits?: { text: string; newFrom: number };
  mono?: boolean;
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
      label: "Provinsi",
      value: data.provinsi,
      missing: "Tidak ada di data wilayah",
      digits: { text: nik.substring(0, 2), newFrom: 0 },
    },
    {
      key: "kabupaten",
      label: "Kabupaten / Kota",
      value: data.kabupaten,
      missing: "Tidak ada di data wilayah",
      digits: { text: nik.substring(0, 4), newFrom: 2 },
    },
    {
      key: "kecamatan",
      label: "Kecamatan",
      value: data.kecamatan,
      missing: "Tidak ada di data wilayah",
      digits: { text: nik.substring(0, 6), newFrom: 4 },
    },
    {
      key: "gender",
      label: "Jenis Kelamin",
      value: data.gender,
      missing: "Tidak terbaca",
      meta: isFemale
        ? `Tanggal lahir ditambah 40 (${dayDigits} = ${rawDay - 40} + 40).`
        : "Tanggal lahir ditulis apa adanya.",
      digits: { text: dayDigits, newFrom: 0 },
    },
    {
      key: "birthDate",
      label: "Tanggal Lahir",
      value: birth
        ? format(birth.date, "d MMMM yyyy", { locale: idLocale })
        : null,
      missing: "Tanggal tidak valid",
      meta: birthMeta,
      digits: { text: nik.substring(6, 12), newFrom: 0 },
    },
    {
      key: "uniqueId",
      label: "Nomor Urut",
      value: data.uniqueId,
      missing: "Tidak terbaca",
      meta: "Pembeda orang dengan wilayah dan tanggal lahir yang sama.",
      digits: { text: nik.substring(12), newFrom: 0 },
      mono: true,
    },
  ];
};

// Rows enter top to bottom as one wave: the gaps shrink so the tail catches
// up, and the last row lands by ~300ms.
const ROW_DELAYS_MS = [0, 25, 45, 60, 70, 80];

const ResultRows = forwardRef<
  HTMLDListElement,
  { nik: string; data: ExtractedNik }
>(({ nik, data }, ref) => (
  <dl ref={ref} className="divide-y">
    {buildRows(nik, data).map((row, index) => (
      <div
        key={row.key}
        className="animate-row-in py-3.5"
        style={{ animationDelay: `${ROW_DELAYS_MS[index] ?? 80}ms` }}
      >
        <dt className="flex items-center justify-between gap-3 text-xs font-medium text-muted-foreground">
          {row.label}
          {row.digits && <DigitsBadge {...row.digits} />}
        </dt>
        <dd
          className={cn(
            "mt-1 break-words text-[15px] font-medium",
            row.mono && "tabular font-mono",
            row.value === null && "text-muted-foreground",
          )}
        >
          {row.value ?? row.missing}
        </dd>
        {row.meta && row.value !== null && (
          <dd className="mt-0.5 text-pretty text-xs text-muted-foreground">
            {row.meta}
          </dd>
        )}
      </div>
    ))}
  </dl>
));
ResultRows.displayName = "ResultRows";

const DigitsBadge = ({ text, newFrom }: { text: string; newFrom: number }) => (
  <Badge
    variant="outline"
    className="tabular shrink-0 font-mono font-medium tracking-wider"
  >
    {newFrom > 0 && (
      <span className="text-muted-foreground">{text.slice(0, newFrom)}</span>
    )}
    {text.slice(newFrom)}
  </Badge>
);

const ResultSkeleton = () => (
  <div className="divide-y">
    {["w-40", "w-36", "w-44", "w-28", "w-32", "w-16"].map((width) => (
      <div key={width} className="py-3.5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className={cn("mt-2 h-5", width)} />
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
      <Button
        variant="secondary"
        size="md"
        className="w-full min-[360px]:w-auto min-[360px]:flex-1 sm:flex-none"
        onClick={copy}
      >
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

/**
 * Clipboard API first, then the old execCommand route, which still works in
 * some in-app browsers that block the API. False when both fail.
 */
const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      return document.execCommand("copy");
    } catch {
      return false;
    } finally {
      textarea.remove();
    }
  }
};

/** "6371015203950001" -> "63 71 01 520395 0001", split by meaning. */
const splitNik = (nik: string) =>
  [
    nik.substring(0, 2),
    nik.substring(2, 4),
    nik.substring(4, 6),
    nik.substring(6, 12),
    nik.substring(12),
  ].join(" ");

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
