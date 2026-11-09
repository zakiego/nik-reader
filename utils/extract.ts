import { differenceInYears, format, isAfter, isValid, parse } from "date-fns";
import { z } from "zod";
import { GENDER } from "~/lib/gender";

/**
 * Pure decoders for the parts of a NIK that the digits carry on their own.
 *
 * Nothing here touches the region datasets, so this module stays small enough to
 * live in the client bundle. The region lookups sit in `~/utils/read`, which
 * loads the datasets lazily.
 */

export function extractIdsFromNIK(NIK: string) {
  const idProv = NIK.substring(0, 2);
  const idKab = NIK.substring(0, 4);
  const idKec = NIK.substring(0, 6);
  const idGender = NIK.substring(6, 8);
  const idBirthDate = NIK.substring(6, 12);
  const idUniqueId = NIK.substring(12, 16);

  return {
    idProv,
    idKab,
    idKec,
    idGender,
    idBirthDate,
    idUniqueId,
  };
}

export const getGender = ({ idGender }: { idGender: string | number }) => {
  try {
    const id = z.coerce.number().parse(idGender);
    const gender = GENDER.find((g) =>
      id > 40 ? g.value === "P" : g.value === "L",
    );

    return gender ? `${gender.symbol} ${gender.label}` : null;
  } catch (error) {
    return null;
  }
};

export type BirthDateDetails = {
  date: Date;
  /** Whole years old on `now`. */
  age: number;
  /**
   * The 1900s reading when the decoder picked the 2000s. NIK keeps only two
   * digits of the year, so someone born in 1925 and someone born in 2025 share
   * the same digits. Null when the 2000s reading would be a future date, which
   * leaves the 1900s as the only option.
   */
  otherCenturyYear: number | null;
};

/**
 * Decodes digits 7-12 of a NIK (DDMMYY, day + 40 for women) into a birth date.
 *
 * The 2000s reading wins unless it lands after `now`, because nobody can be
 * born in the future. That covers both a year past the current one and a
 * later month of the current year. `now` is a parameter so the century pivot
 * stays testable.
 */
export const getBirthDateDetails = ({
  idBirthDate,
  now = new Date(),
}: {
  idBirthDate: number | string;
  now?: Date;
}): BirthDateDetails | null => {
  const id = String(idBirthDate);
  if (!/^\d{6}$/.test(id)) return null;

  const rawDay = Number(id.substring(0, 2));
  const day = String(rawDay > 40 ? rawDay - 40 : rawDay).padStart(2, "0");
  const month = id.substring(2, 4);
  const yy = id.substring(4, 6);

  const readAs = (century: "19" | "20") =>
    parse(`${day}/${month}/${century}${yy}`, "dd/MM/yyyy", now);

  const asTwentyFirst = readAs("20");
  if (!isValid(asTwentyFirst)) return null;

  const pickedTwentyFirst = !isAfter(asTwentyFirst, now);
  const date = pickedTwentyFirst ? asTwentyFirst : readAs("19");

  return {
    date,
    age: differenceInYears(now, date),
    otherCenturyYear: pickedTwentyFirst ? Number(`19${yy}`) : null,
  };
};

/** The decoded birth date as dd/MM/yyyy, or null when the digits aren't a date. */
export const getBirthDate = ({
  idBirthDate,
  now,
}: {
  idBirthDate: number | string;
  now?: Date;
}) => {
  const details = getBirthDateDetails({ idBirthDate, now });

  return details ? format(details.date, "dd/MM/yyyy") : null;
};
