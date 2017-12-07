var apiRequest = require('./apiRequest')

const erroreInterno = 'Errore interno'
const erroreTroppiCaratteri = 'Wowow troppe parole! Capisco solo 256 caratteri.'
var messaggioBenvenuto = 'Benvenuto/a!\n\n'
+ 'Puoi chiedere diverse domande relative alle aule, per esempio:\n\n' 
+ '- Che aule sono libere in questo momento?\n'
+ "- Quale è l'orario dell'aula a107 di povo\n"
+ "- Mi serve un'aula libera dalle 14 alle 16 a povo\n"
+ "- Quali sono le aule libere tra due giorni?\n"
+ "- Quali dipartimenti sono disponibili?\n"
+ '- Dove posso trascorrere le prossime 4 ore buche?\n\n\n'
+ 'Supporto questi dipartimenti:\n'
+ '- Povo \n'
+ '- Lettere e Filosofia \n'
+ '- Economia \n'
+ '- Ingegneria Civile Ambientale Meccanica \n'
+ '- Psicologia e Scienze Cognitive\n'
+ '- Sociologia e Ricerca Sociale\n'

function elaborate(msg){
    return new Promise(function (fulfill, reject){
        try{            
                    if(msg.text == '/start'){
                        fulfill(messaggioBenvenuto)
                    }else{
                        if(msg.text.length < 256){
                          apiRequest.sendQuery(msg.text, msg.chat.id).then(data => {
                            fulfill(data)
                          }).catch(error => {
                            fulfill(erroreInterno)
                          })
                        }else{
                            fulfill(erroreTroppiCaratteri)
                        }   
                    }

        }catch(err){
            reject(err)
        }
    })
}
  


module.exports = elaborate