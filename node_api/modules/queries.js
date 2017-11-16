var listaAule = "SELECT a.nome, a.codice FROM Aula a, Dipartimento d WHERE d.codice = ?";
var listaDipartimenti = "SELECT * FROM Dipartimento";

exports.listaAule = listaAule;
exports.listaDipartimenti = listaDipartimenti;