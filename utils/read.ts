import {
  extractIdsFromNIK,
  getBirthDate,
  getGender,
  getKabupaten,
  getKecamatan,
  getProvinsi,
} from "~/utils/extract";

export const extractDataFromNIK = (nik: string) => {
  const { idProv, idKab, idKec, idGender, idBirthDate, idUniqueId } =
    extractIdsFromNIK(nik);

  const prov = getProvinsi({ idProv });
  const kab = getKabupaten({ idKab });
  const kec = getKecamatan({ idKec });
  const gender = getGender({ idGender });
  const birthDate = getBirthDate({ idBirthDate });

  const data = {
    provinsi: prov,
    kabupaten: kab,
    kecamatan: kec,
    gender: gender,
    birthDate: birthDate,
    uniqueId: idUniqueId,
  };

  return data;
};
