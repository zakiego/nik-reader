import { z } from "zod";
import { KECAMATAN } from "~/lib/kecamatan";
import { format, parse } from "date-fns";
import { PROVINSI } from "~/lib/provinsi";
import { KABUPATEN } from "~/lib/kabupaten";

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

export const getProvinsi = ({ idProv }: { idProv: string }) => {
  const prov = PROVINSI.find((p) => p.idProv === idProv);
  return prov?.name || null;
};

export const getKabupaten = ({ idKab }: { idKab: string }) => {
  const kab = KABUPATEN.find((k) => k.idKab === idKab);
  return kab?.name || null;
};

export const getKecamatan = ({ idKec }: { idKec: string }) => {
  const kec = KECAMATAN.find((k) => k.idKec === idKec);
  return kec?.name?.toUpperCase() || null;
};

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
