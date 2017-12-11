var https = require('https')

function sendQuery(text, id){

    return new Promise(function (fulfill, reject)
    {
      if(!(typeof text === 'string' || text instanceof String)){
        reject(new Error("text must be a string."))
    }
    if(!(typeof id === 'string' || id instanceof String || id==null)){
        reject(new Error("id must be a string."))
    }
        var url = 'https://aulando-ayy-dialogflow-api.herokuapp.com/dialogflow_api/resolveQuery?requestQuery=' +  text
        if(id)
            url += '&id=' + id
        https.get(url, (res) => {
            const { statusCode } = res;
            const contentType = res.headers['content-type'];
          
            let error;
            if (statusCode !== 200) {
              error = new Error('Request Failed.\n' +
                                `Status Code: ${statusCode}`);
            } else if (!/^application\/json/.test(contentType)) {
              error = new Error('Invalid content-type.\n' +
                                `Expected application/json but received ${contentType}`);
            }
            if (error) {;
              // consume response data to free up memory
              res.resume();
              reject(error);
              return;
            }
          
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
              try {
                const parsedData = JSON.parse(rawData);
      
                var textResult = ''
      
                textResult += parsedData.speech
      
                if(parsedData.result){
      
                    if(parsedData.result.length == 0){
                        textResult += '\nNessun risultato :('
                    }
      
                    parsedData.result.forEach(function(element) {
                      if(element.nome)
                        textResult += '\n<b>' + element.nome + '</b>'
                      if(element.materia)
                        textResult += '\n<b>' + element.materia + '</b>'
                      if(element.inizio && element.fine)
                        textResult += ' dalle ' + element.inizio + " alle " + element.fine
                      if(element.fino)
                        textResult += ' fino alle: ' + element.fino
                    
                    });
                   
                }
      
                fulfill(textResult.toString())
      
              } catch (e) {
                reject(e);
              }
            });
          }).on('error', (e) => {
            reject(e);
          });
    })
  }

  module.exports.sendQuery = sendQuery