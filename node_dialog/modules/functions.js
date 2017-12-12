// IMPORTS
var request = require('request');
var moment = require('moment-timezone');

// METODI PER LA GESTIONE DELLA FORMATTAZIONE DELLA DATA

// A partire da una data in formato stringa (timestamp), genera due stringhe (giorno, ora) nella formattazione richiesta dal modulo DB
// Se paramDate o paramTime sono non nulli, sono usati per la generazione del risultato
function getDate(timestamp, paramDate, paramTime){
    var formatDate = 'YYYY-MM-DD';
    var formatTime = 'HH:mm';
    var giorno = moment.tz(timestamp, "Europe/Rome").format(formatDate);
    var ora = moment.tz(timestamp, "Europe/Rome").format(formatTime);

    if(paramDate) {
        giorno = paramDate;
    }
    if(paramTime) {
        ora = paramTime;
        ora = formatHour(ora);
    }

    console.log('\n');
    console.log(giorno, ora);

    return {giorno, ora};
}

// A partire da una stringa hh:mm:ss genera una stringa hh:mm
function formatHour(hour) {
    hour = hour.split(':');
    if(hour.length < 2)
        throw new Error('Formato non corretto. Atteso: hh:mm:ss / hh:mm');
    return hour[0] + ':' + hour[1];
}

// Restituisce la stringa ora in input con applicato l'offset
function getHourFromOffset(hour, offset) {
    var time = formatHour(hour).split(':');
    return (parseInt(time[0]) + (offset||0)) + ':' + time[1];
}

// METODI VARI

// Restituisce una stringa casuale di 10 caratteri. Usata per l'id sessione.
function makeId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

// METODI PER LA GESTIONE DELLE RICHIESTE HTTP

// Richiesta Http a (URL+action) con parametri (data) e funzione di callback
function httpRequest(URL, action, data) {    
    var url = URL + action;
    console.log('\n');
    console.log('Requested to', URL + action);

    return new Promise(resolve => {        
        request({url:url, qs:data}, function(err, response, body) {
            if(err) { 
                console.log(err); resolve();
            }
            
            console.log('Response JSON', response.body);
            response = JSON.parse(response.body);
            resolve(response);
        });
    });
}



// EXPORT DELLE FUNZIONI COME MODULO
module.exports = {
    getDate: getDate,  
    formatHour: formatHour,
    getHourFromOffset: getHourFromOffset,
    makeId: makeId,
    httpRequest: httpRequest
};