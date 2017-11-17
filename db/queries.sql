/* Aule libere al momento, dove momento = ora X */
SELECT a.nome, MIN(l.inizio) as minimo
FROM Aula a LEFT JOIN Lezione l ON a.id = l.aula
WHERE 	id NOT IN(
	SELECT 	a.id 
	FROM	Aula a INNER JOIN Lezione l 
		ON	a.id = l.aula
	WHERE	l.giorno 	= 'giorno'
	AND		l.inizio 	<= 'X'
	AND		l.fine 		> 'X')
AND		l.giorno = 'giorno' 	
AND		l.inizio > 'X'
GROUP BY a.nome

	

/* Aule libere dalle X alle Y */
SELECT a.nome
FROM Aula a LEFT JOIN Lezione l ON a.id = l.aula
WHERE 	l.giorno != 'Z'
OR		l.fine <= 'X'
OR		l.inizio >= 'Y'
GROUP BY a.nome

/* Orario aula X, il giorno Y */
SELECT d.nome, m.nome, l.inizio, l.fine
FROM Aula a
	JOIN AulaLezione al ON a.id = al.aula
	JOIN Lezione l ON al.lezione = l.id
	JOIN Materia m ON l.materia = m.id 
	JOIN Docente d ON l.docente = d.id
WHERE	a.codice = 'X'
AND		l.giorno = 'Y'


