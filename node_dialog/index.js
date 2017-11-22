/*globals require, console, process */
var express = require('express');
var bodyParser = require('body-parser');
var dialogflow_module = require('./modules/dialogflow.js');
var tools = require('./modules/functions.js');

// Main server api URL
//var URL = 'https://easyroom.unitn.it/Orario/list_call.php?form-type=corso&anno=2017&corso=0514G&anno2=P0405%7C3&date=12-10-2017&_lang=it&ar_codes_=EC0514G_145005_145005/2_N0_BRUNA%7CEC0514G_145015_145015/1_QUAGL_LEZ%7CEC0514G_145024_145024/1_N0_BOUQU%7CEC0514G_145090_145090/1_N0_DEAN%7CEC0514G_145412_145412/1_N0_CASAT%7CEC0514G_145932_145932/1_N0_COLLA%7CEC0514G_145005_145005/1_N0_BRUNA&ar_select_=true%7Ctrue%7Ctrue%7Ctrue%7Ctrue%7Ctrue%7Ctrue';
var URL = 'https://aulando-ayy.herokuapp.com/';

// Possibili actions restituite dal modulo dialogflow, corrispondono ai metodi da chiamare sul node_api
var actions = {};
actions.auleLibere = 'auleLibere';
actions.auleLibereDalleAlle = 'auleLibereDalleAlle';
actions.auleLiberePer = 'auleLiberePer';
actions.orarioAula = 'orarioAula';

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

    console.log('\n');
    console.log('Request received');
    
    //Ottieni parametri dal client
    var formato = "json";
    var id = req.query.id || tools.makeId();
    var requestQuery = req.query.requestQuery || 'TODO'; // TODO gestione errori

    console.log(id, requestQuery);

    dialogflow_module.requestApiAi(
        id,
        requestQuery,
        (out) => { dispatcher(res, out) }
    );
});

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

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
    console.log('\n');
    console.log(out);
    
    if(!(out.action == 'input.unknown' || out.actionIncomplete)) {
        var data = {};   
        var action;
        switch(out.action) {
            case actions.auleLibere:
                action = actions.auleLibere;
                // Inizializzo parametri della richiesta
                data.formato = formato;
                             
                var dateArr = tools.getDate(out.timestamp, out.parameters.date, out.parameters.time);
                data.giorno = dateArr.giorno;
                data.ora = dateArr.ora;

                data.dipartimento = out.parameters.dipartimento;
            break;

            case actions.auleLibereDalleAlle:
                action = actions.auleLibereDalleAlle;
                // Inizializzo parametri della richiesta
                data.formato = formato;
                
                var dateArr = tools.getDate(out.timestamp, out.parameters.date);
                data.giorno = dateArr.giorno;
                
                var dalleAlle = out.parameters.time-period.split('/');
                data.dalle = dalleAlle[0];
                data.alle = dalleAlle[1];

                data.dipartimento = out.parameters.dipartimento;
            break;

            case actions.auleLiberePer:
                action = actions.auleLibereDalleAlle;
                // Inizializzo parametri della richiesta
                data.formato = formato;

                var dateArr = tools.getDate(out.timestamp, out.parameters.date);
                data.giorno = dateArr.giorno;
                data.dalle = dateArr.ora;
                data.alle = tools.getHourFromOffset(data.dalle, out.parameters.duration.amount);  

                data.dipartimento = out.parameters.dipartimento;
            break;

            case actions.orarioAula:
                action = actions.orarioAula;
                // Inizializzo parametri della richiesta
                data.formato = formato;

                var dateArr = tools.getDate(out.timestamp, out.parameters.date);
                data.giorno = dateArr.giorno;
                
                data.aula = out.parameters.aula;
                data.dipartimento = out.parameters.dipartimento;
            break;
        }

        console.log(data);

        tools.httpRequest(URL, action, data, (result) => { 
            out.result = result;
            res.send(out);
            res.end(); });
    }
    else {
        res.send(out);
        res.end();
    }
}

