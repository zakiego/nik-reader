/* eslint-disable react-hooks/exhaustive-deps */
import { Combobox } from "~/components/UI";
import { PROVINSI } from "~/lib/provinsi";
import { KABUPATEN } from "~/lib/kabupaten";
import { KECAMATAN } from "~/lib/kecamatan";
import { GENDER } from "~/lib/gender";
import { Input } from "~/components/UI/Input";
import { useForm, useWatch } from "react-hook-form";
import { P, match } from "ts-pattern";
import { useEffect } from "react";
import { chunk, split } from "lodash";
import { chunkTwoChars } from "~/utils/string";

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
  const { register, control, setValue, watch, resetField } =
    useForm<FormValues>({});

  const watchValues = useWatch({
    control,
  });

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
        (v) => v.birthDate && v.gender.value === "P",
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

  useEffect(() => {
    setValue("kabupaten", null);
    setValue("kecamatan", null);
  }, [watchProvinsi]); // only re-run the effect if provinsi changes

  useEffect(() => {
    setValue("kecamatan", null);
  }, [watchKabupaten]); // only re-run the effect if kabupaten changes

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

        {/* <p className="text-white">{JSON.stringify(watchValues)}</p> */}
      </div>
      <div className="mt-10 space-y-4">
        <Combobox
          options={PROVINSI.map((prov) => ({
            value: prov.idProv,
            label: prov.name,
          }))}
          label="Provinsi"
          name="provinsi"
          control={control}
        />

        <div className="sm:flex sm:space-x-4 space-y-4 sm:space-y-0">
          <Combobox
            options={KABUPATEN.filter(
              (kab) => kab.idProv === watchValues.provinsi?.value,
            ).map((kab) => ({
              value: kab.idKab,
              label: kab.name,
            }))}
            label="Kabupaten/Kota"
            className="w-full sm:w-[50%]"
            name="kabupaten"
            control={control}
            isDisabled={!watchValues.provinsi}
          />

          <Combobox
            options={KECAMATAN.filter(
              (kec) => kec.idKab === watchValues.kabupaten?.value,
            ).map((kec) => ({
              value: kec.idKec,
              label: kec.name.toUpperCase(),
            }))}
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
