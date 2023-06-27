import { supabase } from "~/lib/supabase";

const BacaKab = async (idKab, setKab, setStatus) => {
	const { data, error } = await supabase
		.from("kabupaten")
		.select("name")
		.match({ idKab: idKab });

	if (error) {
		setStatus("error");
	} else if (data.length == 1) {
		setKab(data[0].name);
	} else {
		setStatus("error");
	}
};

export default BacaKab;
