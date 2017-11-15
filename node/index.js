/*globals require, console, process */
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('/database.js');

// instantiate express
var app = express();
var router = express.Router();

//Configure bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set our port
var port = process.env.PORT || 8080;

//server methods
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: { message: err.message } });
});

// middleware route to support CORS and preflighted requests
app.use(function (req, res, next) {
    // do logging
    console.log('Something is happening.');
    //Enabling CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Content-Type', 'application/json');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE');
        return res.status(200).json({});
    }
    // make sure we go to the next routes
    next();
});

//Services
router.get('/', function (req, res) {
    res.end("Benvenuto nella nostra API!");
});

/**
 * Restituisce una lista di aule disponibili per un'ora specificata. Il formato dell'output è specificato nei parametri.
 */
router.get('/aulaLibera', function (req, res) {
    var formato = req.body.formato;
    var giorno = req.body.giorno;
    var ora = req.body.ora;
    var result = mysql.aulaLibera(giorno,ora);
    if(formato == "json")
        result = json(result);
    res.end(result);
});

/**
 * Restituisce una lista di aule disponibili nell'intervallo di tempo specificato. Il formato dell'output è specificato nei parametri.
 */
router.get('/aulaLiberaDalleAlle', function (req, res) {
    var formato = req.body.formato;
    var giorno = req.body.giorno;
    var dalle = req.body.dalle;
    var alle = req.body.alle;
    var result = mysql.aulaLiberaDalleAlle(giorno,dalle,alle);
    if(formato == "json")
        result = json(result);
    res.end(result);
});

/**
 * Restituisce una lista di lezioni per un'aula specificata in un giorno specificato. Il formato dell'output è specificato nei parametri.
 */
router.get('/aulaLiberaDalleAlle', function (req, res) {
    var formato = req.body.formato;
    var giorno = req.body.giorno;
    var aula = req.body.aula;
    var result = mysql.orarioAula(aula,giorno);
    if(formato == "json")
        result = json(result);
    res.end(result);
});

//Start listening on port
app.listen(port, function () {
    console.log('Example app listening on port '+ port);
});


