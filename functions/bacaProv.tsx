import { supabase } from "~/lib/supabase";

const BacaProv = async (idProv, setProv, setStatus) => {
	const { data, error } = await supabase
		.from("provinsi")
		.select("name")
		.match({ idProv: idProv });

	if (error) {
		setStatus("error");
	} else if (data.length == 1) {
		setProv(data[0].name);
	} else {
		setStatus("error");
	}
};

export default BacaProv;
