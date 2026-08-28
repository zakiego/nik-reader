import { format, parse } from "date-fns";
import { z } from "zod";

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

    if (id > 40) {
      return "PEREMPUAN";
    }

    return "LAKI-LAKI";
  } catch (error) {
    return null;
  }
};

export const getBirthDate = ({
  idBirthDate,
}: {
  idBirthDate: number | string;
}) => {
  try {
    const id = z.coerce.string().parse(idBirthDate);

    const rawDay = id.substring(0, 2);
    const day = parseInt(rawDay) > 40 ? parseInt(rawDay) - 40 : rawDay;
    const month = id.substring(2, 4);
    // TODO: im not sure about this to hanle 2 digit year
    const year =
      parseInt(id.substring(4, 6)) < 22
        ? `20${id.substring(4, 6)}`
        : `19${id.substring(4, 6)}`;

    const date = parse(`${day}/${month}/${year}`, "dd/MM/yyyy", new Date());

    return format(date, "dd/MM/yyyy");
  } catch (error) {
    return null;
  }
};
