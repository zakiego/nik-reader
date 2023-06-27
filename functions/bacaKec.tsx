import { supabase } from "~/lib/supabase";

const BacaKec = async (idKec, setKec, setStatus) => {
  const { data, error } = await supabase
    .from("kecamatan")
    .select("name")
    .match({ idKec: idKec });

  if (error) {
    setStatus("error");
  } else if (data.length == 1) {
    setKec(data[0].name);
  } else {
    setStatus("error");
  }
};

export default BacaKec;
