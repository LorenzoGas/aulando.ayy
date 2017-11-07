CREATE TABLE Professore(
	id 		INT,
	nome 	VARCHAR(255) NOT NULL,
	cognome VARCHAR(255) NOT NULL,
	CONSTRAINT PKProfessore PRIMARY KEY (id)
);
CREATE TABLE Materia(
	id		INT,
	nome 	VARCHAR(255) NOT NULL,
	anno 	VARCHAR(255),
	CONSTRAINT PKMateria PRIMARY KEY (id)
);
CREATE TABLE Aula(
	id		INT,
	codice	VARCHAR(255) NOT NULL,
	nome 	VARCHAR(255) NOT NULL,
	polo 	VARCHAR(255),
	piano 	VARCHAR(255),
	CONSTRAINT PKAula PRIMARY KEY (id)
);
CREATE TABLE Lezione(
	id				INT,
	professore		INT NOT NULL,
	materia			INT NOT NULL,
	aula			INT NOT NULL,
	inizio			INT(4) NOT NULL,
	fine			INT(4) NOT NULL,
	giorno			DATETIME NOT NULL,
	tipologia		VARCHAR(255) NOT NULL,
	CONSTRAINT PKidLezione 			PRIMARY KEY (id),
	CONSTRAINT FKprofessoreLezione 	FOREIGN KEY (professore) 	REFERENCES Professore(id),
	CONSTRAINT FKmateriaLezione 	FOREIGN KEY (materia) 		REFERENCES Materia(id),
	CONSTRAINT FKaulaLezione 		FOREIGN KEY (aula) 			REFERENCES Aula(id)
);