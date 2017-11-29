var token = process.env.TOKEN;

var Bot = require('node-telegram-bot-api');
var https = require('https')
var bot;

if(process.env.NODE_ENV === 'production') {
  bot = new Bot(token);
  bot.setWebHook(process.env.HEROKU_URL + bot.token);
}
else {
  bot = new Bot(token, { polling: true });
}

console.log('Bot server started in the ' + process.env.NODE_ENV + ' mode');

//Bot init ----------------- fine

const erroreInterno = 'Errore interno'
var messaggioBenvenuto = 'Benvenuto/a!\n\n'
+ 'Puoi chiedere diverse domande relative alle aule, per esempio:\n\n' 
+ '- Che aule sono libere in questo momento?\n'
+ "- Quale è l'orario dell'aula a107 di povo\n"
+ '- Dove posso trascorrere le prossime 4 ore buche?\n\n\n'
+ 'Supporto questi dipartimenti:\n'
+ '- Povo \n'
+ '- Lettere e Filosofia \n'
+ '- Economia \n'
+ '- Ingegneria Civile Ambientale Meccanica \n'
var options = {"parse_mode": "html"}

bot.onText(/^/, function (msg) {
  const chatId = msg.chat.id;

if(msg.text == '/start'){
    bot.sendMessage(chatId, String(messaggioBenvenuto), options);
  }else{
    sendQuery(msg.text, chatId, (message) => {
      bot.sendMessage(chatId, message, options);
    })
  }
  
});


function sendQuery(text, id, sendMessage){
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
      if (error) {
        console.error(error.message);
        // consume response data to free up memory
        res.resume();
        sendMessage(erroreInterno);
        return;
      }
    
      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          console.log(parsedData);

          var textResult = ''

          textResult += parsedData.speech

          console.log(parsedData)

          if(parsedData.result){

              if(parsedData.result.length == 0){
                  textResult += '\nNessun risultato :('
              }

              parsedData.result.forEach(function(element) {
                  textResult += '\n<b>' + element.nome + '</b>'
                  if(element.inizio && element.fine)
                    textResult += ' dalle ' + element.inizio + " alle " + element.fine
                  if(element.minimo){
                    textResult += ' fino alle: ' + element.minimo
                  }

              });
             
          }

          sendMessage(textResult)

        } catch (e) {
          console.error(e.message);
          sendMessage(erroreInterno);
        }
      });
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
      sendMessage(erroreInterno);
    });
}


module.exports = bot;
