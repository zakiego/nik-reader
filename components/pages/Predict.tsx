import {
  InformationCircleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { split } from "lodash";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { match } from "ts-pattern";
import { Combobox } from "~/components/UI";
import { Input } from "~/components/UI/Input";
import { GENDER } from "~/lib/gender";
import { chunkTwoChars } from "~/utils/string";
import { trpc } from "~/utils/trpc";

type ComboboxOption = {
  value: string;
  label: string;
};

interface FormValues {
  provinsi: ComboboxOption;
  kabupaten: ComboboxOption;
  kecamatan: ComboboxOption;
  gender: ComboboxOption;
  birthDate: string;
}

export const Predict = () => {
  const { register, control, setValue, watch } = useForm<FormValues>({});

  const watchValues = useWatch({
    control,
  });

  // Region options are fetched on demand from the server instead of bundling
  // the full datasets into the client. Each level is enabled only once its
  // parent has been selected, so the cascade fetches the minimum needed.
  const provinsiQuery = trpc.region.provinsi.useQuery();

  const kabupatenQuery = trpc.region.kabupaten.useQuery(
    { idProv: watchValues.provinsi?.value ?? "" },
    { enabled: !!watchValues.provinsi?.value },
  );

  const kecamatanQuery = trpc.region.kecamatan.useQuery(
    { idKab: watchValues.kabupaten?.value ?? "" },
    { enabled: !!watchValues.kabupaten?.value },
  );

  const createNIK = () => {
    const regionalCode = match(watchValues)
      .when(
        (v) => v.kecamatan,
        (v) => {
          const chunk = chunkTwoChars(v.kecamatan.value);

          return `${chunk}`;
        },
      )
      .when(
        (v) => v.kabupaten,
        (v) => {
          const chunk = chunkTwoChars(v.kabupaten.value);
          return `${chunk} **`;
        },
      )
      .when(
        (v) => v.provinsi,
        (v) => `${v.provinsi.value} ** **`,
      )
      .otherwise(() => "** ** **");

    const birthDate = match(watchValues)
      .when(
        (v) => v.birthDate && v.gender?.value === "P",
        (v) => {
          const splitDate = split(v.birthDate, "-");
          const addForty = (parseInt(splitDate[2]) + 40).toString();
          const chunk = chunkTwoChars(
            `${addForty}${splitDate[1]}${splitDate[0].substring(2)}`,
          );
          return chunk;
        },
      )
      .when(
        (v) => v.birthDate,
        (v) => {
          const splitDate = split(v.birthDate, "-");
          const chunk = chunkTwoChars(
            `${splitDate[2]}${splitDate[1]}${splitDate[0].substring(2)}`,
          );
          return chunk;
        },
      )
      .otherwise(() => "** ** **");

    return `${regionalCode} ${birthDate} xxxx`;
  };

  const watchProvinsi = watch("provinsi");
  const watchKabupaten = watch("kabupaten");

  // Reset the dependent selections whenever the parent region changes.
  // biome-ignore lint/correctness/useExhaustiveDependencies: watchProvinsi is the intended trigger, not a value read inside the effect
  useEffect(() => {
    setValue("kabupaten", null);
    setValue("kecamatan", null);
  }, [watchProvinsi, setValue]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: watchKabupaten is the intended trigger, not a value read inside the effect
  useEffect(() => {
    setValue("kecamatan", null);
  }, [watchKabupaten, setValue]);

  return (
    <div className="mt-8">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-panel ring-1 ring-white/10">
        <div className="flex items-center gap-2 border-b border-white/5 px-6 py-4 sm:px-7">
          <SparklesIcon className="h-5 w-5 text-slate-300" aria-hidden="true" />
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
            Pratinjau NIK
          </h2>
        </div>

        <div className="px-6 py-6 sm:px-7">
          <div className="break-all text-2xl font-semibold tracking-tight sm:text-3xl">
            <NikPreview value={createNIK()} />
          </div>
          <p className="mt-3 flex items-start gap-1.5 text-xs text-slate-400">
            <InformationCircleIcon
              className="mt-0.5 h-4 w-4 shrink-0 text-slate-500"
              aria-hidden="true"
            />
            <span>
              4 digit terakhir (
              <span className="font-mono text-slate-300">xxxx</span>) adalah
              angka gaib yang tidak bisa ditebak.
            </span>
          </p>
        </div>
      </section>

      <div className="mt-8">
        <h3 className="text-sm font-medium text-content">Lengkapi data</h3>
        <p className="mt-1 text-xs text-muted">
          NIK terbentuk otomatis dari pilihan di bawah.
        </p>

        <div className="mt-4 space-y-4">
          <Combobox
            options={provinsiQuery.data ?? []}
            label="Provinsi"
            name="provinsi"
            control={control}
          />

          <div className="space-y-4 sm:flex sm:space-x-4 sm:space-y-0">
            <Combobox
              options={kabupatenQuery.data ?? []}
              label="Kabupaten/Kota"
              className="w-full sm:w-[50%]"
              name="kabupaten"
              control={control}
              isDisabled={!watchValues.provinsi}
            />

            <Combobox
              options={kecamatanQuery.data ?? []}
              label="Kecamatan"
              className="w-full sm:w-[50%]"
              name="kecamatan"
              control={control}
              isDisabled={!watchValues.kabupaten}
            />
          </div>

          <div className="space-y-4 sm:flex sm:space-x-4 sm:space-y-0">
            <Combobox
              options={GENDER.map((g) => ({
                value: g.value,
                label: g.label.toUpperCase(),
              }))}
              label="Jenis Kelamin"
              className="w-full sm:w-[50%]"
              name="gender"
              control={control}
            />

            <Input
              label="Tanggal Lahir"
              inputProps={{
                type: "date",
                ...register("birthDate"),
              }}
              containerProps={{
                className: "w-full sm:w-[50%]",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Renders the generated NIK with known digits highlighted and the unknown
// placeholder characters (* and x) dimmed, so the number reads like it is
// progressively filling in as the user makes selections.
const NikPreview = ({ value }: { value: string }) => {
  // Pre-bake a stable id per position. The readout is fixed-length and never
  // reorders, so a positional id is safe (and keeps keys off the map index).
  const chars = value.split("").map((char, i) => ({ char, id: i }));

  return (
    <span className="tabular font-mono">
      {chars.map(({ char, id }) => {
        const isPlaceholder = char === "*" || char === "x" || char === "X";
        return (
          <span
            key={id}
            className={isPlaceholder ? "text-slate-600" : "text-white"}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
};
