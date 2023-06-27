const BacaDate = (idDate, setDate, setStatus) => {
	if (idDate.length == 6) {
		const idTanggal = parseInt(idDate.substring(0, 2));
		const tanggal = idTanggal > 40 ? idTanggal - 40 : idTanggal;

		const dataBulan = [
			{
				id: 1,
				nama: "Januari",
			},
			{
				id: 2,
				nama: "Februari",
			},
			{
				id: 3,
				nama: "Maret",
			},
			{
				id: 4,
				nama: "April",
			},
			{
				id: 5,
				nama: "Mei",
			},
			{
				id: 6,
				nama: "Juni",
			},
			{
				id: 7,
				nama: "Juli",
			},
			{
				id: 8,
				nama: "Agustus",
			},
			{
				id: 9,
				nama: "September",
			},
			{
				id: 10,
				nama: "Oktober",
			},
			{
				id: 11,
				nama: "November",
			},
			{
				id: 12,
				nama: "Desember",
			},
		];

		const idBulan = parseInt(idDate.substring(2, 4));
		const bulan = dataBulan[idBulan - 1].nama;

		const idTahun = idDate.substring(4, 6);
		const intTahun = parseInt(idDate.substring(4, 6));
		const tahun = intTahun <= 21 ? "20" + idTahun : "19" + idTahun;

		setDate(`${tanggal} ${bulan} ${tahun}`);
	} else {
		setStatus("error");
	}
};

export default BacaDate;
// 630103070700006
