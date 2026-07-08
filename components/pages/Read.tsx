import { XCircleIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { match } from "ts-pattern";
import { NIK_LENGTH } from "~/lib/const";
import { type NikInput, nikSchema } from "~/lib/nik-schema";
import { trpc } from "~/utils/trpc";

export const Read = () => {
  const {
    register,
    watch,
    formState: { isValid },
    handleSubmit,
    setValue: formSetValue,
    trigger: formTrigger,
  } = useForm<NikInput>({
    resolver: zodResolver(nikSchema),
  });

  const inputLength = watch("nik")?.length || 0;

  const readNIK = trpc.nik.read.useMutation();

  const { data } = readNIK;

  const onSubmit = handleSubmit((values: NikInput) => {
    readNIK.mutate(values);
  });

  return (
    <>
      <div className="mt-10">
        <div className="font-medium text-hitam-100 text-xl text-center">
          NIK
        </div>
        <form onSubmit={onSubmit} className="flex flex-col">
          <input
            maxLength={NIK_LENGTH}
            readOnly={readNIK.isLoading}
            className={`
          ${match(inputLength)
            .with(NIK_LENGTH, () => "border-green-600")
            .when(
              (length) => length < NIK_LENGTH && length >= 1,
              () => "border-red-400",
            )
            .otherwise(() => "border-garis")}
            w-full text-xl text-center mt-2 space-x-1 border-b-2 outline-none`}
            onChange={(e) => {
              // get only numbers
              const value = e.target.value.replace(/\D/g, "");
              e.target.value = value;
              formSetValue("nik", value);
              formTrigger("nik");
            }}
          />
          <button
            disabled={!isValid || readNIK.isLoading}
            className={`w-full bg-green-600 text-white mt-4 px-3 py-1 shadow-lg rounded-md flex items-center gap-x-2 transition-all
            justify-center ${
              readNIK.isLoading
                ? "cursor-not-allowed"
                : " hover:bg-green-800 disabled:bg-gray-300"
            }`}
            type="submit"
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
              type="button"
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
  children: ReactNode;
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
