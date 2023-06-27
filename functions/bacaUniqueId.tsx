const BacaUniqueId = (idUniqueId, setUniqueId, setStatus) => {
	idUniqueId.length == 4 ? setUniqueId(idUniqueId) : setStatus("error");
};

export default BacaUniqueId;
