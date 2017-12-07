//var api = require('../node_dialog/index')
var tools = require ('../modules/__mocks__/functions')
var disp = require ('../modules/__mocks__/dispatcher')



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

describe('DISPATCHER', () => {
  var out1 = { 
    sessionId: '54310070',
    timestamp: '2017-12-07T08:41:16.425Z',
    actionIncomplete : false,
    action: 'auleLibere',
    parameters: { date: '', dipartimento: '2', time: '' },
    speech: 'Adesso sono disponibili queste aule:'
  }
  var result = 'LD Biotecnologie 3';
  
  it('actionIncomplete = false', () => {       
    return disp.dispatcher(out1)
    .then(data => {
      expect(data.result[0].nome).toEqual(result)
    })
  });


  var out2 = { 
    sessionId: '54310070',
    timestamp: '2017-12-07T08:41:16.425Z',
    actionIncomplete : true,
    action: 'auleLibere',
    parameters: { date: '', dipartimento: '2', time: '' },
    speech: 'Adesso sono disponibili queste aule:'
  }
  it('actionIncomplete = true', () => {
    return disp.dispatcher(out2)
    .then(data => {
      expect(data.result).toEqual(undefined)
    })
  });


});