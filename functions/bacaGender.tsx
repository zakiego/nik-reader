const BacaGender = (idGender, setGender) => {
	idGender > 40 ? setGender("Perempuan") : setGender("Laki-laki");
};

export default BacaGender;
