/*globals require, console, process */
var mysql = require('mysql');
var query = require("queries.js");
// instantiate mysql
var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	database: "aulando",
	password: "root"
});
con.connect(function(err) {
	if (err) 
		throw err;
	console.log("Connected!");
});

/**
 * @description restituisce le aule libere al momento
 * @argument giorno giorno nel formato 'gg-mm-aaaa'
 * @argument ora ora nel formato militare 24h senza separatori. Es: 24:00 -> '0000', 23:59 -> '2359'
 * @return lista di aule in JSON
 */
var aulaLibera = function(giorno,ora){
    sql = "";
    con.connect(function(err) {
        if (err) throw err;
        con.query(sql, [giorno,ora], function (err, result) {
            if (err) throw err;
            return(result);
        });
    });
}

/**
 * @description restituisce le aule libere al momento
 * @argument giorno giorno nel formato 'gg-mm-aaaa'
 * @argument dalle ora iniziale nel formato militare 24h senza separatori. Es: 24:00 -> '0000', 23:59 -> '2359'
 * @argument alle ora finale nel formato militare 24h senza separatori. Es: 24:00 -> '0000', 23:59 -> '2359'
 * @return lista di aule in JSON
 */
var aulaLiberaDalleAlle = function(giorno,dalle,alle){
    sql = "";
    con.connect(function(err) {
        if (err) throw err;
        con.query(sql, [giorno,dalle,alle], function (err, result) {
            if (err) throw err;
            return(result);
        });
    });
}

/**
 * @description restituisce l'orario giornaliero di una certa aula
 * @argument giorno giorno nel formato 'gg-mm-aaaa'
 * @argument aula aula nel formato 'B107'
 * @return lista di lezioni in JSON
 */
var orarioAula = function(aula,giorno){
    sql = "";
    con.connect(function(err) {
        if (err) throw err;
        con.query(sql, [aula,giorno], function (err, result) {
            if (err) throw err;
            return(result);
        });
    });
}

//Funzioni per la restituzione del database pure, senza calcoli
/**
 * @description lista dei dipartimenti esistenti
 * @returns lista dei dipartimenti in JSON
 */
var listaDipartimenti = function(){
    sql = query.listaDipartimenti;
    con.connect(function(err) {
        if (err) throw err;
        con.query(sql, function (err, result) {
            if (err) throw err;
            return(result);
        });
    });
}
/**
 * @description lista delle aule esistenti, dato un dipartimento
 * @argument dipartimento codice del dipartimento
 * @returns lista delle aula in JSON
 */
var listaAule = function(dipartimento){
    sql = query.listaAule;
    con.connect(function(err) {
        if (err) throw err;
        con.query(sql,[dipartimento], function (err, result) {
            if (err) throw err;
            return(result);
        });
    });
}
/**
 * @description lista dei docenti esistenti, dato un dipartimento
 * @argument dipartimento codice del dipartimento
 * @returns lista dei docenti in JSON
 */
var listaDocenti = function(dipartimento){
    sql = query.listaDocenti;
    con.connect(function(err) {
        if (err) throw err;
        con.query(sql,[dipartimento], function (err, result) {
            if (err) throw err;
            return(result);
        });
    });
}
/**
 * @description lista delle materie esistenti, dato un dipartimento
 * @argument dipartimento codice del dipartimento
 * @returns lista delle materie in JSON
 */
var listaMaterie = function(dipartimento){
    sql = query.listaMaterie;
    con.connect(function(err) {
        if (err) throw err;
        con.query(sql,[dipartimento], function (err, result) {
            if (err) throw err;
            return(result);
        });
    });
}
/**
 * @description lista dei corsi esistenti, dato un dipartimento
 * @argument dipartimento codice del dipartimento
 * @returns lista dei corsi in JSON
 */
var listaMaterie = function(dipartimento){
    sql = query.listaCorsi;
    con.connect(function(err) {
        if (err) throw err;
        con.query(sql,[dipartimento], function (err, result) {
            if (err) throw err;
            return(result);
        });
    });
}
/**
 * @description lista dei subcorsi esistenti, dato un corso
 * @argument dipartimento codice del dipartimento
 * @returns lista dei subcorsi in JSON
 */
var listaMaterie = function(dipartimento){
    sql = query.listaSubcorsi;
    con.connect(function(err) {
        if (err) throw err;
        con.query(sql,[dipartimento], function (err, result) {
            if (err) throw err;
            return(result);
        });
    });
}

exports.aulaLibera = aulaLibera;
exports.aulaLiberaDalleAlle = aulaLiberaDalleAlle;
exports.orarioAula = orarioAula;
exports.listaAule = listaAule;
exports.listaDipartimenti = listaDipartimenti;
exports.listaDocenti = listaDocenti;
exports.listaMaterie= listaMaterie;
exports.listaCorsi= listaCorsi;
exports.listaSubcorsi= listaSubcorsi;