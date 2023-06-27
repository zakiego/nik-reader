import { useState } from "react";

import { Baca, Prediksi } from "~/components/pages";

export default function Home() {
	const [page, setPage] = useState(<Baca />);
	const [select, setSelect] = useState("Baca");

	return (
		<div className="px-4 py-9 max-w-3xl mx-auto">
			<div className="flex items-center text-hitam space-x-1">
				<div className="h-5 w-5 bg-hitam-900 rounded-md" />
				<div className="text-2xl font-black">NIK</div>
			</div>
			<div className="mt-8 bg-hitam-50 flex items-center rounded-2xl">
				<div className="py-1.5 px-1.5 w-1/2 text-center">
					<button
						onClick={() => {
							page != <Baca /> ? setPage(<Baca />) : "";
							setSelect("Baca");
						}}
						className={` ${
							select == "Baca"
								? "text-hitam-900/90 font-bold bg-white shadow-lg "
								: "text-hitam-900/50"
						}
						w-full transition-all py-1 text-lg rounded-2xl hover:text-hitam-900/90 hover:font-bold hover:bg-white hover:shadow-lg `}
					>
						Baca
					</button>
				</div>
				<div className="py-1.5 px-1.5 w-1/2 text-center">
					<button
						onClick={() => {
							page != <Prediksi /> ? setPage(<Prediksi />) : "";
							setSelect("Prediksi");
						}}
						className={` ${
							select == "Prediksi"
								? "text-hitam-900/90 font-bold bg-white shadow-lg "
								: "text-hitam-900/50"
						}
						w-full transition-all py-1 text-lg rounded-2xl hover:text-hitam-900/90 hover:font-bold hover:bg-white hover:shadow-lg `}
					>
						Prediksi
					</button>
				</div>
			</div>
			{page}
		</div>
	);
}
