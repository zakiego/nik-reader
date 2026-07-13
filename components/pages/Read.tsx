import {
  CheckCircleIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { IdentificationIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { NIK_LENGTH } from "~/lib/const";
import { type NikInput, nikSchema } from "~/lib/nik-schema";
import { trpc } from "~/utils/trpc";

export const Read = () => {
  const {
    watch,
    formState: { isValid },
    handleSubmit,
    setValue: formSetValue,
    trigger: formTrigger,
  } = useForm<NikInput>({
    resolver: zodResolver(nikSchema),
  });

  const inputLength = watch("nik")?.length || 0;
  const isComplete = inputLength === NIK_LENGTH;
  const isPartial = inputLength > 0 && inputLength < NIK_LENGTH;
  const remaining = NIK_LENGTH - inputLength;

  const readNIK = trpc.nik.read.useMutation();
  const { data, isLoading } = readNIK;
  const hasResult = !!data;

  const onSubmit = handleSubmit((values: NikInput) => {
    readNIK.mutate(values);
  });

  return (
    <div className="mt-8">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <label
              htmlFor="nik-input"
              className="text-sm font-medium text-content"
            >
              Nomor Induk Kependudukan
            </label>
            <span
              className={`tabular text-xs font-medium ${
                isComplete
                  ? "text-success"
                  : isPartial
                    ? "text-danger"
                    : "text-faint"
              }`}
            >
              {inputLength}/{NIK_LENGTH}
            </span>
          </div>

          <div className="relative mt-2">
            <input
              id="nik-input"
              inputMode="numeric"
              autoComplete="off"
              placeholder="Ketik 16 digit NIK…"
              aria-describedby="nik-hint"
              aria-invalid={isPartial}
              maxLength={NIK_LENGTH}
              readOnly={isLoading}
              className={`tabular w-full rounded-xl border bg-surface px-4 py-3 text-center font-mono text-lg tracking-[0.25em] text-content outline-none transition-colors placeholder:font-sans placeholder:tracking-normal placeholder:text-faint read-only:cursor-not-allowed read-only:opacity-70 focus:ring-2 focus:ring-primary/25 ${
                isComplete
                  ? "border-success"
                  : isPartial
                    ? "border-danger"
                    : "border-line focus:border-primary"
              }`}
              onChange={(e) => {
                // Keep only digits (NIK is numeric).
                const value = e.target.value.replace(/\D/g, "");
                e.target.value = value;
                formSetValue("nik", value);
                formTrigger("nik");
              }}
            />
            {isComplete && (
              <CheckCircleIcon
                className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-success"
                aria-hidden="true"
              />
            )}
          </div>

          <p
            id="nik-hint"
            className={`mt-1.5 text-xs ${
              isComplete
                ? "text-success"
                : isPartial
                  ? "text-danger"
                  : "text-muted"
            }`}
          >
            {isComplete
              ? "NIK lengkap, tekan Baca untuk melihat detail."
              : isPartial
                ? `Kurang ${remaining} digit lagi.`
                : "Masukkan 16 digit angka NIK untuk membaca detailnya."}
          </p>
        </div>

        <button
          disabled={!isValid || isLoading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-fg shadow-sm outline-none transition duration-150 ease-out hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
          type="submit"
        >
          {isLoading ? (
            <>
              <AiOutlineLoading3Quarters
                className="h-4 w-4 animate-spin"
                aria-hidden="true"
              />
              Memproses…
            </>
          ) : (
            <>
              <MagnifyingGlassIcon className="h-4 w-4" aria-hidden="true" />
              Baca NIK
            </>
          )}
        </button>
      </form>

      <section
        aria-live="polite"
        className="mt-8 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-panel ring-1 ring-white/10"
      >
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4 sm:px-7">
          <div className="flex items-center gap-2">
            <IdentificationIcon
              className="h-5 w-5 text-slate-300"
              aria-hidden="true"
            />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              Detail NIK
            </h2>
          </div>
          {hasResult && (
            <button
              onClick={() => readNIK.reset()}
              className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/50"
              type="button"
              aria-label="Hapus hasil"
            >
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="px-6 py-6 sm:px-7">
          {isLoading || hasResult ? (
            <dl className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
              <Field
                label="Provinsi"
                isLoading={isLoading}
                className="sm:col-span-2"
              >
                {data?.provinsi}
              </Field>
              <Field label="Kabupaten / Kota" isLoading={isLoading}>
                {data?.kabupaten}
              </Field>
              <Field label="Kecamatan" isLoading={isLoading}>
                {data?.kecamatan}
              </Field>
              <Field label="Jenis Kelamin" isLoading={isLoading}>
                {data?.gender}
              </Field>
              <Field label="Tanggal Lahir" isLoading={isLoading}>
                {data?.birthDate}
              </Field>
              <Field
                label="ID Unik"
                isLoading={isLoading}
                mono
                className="sm:col-span-2"
              >
                {data?.uniqueId}
              </Field>
            </dl>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-white/5 ring-1 ring-white/10">
                <IdentificationIcon
                  className="h-6 w-6 text-slate-500"
                  aria-hidden="true"
                />
              </div>
              <p className="max-w-xs text-sm text-slate-400">
                Detail akan muncul di sini setelah kamu menekan{" "}
                <span className="font-medium text-slate-200">Baca</span>.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const Field = ({
  label,
  isLoading,
  mono,
  className,
  children,
}: {
  label: string;
  isLoading: boolean;
  mono?: boolean;
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div className={className}>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd
        className={`mt-1 text-[15px] font-medium text-white ${
          mono ? "tabular font-mono" : ""
        }`}
      >
        <NullGuard isLoading={isLoading}>{children}</NullGuard>
      </dd>
    </div>
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
    return (
      <span className="block h-5 w-3/4 animate-pulse rounded bg-white/10" />
    );
  }

  if (children === null) {
    return <span className="text-red-400">Tidak ditemukan</span>;
  }

  if (children === undefined) {
    return <span className="text-slate-500">-</span>;
  }

  return <span>{children}</span>;
};
