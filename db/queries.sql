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

/** Lista Docenti per dipartimento X**/
SELECT a.cognomenome, a.id, a.codice FROM Docente a 
JOIN Lezione l ON l.docente = a.id
JOIN AulaLezione al ON al.lezione = l.id
JOIN Aula au ON au.id = al.aula
JOIN Dipartimento d ON d.id = au.dipartimento
WHERE d.id = 'X'
GROUP BY a.cognomenome  
/** Lista corsi per dipartimento X**/
SELECT c.nome, c.id, c.codice FROM Corso c
JOIN Subcorso s ON s.corso = c.id
JOIN MateriaSubcorso ms ON ms.subcorso = s.id
JOIN Materia m ON m.id = ms.materia
JOIN Lezione l ON l.materia = m.id
JOIN AulaLezione al ON al.lezione = l.id
JOIN Aula a ON a.id = al.aula
JOIN Dipartimento d ON d.id = a.dipartimento
WHERE d.id = 'X'
GROUP BY c.id
/** Lista subcorsi per corso X**/
SELECT s.nome, s.id, s.codice FROM Corso c
JOIN Subcorso s ON s.corso = c.id
WHERE c.id = 'X'
GROUP BY s.nome
/** Lista materie per subcorso X**/
SELECT m.nome, m.id FROM Materia m 
JOIN MateriaSubcorso ms ON ms.materia = m.id
JOIN Subcorso s ON s.id = ms.subcorso
WHERE s.id = 'X'
GROUP BY m.nome