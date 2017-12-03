var moksText = [
    {text:'orario aula a106 di lunedi povo', result:{"sessionId":"0000000000","timestamp":"2017-12-02T10:51:03.748Z","action":"orariAula","actionIncomplete":false,"parameters":{"aula":"Aula A106","date":"2017-12-04","dipartimento":"2"},"speech":"Ecco l'orario dell'aula Aula A106 il 2017-12-04 :","result":[{"docente":"Andreatta Marco","materia":"Geometria A - mod1","inizio":"11:00","fine":"13:00"},{"docente":"Brunato Mauro","materia":"Algoritmi avanzati","inizio":"14:00","fine":"16:00"}]}},
    {text:'parole a caso', result:{"sessionId": "0000000000",timestamp: '2017-12-03T14:04:07.228Z', action: 'input.unknown', actionIncomplete: false,  parameters: {},  speech: 'Non ti ho sentito bene. Puoi ripetere?' }}
]

function sendQuery(text, id){
    return new Promise(function (fulfill, reject)
    {
        moksText.forEach(data => {
            if(data.text == text){
                fulfill(data.result)
                return
            }
        })

        reject()

    })
}
    
module.exports.sendQuery = sendQuery