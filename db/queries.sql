/* Aule libere al momento, dove momento = ora X , giorno = G, dipartimento = D*/
SELECT a.nome, MIN(l.inizio)as minimo
FROM Aula a
JOIN Dipartimento d ON a.dipartimento = d.id AND d.id = 'D'
LEFT JOIN AulaLezione al ON al.aula = a.id
LEFT JOIN Lezione l ON al.lezione = l.id AND l.giorno = 'G' AND l.inizio > 'X'
WHERE 	a.id NOT IN(
	SELECT 	a.id 
	FROM	Aula a 
	JOIN 	AulaLezione al ON a.id = al.aula
	JOIN	Lezione l ON l.id = al.lezione
	WHERE	l.giorno 	= 'G'
	AND		l.inizio 	<= 'X'
	AND		l.fine 		> 'X')
GROUP BY a.nome
ORDER BY IFNULL(MIN(l.inizio),'2400') DESC

	

/* Aule libere dalle X alle Y */
SELECT 	nome 
FROM 	aula
WHERE 	dipartimento = 'd'
AND 	id NOT IN(
	SELECT a.id
	FROM Aula a 
		JOIN AulaLezione al ON a.id = al.aula
		JOIN Lezione l ON l.id = al.lezione 
	AND 	l.giorno = 'Z'
	AND		((l.fine <= 'Y' AND l.fine > 'X') 
		OR
			(l.inizio >= 'X' AND l.inizio < 'Y'))
	GROUP BY a.nome)

/* Orario aula X, il giorno Y */
SELECT d.nome, m.nome, l.inizio, l.fine
FROM Aula a
	JOIN AulaLezione al ON a.id = al.aula
	JOIN Lezione l ON al.lezione = l.id
	JOIN Materia m ON l.materia = m.id 
	JOIN Docente d ON l.docente = d.id
WHERE	a.codice = 'X'
AND		l.giorno = 'Y'
ORDER BY l.inizio
