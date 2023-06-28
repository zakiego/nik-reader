import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { match } from "ts-pattern";
import { trpc } from "~/utils/trpc";

type FormValues = {
  nik: string;
};

const schema = z.object({
  nik: z.string().min(16).max(16),
});

export const Read = () => {
  const {
    register,
    watch,
    formState: { isValid },
    handleSubmit,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nik: "6301001010010110",
    },
  });

  const inputLength = watch("nik")?.length || 0;

  const readNIK = trpc.nik.read.useMutation();

  const { data } = readNIK;

  const onSubmit = handleSubmit(async (data: FormValues) => {
    await readNIK.mutate(data);
  });

  return (
    <>
      <div className="mt-10">
        <div className="font-medium text-hitam-100 text-xl text-center">
          NIK
        </div>
        <form onSubmit={onSubmit} className="flex flex-col">
          <input
            maxLength={16}
            className={`
          ${match(inputLength)
            .with(16, () => "border-green-600")
            .when(
              (length) => length < 16 && length > 1,
              () => "border-red-400",
            )
            .otherwise(() => "border-garis")}
            w-full text-xl text-center mt-2 space-x-1 border-b-2 outline-none`}
            {...register("nik")}
          />
          <button
            disabled={!isValid}
            className={`w-full bg-green-600 disabled:bg-gray-300 mt-4 hover:bg-green-800 text-white px-3 py-1 shadow-lg rounded-md`}
          >
            Baca
          </button>
        </form>
      </div>
      <div className="mt-16 bg-hitam-900 text-white px-7 py-6 rounded-md">
        <div className="font-bold text-xl flex justify-between">
          <div>Detail</div>
          {/* <button
            onClick={() => resetField("nik")}
            className="text-white/60 hover:text-red-500"
          >
            <XCircleIcon className="h-6 w-6" />
          </button> */}
        </div>

        <div className="mt-7 font-medium space-y-5">
          <div className="">
            <div className="text-hitam-100 text-sm">Provinsi</div>
            <div>{data?.provinsi}</div>
          </div>
          <div className="flex justify-between">
            <div className="w-7/12">
              <div className="text-hitam-100 text-sm">Kabupaten</div>
              <div>{data?.kabupaten}</div>
            </div>
            <div className="w-5/12">
              <div className="text-hitam-100 text-sm">Kecamatan</div>
              <div>{data?.kecamatan}</div>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="w-7/12">
              <div className="text-hitam-100 text-sm">Jenis Kelamin</div>
              <div>{data?.gender}</div>
            </div>
            <div className="w-5/12">
              <div className="text-hitam-100 text-sm">Tanggal Lahir</div>
              <div>{data?.birthDate}</div>
            </div>
          </div>

          <div className="">
            <div className="text-hitam-100 text-sm">ID Unik</div>
            <div>{data?.uniqueId}</div>
          </div>
        </div>
      </div>
    </>
  );
};

const RemoveIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
};
