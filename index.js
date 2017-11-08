var express = require('express');
var dialogflow_module = require('./dialogflow');
var database_module = require('./database');

const app = express();


var port = process.env.PORT || 8080;

app.get('', (req, res) => {

    console.log('Request received');

    //Ottieni parametri dal client
    var id = req.query.id || 0;
    var requestQuery = req.query.requestQuery;

    dialogflow_module.requestApiAi(
        id,
        requestQuery,
        (out) => { dispatcher(res, out) }
    );
});

app.listen(port);
console.log('Started on port: ' + port);


function dispatcher(res, out) {
    if(!out.actionIncomplete) {
        switch(out.action) {
            case database_module.actions.aule_libere_from_hour: 
                out.data = database_module.trova_aule_libere_from_hour(out.parameters.time);
            break;

            case database_module.actions.aule_libere_for_hour:
                out.data = database_module.trova_aule_libere_for_hour(out.parameters.duration);
            break;
        }
    }

    res.send(out); res.end();
}