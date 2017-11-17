/*globals require, console, process */
var express = require('express');
var bodyParser = require('body-parser');
var dialogflow_module = require('./modules/dialogflow.js');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// Main server api URL
var URL = 'http://localhost:8080'; //'https://www.google.it';

// Possibili actions restituite dal modulo dialogflow, corrispondono ai metodi da chiamare sul node_api
var actions = {};
actions.aule_libere_from_hour = "aule_libere_from_hour";
actions.aule_libere_for_hour = "aule_libere_for_hour";

var actions2 = {};
actions2.auleLibere = 'auleLibere';
actions2.aulaLiberaDalleAlle = 'aulaLiberaDalleAlle';
actions2.orarioAula = 'orarioAula';

// Formato desiderato dal server node_api
var formato = "json";

// instantiate express
var app = express();
var router = express.Router();

//Configure bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set our port
var port = process.env.PORT || 9090;

//Services
router.get('/', function (req, res) {
    res.end("Benvenuto nella nostra API Dialogflow!");
});

/**
 * Restituisce una lista di aule disponibili per un'ora specificata. Il formato dell'output è specificato nei parametri.
 */
router.get('/resolveQuery', function (req, res) {

    console.log('Request received');
    
    //Ottieni parametri dal client
    var formato = "json";
    var id = req.query.id || 0;
    var requestQuery = req.body.requestQuery || 'TODO'; // TODO gestione errori

    dialogflow_module.requestApiAi(
        id,
        requestQuery,
        (out) => { dispatcher(res, out) }
    );
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

// register our router on /api
app.use('/dialogflow_api', router);

// handle invalid requests and internal error
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: { message: err.message } });
});

//Start listening on port
app.listen(port, function () {
    console.log('Example app listening on port '+ port);
});


function dispatcher(res, out) {
    console.log(out.action);
    if(!out.actionIncomplete) {
        var data = {};
        var action;        
        switch(out.action) {
            case actions2.auleLibere:
                // Inizializzo parametri della richiesta
                data.formato = formato;
                data.giorno = out.parameters.giorno;
                data.ora = out.parameters.ora;
                action = actions2.auleLibere;
            break;

            case actions2.aulaLiberaDalleAlle:
                // Inizializzo parametri della richiesta
                data.formato = formato;
                data.giorno = out.parameters.giorno;
                data.dalle = out.parameters.dalle;
                data.alle = out.parameters.alle;
                action = actions2.aulaLiberaDalleAlle;
            break;

            case actions.orarioAula:
                // Inizializzo parametri della richiesta
                data.formato = formato;
                data.giorno = out.parameters.giorno;
                data.aula = out.parameters.aula;
                action = actions2.orarioAula;
            break;
        }

        send(URL, action, data, (result) => { 
            out.result = result;
            res.send(out);
            res.end(); }); 
    }
    else {
        res.send(out);
        res.end();
    }
}

function send(URL, action, data, callback) {
    // construct an HTTP request
    var xhr = new XMLHttpRequest();
    xhr.open('GET', URL + action, true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

    // send the collected data as JSON
    xhr.send(JSON.stringify(data));

    console.log('requested to', URL);

    xhr.onloadend = function () 
    {
        var result=xhr.responseText;
        console.log(result);
        callback(result)
    };
}

