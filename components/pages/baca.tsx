import { useState } from "react";
// import {
// 	BacaProv,
// 	BacaKab,
// 	BacaKec,
// 	BacaGender,
// 	BacaUniqueId,
// 	BacaDate,
// } from "~/functions/";

const Baca = () => {
  const [status, setStatus] = useState("");

  const [len, setLen] = useState(0);

  const [prov, setProv] = useState("-");
  const [kab, setKab] = useState("-");
  const [kec, setKec] = useState("-");
  const [gender, setGender] = useState("-");
  const [date, setDate] = useState("-");
  const [uniqueId, setUniqueId] = useState("-");

  const [idProv, setIdProv] = useState(null);
  const [idKab, setIdKab] = useState(null);
  const [idKec, setIdKec] = useState(null);
  const [idGender, setIdGender] = useState(null);
  const [idDate, setIdDate] = useState(null);
  const [idUniqueId, setIdUniqueId] = useState(null);

  const inputHandler = (e) => {
    const NIK = e.target.value;
    setLen(NIK.length);
    setIdProv(NIK.substring(0, 2));
    setIdKab(NIK.substring(0, 4));
    setIdKec(NIK.substring(0, 6));
    setIdGender(NIK.substring(6, 8));
    setIdDate(NIK.substring(6, 12));
    setIdUniqueId(NIK.substring(12, 16));
  };

  const submitHandler = (e) => {
    e.preventDefault();

    setStatus("");

    if (len == 16) {
      // BacaProv(idProv, setProv, setStatus);
      // BacaKab(idKab, setKab, setStatus);
      // BacaKec(idKec, setKec, setStatus);
      // BacaGender(idGender, setGender);
      // BacaUniqueId(idUniqueId, setUniqueId, setStatus);
      // BacaDate(idDate, setDate, setStatus);
    } else {
      setStatus("error");
    }
  };

  const cleaner = () => {
    setProv("-");
    setKab("-");
    setKec("-");
    setGender("-");
    setDate("-");
    setUniqueId("-");
    setStatus("");
  };

  return (
    <>
      <div className="mt-10">
        <div className="font-medium text-hitam-100 text-xl text-center">
          NIK
        </div>
        <form onSubmit={submitHandler} className="flex flex-col">
          <input
            maxLength={16}
            onChange={inputHandler}
            className={`${
              len == 16
                ? "border-green-600"
                : len < 16 && len > 1
                ? "border-red-400"
                : "border-garis"
            }  text-xl text-center mt-2 space-x-1 border-b-2 outline-none`}
          />
          <button
            disabled={len == 16 ? false : true}
            className={`${
              len == 16 ? "bg-green-600" : "disabled:bg-gray-300 "
            } mt-4 hover:bg-green-800 text-white px-3 py-1 shadow-lg rounded-md`}
          >
            Baca
          </button>
        </form>
      </div>
      <div className="mt-16 bg-hitam-900 text-white px-7 py-6 rounded-md">
        <div className="font-bold text-xl flex justify-between">
          <div>Detail</div>
          <button
            onClick={cleaner}
            className="text-white/60 hover:text-red-500"
          >
            <RemoveIcon />
          </button>
        </div>

        <div className="mt-7 font-medium space-y-5">
          <div className="">
            <div className="text-hitam-100 text-sm">Provinsi</div>
            <div>{status == "error" ? "ERROR" : prov}</div>
          </div>
          <div className="flex justify-between">
            <div className="w-7/12">
              <div className="text-hitam-100 text-sm">Kabupaten</div>
              <div>{status == "error" ? "ERROR" : kab}</div>
            </div>
            <div className="w-5/12">
              <div className="text-hitam-100 text-sm">Kecamatan</div>
              <div>{status == "error" ? "ERROR" : kec.toUpperCase()}</div>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="w-7/12">
              <div className="text-hitam-100 text-sm">Jenis Kelamin</div>
              <div>{status == "error" ? "ERROR" : gender.toUpperCase()}</div>
            </div>
            <div className="w-5/12">
              <div className="text-hitam-100 text-sm">Tanggal Lahir</div>
              <div>{status == "error" ? "ERROR" : date.toUpperCase()}</div>
            </div>
          </div>

          <div className="">
            <div className="text-hitam-100 text-sm">ID Unik</div>
            <div>{status == "error" ? "ERROR" : uniqueId}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Baca;

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
