var listaAule = "SELECT a.nome, a.codice FROM Aula a, Dipartimento d WHERE d.codice = ?";
var listaDipartimenti = "SELECT * FROM Dipartimento";
var listaDocenti = "SELECT * FROM Docente a, Dipartimento d WHERE d.codice = ?";
var listaMaterie = "SELECT * FROM Materia m, Dipartimento d WHERE d.codice = ?";
var listaCorsi = "SELECT * FROM Corso c, Dipartimento d WHERE d.codice = ?";
var listaSubcorsi = "SELECT * FROM Subcorso s, Corso c WHERE c.codice = ?";

var auleLibereOra = "SELECT a.nome, MIN(l.inizio)as minimo FROM Aula a JOIN Dipartimento d ON a.dipartimento = d.id AND d.id = 2 LEFT JOIN AulaLezione al ON al.aula = a.id LEFT JOIN Lezione l ON al.lezione = l.id AND l.giorno = '2017-11-17' AND l.inizio > '1030' WHERE 	a.id NOT IN( SELECT 	a.id FROM	Aula a JOIN 	AulaLezione al ON a.id = al.aula JOIN	Lezione l ON l.id = al.lezione WHERE	l.giorno 	= '2017-11-17 AND		l.inizio 	<= '1030' AND		l.fine 		> '1030') GROUP BY a.nome ORDER BY IFNULL(MIN(l.inizio),'2400') DESC";

exports.listaAule = listaAule;
exports.listaDipartimenti = listaDipartimenti;
exports.listaMaterie = listaMaterie;
exports.listaDocenti = listaDocenti;
exports.listaCorsi = listaCorsi;
exports.listaSubcorsi = listaSubcorsi;