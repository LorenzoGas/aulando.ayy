var express = require('express');
var apiai = require('apiai');

var apiai = apiai("86453201f670452faaf81ac70df26651");
const app = express();


var port = process.env.PORT || 8080;

app.get('', (req, res) => {

    console.log('Request received');

    //Ottieni parametri dal client
    var id = req.query.id || 0;
    var requestQuery = req.query.requestQuery;

    requestApiAi(id, requestQuery, (par) => { res.send(par); res.end(); });
});

app.listen(port);
console.log('Started on port: ' + port);

function requestApiAi(id, requestQuery, func) {
    var request = apiai.textRequest(requestQuery, {
        sessionId: id
    });
    
    request.on('response', function(response) {
        var sessionId = response.id;
        var action = response.result.action;
        var actionIncomplete = response.result.actionIncomplete;
        var speech = response.result.fulfillment.speech;

        var out = {};
        out.sessionId = sessionId;
        out.action = action;
        out.actionIncomplete = actionIncomplete;
        out.speech = speech;

        if (actionIncomplete) {
            // Inoltra al client obj out
        }
        else {
            // Interroga il db e restituisci la "risposta" al client
        }


        func(out);
    });
    
    request.on('error', function(error) {
        console.log(error);
        func(error);
    });
    
    request.end();
}