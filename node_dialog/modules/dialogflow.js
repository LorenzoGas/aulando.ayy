var apiai = require('apiai');

var apiai = apiai("86453201f670452faaf81ac70df26651");

function requestApiAi(id, requestQuery, func) {
    var request = apiai.textRequest(requestQuery, {
        sessionId: id
    });
    
    request.on('response', function(response) {
        var sessionId = response.sessionId;
        var timestamp = response.timestamp;
        var action = response.result.action;
        var actionIncomplete = response.result.actionIncomplete;
        var parameters = response.result.parameters;
        var speech = response.result.fulfillment.speech;

        var out = {};
        out.sessionId = sessionId;
        out.timestamp = timestamp;
        out.action = action;
        out.actionIncomplete = actionIncomplete;
        out.parameters = parameters;
        out.speech = speech;

        func(out);
    });
    
    request.on('error', function(error) {
        console.log(error);
        func(error);
    });
    
    request.end();
}

module.exports.requestApiAi = requestApiAi;