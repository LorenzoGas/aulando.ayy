/*globals require, console, process */
var express = require('express');
var bodyParser = require('body-parser');
var dialogflow_module = require('./modules/dialogflow.js');
var tools = require('./modules/functions.js');
var disp = require('./modules/dispatcher.js');

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

    console.log('\n');
    console.log('Request received');
    
    //Ottieni parametri dal client
    var formato = "json";
    var id = req.query.id || tools.makeId();
    var requestQuery = req.query.requestQuery || 'TODO'; // TODO gestione errori

    console.log(id, requestQuery);

    dialogflow_module.requestApiAi(id, requestQuery).then(out => {
        disp.dispatcher(out).then(out2 => {
            res.send(out2);
            res.end();
        });
    });
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