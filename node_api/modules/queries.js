var listaAule = "SELECT a.nome, a.codice FROM Aula a, Dipartimento d WHERE d.codice = ?";
var listaDipartimenti = "SELECT * FROM Dipartimento";
var listaDocenti = "SELECT * FROM Docente a, Dipartimento d WHERE d.codice = ?";
var listaMaterie = "SELECT * FROM Materia m, Dipartimento d WHERE d.codice = ?";
var listaCorsi = "SELECT * FROM Corso c, Dipartimento d WHERE d.codice = ?";
var listaSubcorsi = "SELECT * FROM Subcorso s, Corso c WHERE c.codice = ?";

exports.listaAule = listaAule;
exports.listaDipartimenti = listaDipartimenti;
exports.listaMaterie = listaMaterie;
exports.listaDocenti = listaDocenti;
exports.listaCorsi = listaCorsi;
exports.listaSubcorsi = listaSubcorsi;