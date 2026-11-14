import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckIcon, CopyIcon, ShuffleIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RegionCombobox } from "~/components/form/RegionCombobox";
import { Button } from "~/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Spinner } from "~/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { track } from "~/lib/analytics";
import { copyText } from "~/lib/clipboard";
import { GENDER } from "~/lib/gender";
import { SEGMENTS } from "~/lib/nik-segments";
import {
  type RegionOption,
  loadKabupatenOptions,
  loadKecamatanOptions,
  loadProvinsiOptions,
} from "~/lib/region-client";
import { getParam, replaceParams } from "~/lib/url-query";

type Gender = (typeof GENDER)[number]["value"];

/** Unknown digits in the preview, shown as a faint dot. */
const UNKNOWN = "-";

// Region options are resolved in the browser from a lazily loaded chunk, so
// the cascade costs one CDN fetch instead of a request per level. The data
// never changes, so results are cached for the life of the page.
const regionQuery = {
  provinsi: () => ({
    queryKey: ["region", "provinsi"],
    queryFn: loadProvinsiOptions,
    staleTime: Number.POSITIVE_INFINITY,
  }),
  kabupaten: (idProv: string) => ({
    queryKey: ["region", "kabupaten", idProv],
    queryFn: () => loadKabupatenOptions(idProv),
    staleTime: Number.POSITIVE_INFINITY,
  }),
  kecamatan: (idKab: string) => ({
    queryKey: ["region", "kecamatan", idKab],
    queryFn: () => loadKecamatanOptions(idKab),
    staleTime: Number.POSITIVE_INFINITY,
  }),
};

/** The 16 preview characters: digits where known, UNKNOWN where not, xxxx last. */
const buildDigits = ({
  provinsi,
  kabupaten,
  kecamatan,
  gender,
  birthDate,
}: {
  provinsi: RegionOption | null;
  kabupaten: RegionOption | null;
  kecamatan: RegionOption | null;
  gender: Gender | "";
  birthDate: string;
}) => {
  const region = (kecamatan?.value ?? kabupaten?.value ?? provinsi?.value ?? "")
    .padEnd(6, UNKNOWN)
    .slice(0, 6);

  let birth = UNKNOWN.repeat(6);
  const [year, month, day] = birthDate.split("-");
  if (year?.length === 4 && month && day) {
    // A woman's birth day is written plus 40.
    const dayDigits =
      gender === "P" ? String(Number(day) + 40) : day.padStart(2, "0");
    birth = `${dayDigits}${month}${year.slice(2)}`;
  }

  return `${region}${birth}xxxx`;
};

/** What a screen reader hears for the preview: known parts read out, the rest named. */
const describeDigits = (digits: string) =>
  `Pratinjau NIK: ${SEGMENTS.map((segment) => {
    const part = digits.slice(segment.start, segment.end);
    if (part.includes("x")) return `${segment.hint} tidak bisa ditebak`;
    if (part.includes(UNKNOWN)) return `${segment.hint} belum dipilih`;
    return part;
  }).join(", ")}.`;

const isGender = (value: string | undefined): value is Gender =>
  GENDER.some((g) => g.value === value);

const isIsoDate = (value: string | undefined): value is string =>
  !!value && /^\d{4}-\d{2}-\d{2}$/.test(value);

const pick = <T,>(items: T[]) =>
  items[Math.floor(Math.random() * items.length)];

/** A date someone old enough to hold a KTP could have been born on. */
const randomBirthDate = () => {
  const from = new Date(1960, 0, 1).getTime();
  const to = new Date(new Date().getFullYear() - 17, 11, 31).getTime();
  const date = new Date(from + Math.random() * (to - from));
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`;
};

export const Predict = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [provinsi, setProvinsi] = useState<RegionOption | null>(null);
  const [kabupaten, setKabupaten] = useState<RegionOption | null>(null);
  const [kecamatan, setKecamatan] = useState<RegionOption | null>(null);
  const [gender, setGender] = useState<Gender | "">("");
  const [birthDate, setBirthDate] = useState("");
  const [isRandomizing, setIsRandomizing] = useState(false);
  // Until the URL has been read, writing state back to it would wipe the link.
  const [isRestored, setIsRestored] = useState(false);

  const provinsiQuery = useQuery(regionQuery.provinsi());
  const kabupatenQuery = useQuery({
    ...regionQuery.kabupaten(provinsi?.value ?? ""),
    enabled: !!provinsi,
  });
  const kecamatanQuery = useQuery({
    ...regionQuery.kecamatan(kabupaten?.value ?? ""),
    enabled: !!kabupaten,
  });

  const values = { provinsi, kabupaten, kecamatan, gender, birthDate };
  const digits = buildDigits(values);
  const isComplete = !!(kecamatan && gender && birthDate);

  // Count a generated NIK once, when the last field gets filled in, not again
  // on every tweak to a pattern that's already complete.
  useEffect(() => {
    if (isComplete) track("nik-generate");
  }, [isComplete]);

  // A `?region=&gender=&birth=` link fills the form. The region is the
  // deepest code picked (2, 4 or 6 digits), and each level is looked up in
  // turn, stopping at the first code that doesn't match.
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs once, when the query arrives
  useEffect(() => {
    if (!router.isReady) return;
    let cancelled = false;
    const region = getParam(router, "region")?.replace(/\D/g, "") ?? "";
    const genderParam = getParam(router, "gender");
    const birthParam = getParam(router, "birth");

    const restore = async () => {
      try {
        const levels = [
          { length: 2, load: () => regionQuery.provinsi(), set: setProvinsi },
          {
            length: 4,
            load: () => regionQuery.kabupaten(region.slice(0, 2)),
            set: setKabupaten,
          },
          {
            length: 6,
            load: () => regionQuery.kecamatan(region.slice(0, 4)),
            set: setKecamatan,
          },
        ];
        for (const level of levels) {
          if (region.length < level.length) break;
          const options = await queryClient.fetchQuery(level.load());
          const match = options.find(
            (option) => option.value === region.slice(0, level.length),
          );
          if (!match || cancelled) break;
          level.set(match);
        }
      } catch {
        // The region chunk failed to load; the provinsi field shows the retry.
      }
      if (cancelled) return;
      if (isGender(genderParam)) setGender(genderParam);
      if (isIsoDate(birthParam)) setBirthDate(birthParam);
      setIsRestored(true);
    };

    restore();
    return () => {
      cancelled = true;
    };
  }, [router.isReady]);

  // The URL mirrors the form, so the page can be bookmarked or shared.
  // biome-ignore lint/correctness/useExhaustiveDependencies: writes follow the form fields only
  useEffect(() => {
    if (!isRestored) return;
    replaceParams(router, {
      region: kecamatan?.value ?? kabupaten?.value ?? provinsi?.value ?? null,
      gender: gender || null,
      birth: birthDate || null,
    });
  }, [isRestored, provinsi, kabupaten, kecamatan, gender, birthDate]);

  // Picking a parent region clears the levels under it.
  const chooseProvinsi = (option: RegionOption) => {
    if (option.value === provinsi?.value) return;
    setProvinsi(option);
    setKabupaten(null);
    setKecamatan(null);
  };
  const chooseKabupaten = (option: RegionOption) => {
    if (option.value === kabupaten?.value) return;
    setKabupaten(option);
    setKecamatan(null);
  };

  const randomize = async () => {
    if (isRandomizing) return;
    setIsRandomizing(true);
    try {
      const p = pick(await queryClient.fetchQuery(regionQuery.provinsi()));
      const k = pick(
        await queryClient.fetchQuery(regionQuery.kabupaten(p.value)),
      );
      const c = pick(
        await queryClient.fetchQuery(regionQuery.kecamatan(k.value)),
      );
      setProvinsi(p);
      setKabupaten(k);
      setKecamatan(c);
      setGender(pick(GENDER.map((g) => g.value)));
      setBirthDate(randomBirthDate());
      track("nik-randomize");
    } catch {
      // The region chunk failed to load; the provinsi field shows the retry.
      provinsiQuery.refetch();
    } finally {
      setIsRandomizing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <section
        aria-labelledby="preview-heading"
        className="flex flex-col gap-2"
      >
        <div className="flex items-center justify-between gap-3">
          <h2
            id="preview-heading"
            className="text-sm font-medium text-muted-foreground"
          >
            Hasil
          </h2>
          <div className="flex items-center gap-1">
            {isComplete && <CopyPattern digits={digits} />}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={randomize}
              aria-disabled={isRandomizing}
            >
              {isRandomizing ? (
                <Spinner aria-hidden="true" />
              ) : (
                <ShuffleIcon aria-hidden="true" />
              )}
              Acak
            </Button>
          </div>
        </div>
        <p className="break-all font-mono text-2xl font-medium tracking-wider sm:text-3xl">
          <span aria-hidden="true">
            {digits.split("").map((char, index) => (
              <span
                // The preview is fixed-length and never reorders.
                // biome-ignore lint/suspicious/noArrayIndexKey: position is the identity
                key={index}
                className={
                  /\d/.test(char) ? undefined : "text-muted-foreground/60"
                }
              >
                {char === UNKNOWN ? "·" : char}
              </span>
            ))}
          </span>
          <span className="sr-only">{describeDigits(digits)}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          4 digit terakhir tidak bisa ditebak.
        </p>
      </section>

      <Separator />

      <FieldGroup className="gap-5">
        <RegionCombobox
          id="provinsi"
          label="Provinsi"
          noun="provinsi"
          options={provinsiQuery.data ?? []}
          value={provinsi}
          onChange={chooseProvinsi}
          isLoading={provinsiQuery.isLoading}
          isError={provinsiQuery.isError}
          onRetry={() => provinsiQuery.refetch()}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 [&>*]:min-w-0">
          <RegionCombobox
            id="kabupaten"
            label="Kabupaten/Kota"
            noun="kabupaten/kota"
            options={kabupatenQuery.data ?? []}
            value={kabupaten}
            onChange={chooseKabupaten}
            disabled={!provinsi}
            disabledHint="Pilih provinsi dulu."
            isLoading={!!provinsi && kabupatenQuery.isLoading}
            isError={kabupatenQuery.isError}
            onRetry={() => kabupatenQuery.refetch()}
          />
          <RegionCombobox
            id="kecamatan"
            label="Kecamatan"
            noun="kecamatan"
            options={kecamatanQuery.data ?? []}
            value={kecamatan}
            onChange={setKecamatan}
            disabled={!kabupaten}
            disabledHint="Pilih kabupaten/kota dulu."
            isLoading={!!kabupaten && kecamatanQuery.isLoading}
            isError={kecamatanQuery.isError}
            onRetry={() => kecamatanQuery.refetch()}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 [&>*]:min-w-0">
          <FieldSet className="gap-0">
            <FieldLegend variant="label" className="mb-2">
              Jenis kelamin
            </FieldLegend>
            <ToggleGroup
              type="single"
              variant="outline"
              value={gender}
              // Single choice that can't be cleared by tapping it again.
              onValueChange={(next) => next && setGender(next as Gender)}
              className="grid grid-cols-2 gap-2"
            >
              {GENDER.map((g) => (
                <ToggleGroupItem key={g.value} value={g.value} className="h-11">
                  {gender === g.value && <CheckIcon aria-hidden="true" />}
                  {g.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </FieldSet>

          <Field className="gap-2">
            <FieldLabel htmlFor="birth-date">Tanggal lahir</FieldLabel>
            <Input
              id="birth-date"
              type="date"
              min="1900-01-01"
              value={birthDate}
              onChange={(event) => setBirthDate(event.target.value)}
              className="appearance-none [&::-webkit-date-and-time-value]:text-left"
            />
          </Field>
        </div>
      </FieldGroup>
    </div>
  );
};

/** Copies the generated pattern, xxxx included, for pasting into a test form. */
const CopyPattern = ({ digits }: { digits: string }) => {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timer = setTimeout(() => setState("idle"), 2000);
    return () => clearTimeout(timer);
  }, [state]);

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={async () =>
          setState((await copyText(digits)) ? "copied" : "failed")
        }
      >
        <span key={state} className="flex animate-swap-in items-center gap-2">
          {state === "copied" ? (
            <CheckIcon aria-hidden="true" />
          ) : (
            <CopyIcon aria-hidden="true" />
          )}
          {state === "copied"
            ? "Tersalin"
            : state === "failed"
              ? "Gagal menyalin"
              : "Salin"}
        </span>
      </Button>
      <span role="status" className="sr-only">
        {state === "copied"
          ? `${digits} tersalin.`
          : state === "failed"
            ? "Gagal menyalin."
            : ""}
      </span>
    </>
  );
};
