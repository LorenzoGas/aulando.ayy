//var api = require('../node_dialog/index')
var tools = require ('../node_dialog/modules/functions')

describe('METODI PER LA GESTIONE DELLA FORMATTAZIONE DELLA DATA', () => {

  describe('getDate', () => {
    test("format '2017-11-30T12:42:57.789Z', '2017-12-21', '12:34' to be giorno: '2017-12-21', ora: '12:34' ", () => {
      var dataOra = { 
        giorno: '2017-12-21',
        ora: '12:34'
      };

      expect(tools.getDate('2017-11-30T12:42:57.789Z', '2017-12-21', '12:34')).toEqual( dataOra );
    });

    test("format '2017-11-30T12:42:57.789Z', '', '' to be giorno: '2017-11-30', ora: '13:42' ", () => {
      var dataOra = { 
        giorno: '2017-11-30',
        ora: '13:42'
      };

      expect(tools.getDate('2017-11-30T12:42:57.789Z')).toEqual( dataOra );
    });
  });

  describe('formatHour', () => {
    test('format 12:34:56 to be 12:34', () => {
      expect(tools.formatHour('12:34:56')).toBe('12:34');
    });

    test('format 12:34 to be 12:34', () => {
      expect(tools.formatHour('12:34:56')).toBe('12:34');
    });

    test('expect null to throw exception', () => {
      expect(() => tools.formatHour()).toThrowError(TypeError);
    });
  });

  describe('getHourFromOffset', () => {
    test('offset 12:34:56 to be 13:34', () => {
      expect(tools.getHourFromOffset('12:34:56', 1)).toBe('13:34');
    });

    test('offset 12:34 to be 12:34', () => {
      expect(tools.getHourFromOffset('12:34:56')).toBe('12:34');
    });

    test('expect null to throw exception', () => {
      expect(() => tools.getHourFromOffset()).toThrowError(TypeError);
    });
  });
});

describe('httpRequest', () => {
  var url = 'https://aulando-ayy.herokuapp.com/'
  var action = 'auleLibere';
  var data = { formato: 'json', giorno: '2017-11-30', ora: '14:53', dipartimento: '2' };    
  
  var result = [{"nome":"Aula  B103","fino":null},{"nome":"Aula 7","fino":null},{"nome":"LD Biotecnologie 1","fino":null},{"nome":"LD Chimica 1","fino":null},{"nome":"LD Ottica","fino":null},{"nome":"Aula A108","fino":null},{"nome":"Aula A217 spazio polifunzionale","fino":null},{"nome":"Aula A208","fino":null},{"nome":"studio docente","fino":null},{"nome":"Aula A214","fino":null},{"nome":"Aula A209","fino":null},{"nome":"LD Biotecnologie 3","fino":null},{"nome":"Aula A223","fino":null},{"nome":"Aula A218","fino":null},{"nome":"Aula A219","fino":null},{"nome":"Aula A216 spazio polifunzionale","fino":null},{"nome":"Aula A211","fino":null},{"nome":"Aula A215","fino":"16:00"},{"nome":"Aula A222","fino":"16:00"},{"nome":"Aula A101","fino":"15:00"},{"nome":"LD Biotecnologie 2","fino":"15:00"},{"nome":"Aula A203","fino":"15:00"},{"nome":"LD Meccanica","fino":"15:00"},{"nome":"Aula A105","fino":"15:00"},{"nome":"Aula  B104","fino":"15:00"},{"nome":"Aula A204","fino":"15:00"},{"nome":"Aula pc A201","fino":"15:00"}];

  test('httpRequest', () => {
    expect.assertions(1);
    return expect(tools.httpRequest(url, action, data)).resolves.toEqual(result);
  });
});