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
ORDER BY minimo
	

/* Aule libere dalle X alle Y */
