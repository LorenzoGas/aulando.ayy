/*
var moksText = [
    {text:'orario aula a106 di lunedi povo', result:{"sessionId":"0000000000","timestamp":"2017-12-02T10:51:03.748Z","action":"orariAula","actionIncomplete":false,"parameters":{"aula":"Aula A106","date":"2017-12-04","dipartimento":"2"},"speech":"Ecco l'orario dell'aula Aula A106 il 2017-12-04 :","result":[{"docente":"Andreatta Marco","materia":"Geometria A - mod1","inizio":"11:00","fine":"13:00"},{"docente":"Brunato Mauro","materia":"Algoritmi avanzati","inizio":"14:00","fine":"16:00"}]}},
    {text:'parole a caso', result:{"sessionId": "0000000000",timestamp: '2017-12-03T14:04:07.228Z', action: 'input.unknown', actionIncomplete: false,  parameters: {},  speech: 'Non ti ho sentito bene. Puoi ripetere?' }}
]
*/

var moksText = [
    {text:'orario aula a106 di lunedi povo', result:"Ecco l'orario dell'aula Aula pc B106 il 2017-12-11 : Ingegneria del software 1 - pari dalle 11:00 alle 13:00   Programmazione 1 - pari dalle 14:00 alle 17:00  Sistemi informativi - n0 dalle 17:00 alle 19:00"},
    {text:'parole a caso', result:"Non ti ho sentito bene. Puoi ripetere?"}
]

function sendQuery(text, id){
    return new Promise(function (fulfill, reject)
    {
        console.log(typeof text)
        if(!(typeof text === 'string' || text instanceof String)){
            reject(new Error("text must be a string."))
        }
        if(!(typeof id === 'string' || id instanceof String || id==null)){
            reject(new Error("id must be a string."))
        }
        try{
            moksText.forEach(data => {
                if(data.text == text){
                    fulfill(data.result.toString())
                    return
                }
            })    
            reject(new Error("Testo non previsto"))
        }catch(e){
            reject(new Error(e.message))
        }       

    })
}
    
module.exports.sendQuery = sendQuery