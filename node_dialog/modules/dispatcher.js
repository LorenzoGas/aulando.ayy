var tools = require('./functions.js');

// Main server api URL
//var URL = 'https://easyroom.unitn.it/Orario/list_call.php?form-type=corso&anno=2017&corso=0514G&anno2=P0405%7C3&date=12-10-2017&_lang=it&ar_codes_=EC0514G_145005_145005/2_N0_BRUNA%7CEC0514G_145015_145015/1_QUAGL_LEZ%7CEC0514G_145024_145024/1_N0_BOUQU%7CEC0514G_145090_145090/1_N0_DEAN%7CEC0514G_145412_145412/1_N0_CASAT%7CEC0514G_145932_145932/1_N0_COLLA%7CEC0514G_145005_145005/1_N0_BRUNA&ar_select_=true%7Ctrue%7Ctrue%7Ctrue%7Ctrue%7Ctrue%7Ctrue';
var URL = 'https://aulando-ayy.herokuapp.com/';

// Possibili actions restituite dal modulo dialogflow, corrispondono ai metodi da chiamare sul node_api
var actions = {};
actions.auleLibere = 'auleLibere';
actions.auleLibereDalleAlle = 'auleLibereDalleAlle';
actions.auleLiberePer = 'auleLiberePer';
actions.orariAula = 'orariAula';

// Formato desiderato dal server node_api
var formato = "json";

function dispatcher(out) {
    console.log('\n');
    console.log(out);
    
    var data = {};   
    var action;
    var proceed = !out.actionIncomplete;

    if (proceed) {
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
                
                var dalleAlle = out.parameters.timeperiod.split('/');
                data.dalle = tools.formatHour(dalleAlle[0]);
                data.alle = tools.formatHour(dalleAlle[1]);

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

            case actions.orariAula:
                action = actions.orariAula;
                // Inizializzo parametri della richiesta
                data.formato = formato;

                var dateArr = tools.getDate(out.timestamp, out.parameters.date);
                data.giorno = dateArr.giorno;
                
                data.aula = out.parameters.aula;
                data.dipartimento = out.parameters.dipartimento;
            break;

            default: proceed = false; break;
        }
    }

    return new Promise(resolve => {   
        if(proceed) {
            console.log(data);
            tools.httpRequest(URL, action, data)
                .then(result => { 
                    out.result = result;
                    resolve(out);
                });
        }
        else {
            resolve(out);
        }
    });
}


module.exports.dispatcher = dispatcher;