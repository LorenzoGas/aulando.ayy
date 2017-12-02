/* Aule libere al momento, dove momento = ora X , giorno = G, dipartimento = D*/
SELECT a.nome, MIN(DATE_FORMAT(inizio, '%H:%i'))as fino
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
ORDER BY IFNULL(MIN(l.inizio),'24:00') DESC

	

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

/* Orario aula X, il giorno Y, dipartimento D */
SELECT d.cognomenome as docente, m.nome as materia, DATE_FORMAT(inizio, '%H:%i')as inizio, DATE_FORMAT(fine, '%H:%i')as fine
FROM Aula a
	JOIN Dipartimento di ON a.dipartimento = di.id AND di.id = 'D'
	JOIN AulaLezione al ON a.id = al.aula
	JOIN Lezione l ON al.lezione = l.id
	JOIN Materia m ON l.materia = m.id 
	JOIN Docente d ON l.docente = d.id
WHERE	a.nome = 'X'
AND		l.giorno = 'Y'
ORDER BY l.inizio
