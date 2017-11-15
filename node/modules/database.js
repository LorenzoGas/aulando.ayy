/*globals require, console, process */
var mysql = require('mysql');
var sql = "";
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
 * @brief restituisce le aule libere al momento
 * @return lista di aule in JSON
 */
var aulaLibera = function(giorno,ora){
    sql = "";
    con.connect(function(err) {
        if (err) throw err;
        con.query(sql, [giorno,ora], function (err, result) {
            if (err) throw err;
            console.log(result);
        });
    });
}

/**
 * @brief restituisce le aule libere al momento
 * @return lista di aule in JSON
 */
var aulaLiberaDalleAlle = function(giorno,dalle,alle){
    sql = "";
    con.connect(function(err) {
        if (err) throw err;
        con.query(sql, [giorno,dalle,alle], function (err, result) {
            if (err) throw err;
            console.log(result);
        });
    });
}

/**
 * @brief restituisce l'orario giornaliero di una certa aula
 * @return lista di lezioni in JSON
 */
var orarioAula = function(aula,giorno){
    sql = "";
    con.connect(function(err) {
        if (err) throw err;
        con.query(sql, [aula,giorno], function (err, result) {
            if (err) throw err;
            console.log(result);
        });
    });
}
exports.aulaLibera = aulaLibera;
exports.aulaLiberaDalleAlle = aulaLiberaDalleAlle;
exports.orarioAula = orarioAula;