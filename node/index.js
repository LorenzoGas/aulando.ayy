/*globals require, console, process */
var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');

// instantiate express
var app = express();
var router = express.Router();

// instantiate mysql
var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	database: "aulando",
	password: "root"
});
con.connect(function(err) {
	if (err) 
		throw err;
	console.log("Connected!");
});

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
    res.json({ message: 'welcome to our api!' });
});

//Start listening on port
app.listen(port, function () {
    console.log('Example app listening on port '+ port);
});