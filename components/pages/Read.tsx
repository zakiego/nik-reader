import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { match } from "ts-pattern";
import { trpc } from "~/utils/trpc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { XCircleIcon } from "@heroicons/react/20/solid";

type FormValues = {
  nik: string;
};

const schema = z.object({
  nik: z.string().length(16),
});

export const Read = () => {
  const {
    register,
    watch,
    formState: { isValid },
    handleSubmit,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
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
            readOnly={readNIK.isLoading}
            className={`
          ${match(inputLength)
            .with(16, () => "border-green-600")
            .when(
              (length) => length < 16 && length >= 1,
              () => "border-red-400",
            )
            .otherwise(() => "border-garis")}
            w-full text-xl text-center mt-2 space-x-1 border-b-2 outline-none`}
            {...register("nik")}
          />
          <button
            disabled={!isValid || readNIK.isLoading}
            className={`w-full bg-green-600 text-white mt-4 px-3 py-1 shadow-lg rounded-md flex items-center gap-x-2 transition-all
            justify-center ${
              readNIK.isLoading
                ? "cursor-not-allowed"
                : " hover:bg-green-800 disabled:bg-gray-300"
            }`}
          >
            {readNIK.isLoading && (
              <AiOutlineLoading3Quarters className="animate-spin bg-red" />
            )}
            {readNIK.isLoading ? "Processing..." : "Baca"}
          </button>
        </form>
      </div>

      <div className="mt-16 bg-hitam-900 text-white px-7 py-6 rounded-md">
        <div className="font-bold text-xl flex justify-between">
          <div>Detail</div>
          {readNIK.data && (
            <button
              onClick={() => readNIK.reset()}
              className="text-white/60 hover:text-red-500"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
          )}
        </div>

        <div className="mt-7 font-medium space-y-5">
          <div className="">
            <div className="text-hitam-100 text-sm">Provinsi</div>
            <NullGuard isLoading={readNIK.isLoading}>
              {data?.provinsi}
            </NullGuard>
          </div>
          <div className="flex justify-between space-x-4">
            <div className="w-7/12">
              <div className="text-hitam-100 text-sm">Kabupaten</div>
              <NullGuard isLoading={readNIK.isLoading}>
                {data?.kabupaten}
              </NullGuard>
            </div>
            <div className="w-5/12">
              <div className="text-hitam-100 text-sm">Kecamatan</div>
              <NullGuard isLoading={readNIK.isLoading}>
                {data?.kecamatan}
              </NullGuard>
            </div>
          </div>

          <div className="flex justify-between space-x-4">
            <div className="w-7/12">
              <div className="text-hitam-100 text-sm">Jenis Kelamin</div>
              <NullGuard isLoading={readNIK.isLoading}>
                {data?.gender}
              </NullGuard>
            </div>
            <div className="w-5/12">
              <div className="text-hitam-100 text-sm">Tanggal Lahir</div>
              <NullGuard isLoading={readNIK.isLoading}>
                {data?.birthDate}
              </NullGuard>
            </div>
          </div>

          <div className="">
            <div className="text-hitam-100 text-sm">ID Unik</div>
            <NullGuard isLoading={readNIK.isLoading}>
              {data?.uniqueId}
            </NullGuard>
          </div>
        </div>
      </div>
    </>
  );
};

const NullGuard = ({
  isLoading,
  children,
}: {
  isLoading: boolean;
  children: any;
}) => {
  if (isLoading) {
    return <div className="animate-pulse bg-gray-400 h-6 rounded-sm w-full" />;
  }

  if (children === null) {
    return <p className="text-red-500">ERROR</p>;
  }

  if (children === undefined) {
    return <p className="text-white">-</p>;
  }

  return <p>{children}</p>;
};
