/*globals require, console, process */
var express = require('express');
var bodyParser = require('body-parser');
var dialogflow_module = require('/modules/dialogflow.js');

var actions = {};
actions.aule_libere_from_hour = "aule_libere_from_hour";
actions.aule_libere_for_hour = "aule_libere_for_hour";

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

    console.log('Request received');
    
    //Ottieni parametri dal client
    var formato = "json";
    var id = req.query.id || 0;
    var requestQuery = req.body.requestQuery;

    dialogflow_module.requestApiAi(
        id,
        requestQuery,
        (out) => { dispatcher(res, out) }
    );
});

//Start listening on port
app.listen(port, function () {
    console.log('Example app listening on port '+ port);
});


function dispatcher(res, out) {
    if(!out.actionIncomplete) {
        switch(out.action) {
            case actions.aule_libere_from_hour: 
                // out.data = database_module.trova_aule_libere_from_hour(out.parameters.time);
                // Richiesta al server node_api 
            break;

            case actions.aule_libere_for_hour:
                //out.data = database_module.trova_aule_libere_for_hour(out.parameters.duration);
                // Richiesta al server node_api 
            break;
        }
    }

    res.send(out); res.end();
}