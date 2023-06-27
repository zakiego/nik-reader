import { supabase } from "~/lib/supabase";

const Provinsi = () => {
	const getProvinsi = async () => {
		const { data, error } = await supabase
			.from("provinsi")
			.select("idProv, name");
		console.log(data);
	};
	getProvinsi();
	return <div>Ok</div>;
};

export default Provinsi;
