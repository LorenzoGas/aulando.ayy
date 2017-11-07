var express = require('express');
var apiai = require('apiai');

var apiai = apiai("86453201f670452faaf81ac70df26651");
const app = express();


var port = process.env.PORT || 8080;

app.get('', (req, res) => {

    console.log('Contatto ApiAi');

    requestApiAi((par) => { res.send(par); res.end(); });

    

});

app.listen(port);
console.log('Started on port: ' + port);

function requestApiAi(func) {
    var request = apiai.textRequest('Che aule sono disponibili alle 17?', {
        sessionId: '0'
    });
    
    request.on('response', function(response) {
        //console.log(response);
        var action = response.result.action;
        var actionIncomplete = response.result.actionIncomplete;
        var speech = response.result.fulfillment.speech;

        var out = "action: " + action + "<br>incomplete: " + actionIncomplete + "<br>speech: " + speech;

        func(out);
    });
    
    request.on('error', function(error) {
        console.log(error);
        func(error);
    });
    
    request.end();
}