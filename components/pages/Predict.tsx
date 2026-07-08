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
    <div className="mt-10">
      <div className="bg-hitam-900 px-7 py-6 rounded-md">
        <div className="font-medium text-white/70 text-xl">NIK</div>
        <div className="mt-3 font-medium text-white text-3xl">
          {createNIK()}
        </div>
        <div className="mt-2 text-white/50 text-xs italic">
          *4 digit terakhir adalah angka gaib yang tidak bisa ditebak
        </div>
      </div>
      <div className="mt-10 space-y-4">
        <Combobox
          options={provinsiQuery.data ?? []}
          label="Provinsi"
          name="provinsi"
          control={control}
        />

        <div className="sm:flex sm:space-x-4 space-y-4 sm:space-y-0">
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

        <div className="sm:flex sm:space-x-4 space-y-4 sm:space-y-0">
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
  );
};
