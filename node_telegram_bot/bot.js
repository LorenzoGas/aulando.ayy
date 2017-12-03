var token = process.env.TOKEN;

var Bot = require('node-telegram-bot-api')
var botLogic = require('./botLogic')
var bot;

if(process.env.NODE_ENV === 'production') {
  bot = new Bot(token);
  bot.setWebHook(process.env.HEROKU_URL + bot.token);
}
else {
  bot = new Bot(token, { polling: true });
}

console.log('Bot server started in the ' + process.env.NODE_ENV + ' mode');

var options = {"parse_mode": "html"}

bot.onText(/^/, function (msg) {

  botLogic(msg).then(data => {
    bot.sendMessage(msg.chat.id, data, options)
  }).catch(err => {console.log(err)})
  

});

module.exports = bot;
