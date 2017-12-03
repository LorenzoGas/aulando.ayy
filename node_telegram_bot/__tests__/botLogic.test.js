var botLogic = require('../botLogic')
jest.mock('../apiRequest')

// The assertion for a promise must be returned.
it('Test bot logic orario aula a106', () => {
    var msg = {
      text: 'orario aula a106 di lunedi povo',
      chat: {id: '0000000000'}
    }

    var apiRequest = require('../apiRequest')    
    return botLogic(msg)
    .then(data => {
      expect(data.result[0].docente).toEqual('Andreatta Marco')
    })
});

it('Test bot logic parole a caso', () => {
    var msg = {
      text: 'parole a caso',
      chat: {id: '0000000000'}
    }

    var apiRequest = require('../apiRequest')    
    return botLogic(msg)
    .then(data => {
      expect(data.speech).toEqual('Non ti ho sentito bene. Puoi ripetere?')
    })
});

it('Test bot logic /test', () => {
    var msg = {
      text: '/start',
      chat: {id: '0000000000'}
    }

    var apiRequest = require('../apiRequest')    
    return botLogic(msg)
    .then(data => {
      expect(data).toContain('Benvenuto')
    })
});