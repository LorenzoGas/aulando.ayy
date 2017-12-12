jest.mock('../apiRequest')

var botLogic = require('../botLogic')


it('Test bot logic orario aula a106', () => {
    var msg = {
      text: 'orario aula a106 di lunedi povo',
      chat: {id: '0000000000'}
    }
  
    return botLogic(msg)
    .then(data => {
      expect(typeof data).toBe('string');
    })
});

it('Test bot logic parole a caso', () => {
    var msg = {
      text: 'parole a caso',
      chat: {id: '0000000000'}
    }

    return botLogic(msg)
    .then(data => {
      expect(data).toEqual('Non ti ho sentito bene. Puoi ripetere?')
    })
});

it('Test bot logic /test', () => {
    var msg = {
      text: '/start',
      chat: {id: '0000000000'}
    }
  
    return botLogic(msg)
    .then(data => {
      expect(data).toContain('Benvenuto')
    })
});

it('Test bot logic catch error', () => {
  var msg = {
    text: '',
    chat: {id: '0000000000'}
  }

  return botLogic(msg)
  .then(data => {
      expect(data).toContain('Errore interno')
  })
});


it('Test bot logic msg with not properly formatted', () => {
  var msg = null
   
  return botLogic(msg)
  .then(data => {
    
  })
  .catch((data) => {
    expect(data.message).toEqual("Cannot read property 'text' of null");
  })
  
}); 