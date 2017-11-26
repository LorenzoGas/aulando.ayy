var https = require('https');
fs = require('fs')

function readData(nomeFile){
    fs.readFile(nomeFile, 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }

        updateEntity(data);
    })
}

function updateEntity(stringBody){
    var options = {
        host: 'api.dialogflow.com',
        path: '/v1/entities/5353bac6-936c-4b5b-86d0-96de639ad335?v=20150910&lang=it',
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer 4d32ec2123e749debf24e11c258a1760',
            'Content-Type': 'application/json'
          }
      };
      
      callback = function(response) {
        var str = ''
        response.on('data', function (chunk) {
          str += chunk;
        });
      
        response.on('end', function () {
          console.log(str);
        });
      }
      
      var body = JSON.stringify(stringBody);
      
      var req = https.request(options, callback);
      req.end(body);
}

readData('dati.json');
