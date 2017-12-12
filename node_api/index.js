/*globals require, console, process */
var express         = require('express');
var bodyParser      = require('body-parser');
var mysql           = require('database.js');
var path            = require("path");
var js2xmlparser    = require("js2xmlparser");



var param_error         = "C'è un errore nella sintassi dei parametri! La sintassi corretta è la seguente:";
var p_o                 = "[opzionale]";
var param_dipartimento  = "dipartimento = id";
var param_corso         = "corso = id";
var param_subcorso      = "subcorso = id";
var param_formato       = "formato = JSON/XML";
var param_giorno        = "giorno = aaaa-mm-gg";
var param_aula          = "aula = codice";
var param_ora           = "ora = hh:mm";
var param_dalle         = "dalle = hh:mm";
var param_alle          = "alle = hh:mm";
var error_message       = "Si è verificato un errore, riprova più tardi!";

// instantiate express
var app = express();
var router = express.Router();

//Configure bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set our port
var port = process.env.PORT || 8080;

// middleware route to support CORS and preflighted requests
app.use(function (req, res, next) {
    //Enabling CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Content-Type', 'application/json');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE');
        return res.status(200).json({});
    }
    console.log("Query=",req.query,";\nBody: ",req.body);
    // make sure we go to the next routes
    next();
});

//HOMEPAGE
app.all('/', function (req, res) {
    res.sendFile(path.join(__dirname+'/Documentation.json'));
});

/************************************ SERVIZI COMPLESSI ********************************* */
/**
 * @description Restituisce una lista di aule disponibili per un'ora specificata ed un dato dipartimento.
 * @param formato: formato in cui i dati vogliono essere ricevuti; può essere JSON o XML. Default = JSON
 * @param giorno: giorno in cui si vogliono gli orari, nel formato 'dd-mm-aaaa'
 * @param ora: ora a cui si è interessati, nel formato militare. Es: 16:00
 * @param dipartimento id del dipartimento desiderato
 * @return lista di aule libere 
 */
app.all('/auleLibere',function (req, res) {
    var check   = true;
    var formato = req.query.formato != null ?  req.query.formato : req.body.formato;
    var giorno = req.query.giorno != null ?  req.query.giorno : req.body.giorno;
    var ora = req.query.ora != null ?  req.query.ora : req.body.ora;
    var dipartimento = req.query.dipartimento != null ?  req.query.dipartimento : req.body.dipartimento;
    var result  = param_error + "\n" + p_o + param_formato + "\n" + param_dipartimento +"\n" + param_giorno + "\n" + param_ora;
    
    if(giorno == null || ora == null || dipartimento == null || !checkDate(giorno))
        check = false;
    if(check){
        mysql.auleLibere(dipartimento,giorno,ora).then((out)=>{
            if(out == "error")
                out = error_message;
            if(formato == "XML")
                out = js2xmlparser.parse("aula", out);
            res.send(out);
            res.end();
        });
    }else
        res.end(result);
});
    

/**
 * @description Restituisce una lista di aule disponibili nell'intervallo di tempo specificato. 
 * @param formato: formato in cui i dati vogliono essere ricevuti; può essere JSON o XML. Default = JSON
 * @param dipartimento id del dipartimento desiderato
 * @param giorno: giorno in cui si vogliono gli orari, nel formato 'aaaa-mm-dd'
 * @param dalle: orario iniziale a cui si è interessati, nel formato militare. Es: 16:00
 * @param alle: orario finale a cui si è interessati, nel formato militare. Es: 16:00
 * @returns lista di aule, nel formato specificato.
 */
app.all('/auleLibereDalleAlle', function (req, res) {
    var check = true;
    var formato = req.query.formato != null ?  req.query.formato : req.body.formato;
    var dipartimento = req.query.dipartimento != null ?  req.query.dipartimento : req.body.dipartimento;
    var giorno = req.query.giorno != null ?  req.query.giorno : req.body.giorno;
    var dalle = req.query.dalle != null ?  req.query.dalle : req.body.dalle;
    var alle = req.query.alle != null ?  req.query.alle : req.body.alle;
    var result  = param_error + "\n" + p_o + param_formato + "\n" + param_dipartimento +"\n" + param_giorno + "\n" + param_dalle + "\n" + param_alle;

    if(dipartimento == null || giorno == null || dalle == null || alle == null | !checkDate(giorno))
        check = false;
    if(check){
        mysql.auleLibereDalleAlle(dipartimento,giorno,dalle,alle).then((out)=>{
            if(out == "error")
                out = error_message;
            if(formato == "XML")
                out = js2xmlparser.parse("aula", out);
            res.send(out);
            res.end();
        });
    }else
        res.end(result);
});

/**
 * @description Restituisce una lista di lezioni per un'aula specificata in un giorno specificato. 
 * @param formato: formato in cui i dati vogliono essere ricevuti; può essere JSON o XML. Default = JSON
 * @param giorno: giorno in cui si vogliono gli orari, nel formato 'dd-mm-aaaa'
 * @param aula: nome per l'aula per la quale si vogliono gli orari, es: 'Aula PC B107'
 * @param dipartimento id del dipartimento desiderato
 * @returns lista di lezioni, nel formato specificato.
 */
app.all('/orariAula', function (req, res) {
    var check = true;
    var formato = req.query.formato != null ?  req.query.formato : req.body.formato;
    var aula = req.query.aula != null ?  req.query.aula : req.body.aula;
    var giorno = req.query.giorno != null ?  req.query.giorno : req.body.giorno;
    var dipartimento = req.query.dipartimento != null ?  req.query.dipartimento : req.body.dipartimento;
    var result  = param_error + "\n" + p_o + param_formato + "\n" + param_aula +"\n" + param_giorno +"\n" + param_dipartimento;
    if(aula == null || giorno == null || dipartimento == null || !checkDate(giorno))
        check = false;
    if(check){
        mysql.orariAula(dipartimento,aula,giorno).then((out)=>{
            if(out == "error")
                out = error_message;
            if(formato == "XML")
                out = js2xmlparser.parse("lezione", out);
            res.send(out);
            res.end();
        });
    }else    
        res.end(result);
});


//************************************* SERVIZI BASE *****************************************/
/**
 * @description Restituisce una lista di dipartimenti.
 * @param formato: formato in cui i dati vogliono essere ricevuti; può essere JSON o XML. Default = JSON
 * @returns lista dei dipartimenti
 */
app.all('/listaDipartimenti',function (req, res) {
    var check   = true;
    var formato = req.query.formato != null ?  req.query.formato : req.body.formato;
    var result  = param_error + "\n" + p_o + param_formato;
    if(check){
        mysql.listaDipartimenti().then((out)=>{
            if(out == "error")
                out = error_message;
            if(formato == "XML")
                out = js2xmlparser.parse("dipartimento", out);
            res.send(out);
            res.end();
        });
    }else
        res.end(result);
});
/**
 * @description Restituisce una lista di aule del dipartimento specificato.
 * @param formato: formato in cui i dati vogliono essere ricevuti; può essere JSON o XML. Default = JSON
 * @param dipartimento: codice del dipartimento interessato
 * @return lista delle aule del dipartimento specificato
 */
app.all('/listaAule',function (req, res) {
    var check   = true;
    var formato = req.query.formato != null ?  req.query.formato : req.body.formato;
    var dipartimento = req.query.dipartimento != null ?  req.query.dipartimento : req.body.dipartimento;
    var result  = param_error + "\n" + p_o + param_formato + "\n" + param_dipartimento;
    if(dipartimento == null)
        check = false;
    if(check){
        mysql.listaAule(dipartimento).then((out)=>{
            if(out == "error")
                out = error_message;
            if(formato == "XML")
                out = js2xmlparser.parse("aula", out);
            res.send(out);
            res.end();
        });
    }else
        res.end(result);
});

/**
 * @description Restituisce una lista di docenti per il dipartimento specificato.
 * @param formato: formato in cui i dati vogliono essere ricevuti; può essere JSON o XML. Default = JSON
 * @param dipartimento: id del dipartimento interessato
 * @return lista dei docenti del dipartimento specificato
 */
app.all('/listaDocenti',function (req, res) {
    var check   = true;
    var formato = req.query.formato != null ?  req.query.formato : req.body.formato;
    var dipartimento = req.query.dipartimento != null ?  req.query.dipartimento : req.body.dipartimento;
    var result  = param_error + "\n" + p_o + param_formato + "\n" + param_dipartimento;
    if(dipartimento == null)
        check = false;
    if(check){
        mysql.listaDocenti(dipartimento).then((out)=>{
            if(out == "error")
                out = error_message;
            if(formato == "XML")
                out = js2xmlparser.parse("docente", out);
            res.send(out);
            res.end();
        });
    }else
        res.end(result);
});
/**
 * @description Restituisce una lista di corsi per il dipartimento specificato.
 * @param formato: formato in cui i dati vogliono essere ricevuti; può essere JSON o XML. Default = JSON
 * @param dipartimento: id del dipartimento interessato
 * @return lista dei corsi del dipartimento specificato
 */
app.all('/listaCorsi',function (req, res) {
    var check   = true;
    var formato = req.query.formato != null ?  req.query.formato : req.body.formato;
    var dipartimento = req.query.dipartimento != null ?  req.query.dipartimento : req.body.dipartimento;
    var result  = param_error + "\n" + p_o + param_formato + "\n" + param_dipartimento;
    if(dipartimento == null)
        check = false;
    if(check){
        mysql.listaCorsi(dipartimento).then((out)=>{
            if(out == "error")
                out = error_message;
            if(formato == "XML")
                out = js2xmlparser.parse("corso", out);
            res.send(out);
            res.end();
        });
    }else
        res.end(result);
});

/**
 * @description Restituisce una lista di subcorsi per il corso specificato.
 * @param formato: formato in cui i dati vogliono essere ricevuti; può essere JSON o XML. Default = JSON
 * @param corso: id del corso interessato
 * @return lista dei subcorsi del corso specificato
 */
app.all('/listaSubcorsi',function (req, res) {
    var check   = true;
    var formato = req.query.formato != null ?  req.query.formato : req.body.formato;
    var corso = req.query.corso != null ?  req.query.corso : req.body.corso;
    var result  = param_error + "\n" + p_o + param_formato + "\n" + param_corso;
    if(corso == null)
        check = false;
    if(check){
        mysql.listaSubcorsi(corso).then((out)=>{
            if(out == "error")
                out = error_message;
            if(formato == "XML")
                out = js2xmlparser.parse("subcorso", out);
            res.send(out);
            res.end();
        });
    }else
        res.end(result);
});

/**
 * @description Restituisce una lista di materie per il subcorso specificato.
 * @param formato: formato in cui i dati vogliono essere ricevuti; può essere JSON o XML. Default = JSON
 * @param subcorso: id del subcorso interessato
 * @return lista delle materie del subcorso specificato
 */
app.all('/listaMaterie',function (req, res) {
    var check   = true;
    var formato = req.query.formato != null ?  req.query.formato : req.body.formato;
    var subcorso = req.query.subcorso != null ?  req.query.subcorso : req.body.subcorso;
    var result  = param_error + "\n" + p_o + param_formato + "\n" + param_subcorso;
    if(subcorso == null)
        check = false;
    if(check){
        mysql.listaMaterie(subcorso).then((out)=>{
            if(out == "error")
                out = error_message;
            if(formato == "XML")
                out = js2xmlparser.parse("subcorso", out);
            res.send(out);
            res.end();
        });
    }else
        res.end(result);
});
/**FUNZIONI AUSILIARI */
var checkDate = function(d){
    d = new Date(d);
    return (d instanceof Date && !isNaN(d.valueOf()));
}
var checkHour = function(h){
    return isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(h);
}
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
app.listen(port, function () {
    
});

exports.checkDate = checkDate;