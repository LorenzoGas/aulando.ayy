var tools = require('../functions')

var moksText = [ 
    { nome: 'LD Biotecnologie 3', fino: null },
    { nome: 'LD Biotecnologie 2', fino: null },
    { nome: 'LD Biotecnologie 1', fino: null },
    { nome: 'LD Ottica', fino: null },
    { nome: 'LD Chimica 1', fino: null },
    { nome: 'LD Meccanica', fino: null },
    { nome: 'studio docente', fino: null },
    { nome: 'Aula A216 spazio polifunzionale', fino: null },
    { nome: 'Aula pc A201', fino: '15:00' },
    { nome: 'LD Elettronica', fino: '14:00' },
    { nome: 'LD PED 2', fino: '14:00' },
    { nome: 'Aula pc A202', fino: '14:00' },
    { nome: 'Aula 7', fino: '11:00' },
    { nome: 'Aula A224', fino: '11:00' },
    { nome: 'Aula  B102', fino: '11:00' },
    { nome: 'Aula A208', fino: '11:00' },
    { nome: 'Aula A222', fino: '11:00' },
    { nome: 'Aula A217 spazio polifunzionale', fino: '10:00' }
]

function httpRequest(URL, action, data) {    
    var url = URL + action;
    console.log('Requested to', URL + action);

    return new Promise(resolve => {  
        resolve(moksText);
    });
}
 


//console.log(tools.getDatfdge('2017-11-30T12:42:57.789Z', '2017-12-21', '12:34'))

tools.httpRequest = httpRequest;

module.exports = tools;