CREATE DATABASE IF NOT EXISTS aulando;
USE aulando;
CREATE TABLE Docente(
	id 		INT AUTO_INCREMENT,
	codice 	VARCHAR(255),
	nome 	VARCHAR(255) NOT NULL,
	cognome VARCHAR(255) NOT NULL,
	CONSTRAINT PKDocente PRIMARY KEY (id)
);
CREATE TABLE Corso(
	id		INT AUTO_INCREMENT,
	codice 	VARCHAR(255),
	nome 	VARCHAR(255) NOT NULL,
	CONSTRAINT PKCorso PRIMARY KEY (id)
);
CREATE TABLE Subcorso(
	id		INT AUTO_INCREMENT,
	nome 	VARCHAR(255) NOT NULL,
	codice	VARCHAR(255),
	corso	INT NOT NULL,
	CONSTRAINT PKSubcorso PRIMARY KEY (id),
	CONSTRAINT FKcorsoSubcorso FOREIGN KEY (corso) REFERENCES Corso(id)
);
CREATE TABLE Materia(
	id		INT AUTO_INCREMENT,
	nome 	VARCHAR(255) NOT NULL,
	CONSTRAINT PKMateria PRIMARY KEY (id)
);
CREATE TABLE Dipartimento(
	id 		INT AUTO_INCREMENT,
	codice	VARCHAR(255),
	nome 	VARCHAR(255) NOT NUlL,
	CONSTRAINT PKDipartimento PRIMARY KEY (id)
);
CREATE TABLE Polo(
	id 				INT AUTO_INCREMENT,
	codice			VARCHAR(255),
	nome 			VARCHAR(255) NOT NULL,
	dipartimento	INT NOT NULL,
	CONSTRAINT PKPolo PRIMARY KEY (id),
	CONSTRAINT FKdipartimentoPolo FOREIGN KEY (dipartimento) REFERENCES Dipartimento(id)
);
CREATE TABLE Aula(
	id				INT AUTO_INCREMENT,
	codice			VARCHAR(255) NOT NULL,
	nome 			VARCHAR(255) NOT NULL,
	polo 			INT,
	piano 			VARCHAR(255),
	dipartimento 	INT NOT NULL,
	CONSTRAINT PKAula PRIMARY KEY (id),
	CONSTRAINT FKPoloAula FOREIGN KEY (polo) REFERENCES Polo(id),
	CONSTRAINT FKDipartimentoAula FOREIGN KEY (dipartimento) REFERENCES Dipartimento(id)

);
CREATE TABLE Lezione(
	id				INT AUTO_INCREMENT,
	docente			INT NOT NULL,
	materia			INT NOT NULL,
	aula			INT NOT NULL,
	inizio			INT(4) NOT NULL,
	fine			INT(4) NOT NULL,
	giorno			DATE NOT NULL,
	tipologia		VARCHAR(255) NOT NULL,
	CONSTRAINT PKLezione 			PRIMARY KEY (id),
	CONSTRAINT FKdocenteLezione 	FOREIGN KEY (docente) 	REFERENCES Docente(id),
	CONSTRAINT FKmateriaLezione 	FOREIGN KEY (materia) 	REFERENCES Materia(id),
	CONSTRAINT FKaulaLezione 		FOREIGN KEY (aula) 		REFERENCES Aula(id)
);
CREATE TABLE MateriaSubcorso(
	id		INT AUTO_INCREMENT,
	materia	INT NOT NULL,
	subcorso	INT NOT NULL,
	CONSTRAINT MateriaSubcorso 			PRIMARY KEY (id),
	CONSTRAINT FKMateriaMateriaSubcorso 	FOREIGN KEY (materia) 	REFERENCES Materia(id),
	CONSTRAINT FKCorsoMateriaSubcorso 		FOREIGN KEY (subcorso ) REFERENCES Subcorso(id)
);