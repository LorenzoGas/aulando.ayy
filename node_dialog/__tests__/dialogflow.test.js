//var api = require('../node_dialog/index')
var tools = require ('../modules/__mocks__/functions')
var disp = require ('../modules/__mocks__/dispatcher')

//lib supporto
var moment = require('moment-timezone')

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

    test("format '2017-11-30T12:42:57.789Z', '2017-09-12', '' to be giorno: '2017-09-12', ora: '13:42' ", () => {
      var dataOra = { 
        giorno: '2017-09-12',
        ora: '13:42'
      };

      expect(tools.getDate('2017-11-30T12:42:57.789Z', '2017-09-12')).toEqual( dataOra );
    });

    test("format '2017-11-30T12:42hkb:57.789Z', '', '' to return Invalid date", () => {
      var dataOra = { 
        giorno: 'Invalid date',
        ora: 'Invalid date'
      };

      expect(tools.getDate('2017-11-30T12:42hkb:57.789Z')).toEqual(dataOra);
    });

    test("format '', '', '' to return current date", () => {
      var dataOra = { 
        giorno: moment.tz("Europe/Rome").format('YYYY-MM-DD'),
        ora: moment.tz("Europe/Rome").format('HH:mm')
      };

      expect(tools.getDate()).toEqual(dataOra);
    });
  });

  describe('formatHour', () => {
    test('format 12:34:56 to be 12:34', () => {
      expect(tools.formatHour('12:34:56')).toBe('12:34');
    });

    test('format 12:34 to be 12:34', () => {
      expect(tools.formatHour('12:34:56')).toBe('12:34');
    });

    test('format 12/34/12 to throw error', () => {
      expect(() => tools.formatHour('12/34/12')).toThrowError(Error);
    });

    test('format 1234 to throw error', () => {
      expect(() => tools.formatHour('1234')).toThrowError(Error);
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

    test('offset 1234 to throw error', () => {
      expect(() => tools.getHourFromOffset('1234')).toThrowError(Error);
    });

    test('offset 12/34 to throw error', () => {
      expect(() => tools.getHourFromOffset('12/34')).toThrowError(Error);
    });

    test('expect null to throw exception', () => {
      expect(() => tools.getHourFromOffset()).toThrowError(TypeError);
    });
  });
});

describe('DISPATCHER', () => {
  var result = 'LD Biotecnologie 3';
  
  var out1 = { 
    sessionId: '54310070',
    timestamp: '2017-12-07T08:41:16.425Z',
    actionIncomplete : false,
    action: 'auleLibere',
    parameters: { date: '', dipartimento: '2', time: '' },
    speech: 'Adesso sono disponibili queste aule:'
  }

  
  it('expect actionIncomplete = false to return result', () => {       
    return disp.dispatcher(out1)
    .then(data => {
      expect(data.result[0].nome).toEqual(result);
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
  it('expect actionIncomplete = true to return undefined', () => {
    return disp.dispatcher(out2)
    .then(data => {
      expect(data.result).toBe(undefined);
    })
  });

  var out3 = { 
    sessionId: '54310070',
    timestamp: '2017-08-07T08:41:16.425Z',
    actionIncomplete : false,
    action: 'auleLiberePer',
    parameters: { date: '', dipartimento: '2', duration: { amount: 2 } },
    speech: 'Adesso sono disponibili queste aule:'
  }
  it('expect auleLiberePer to return result', () => {
    return disp.dispatcher(out3)
    .then(data => {
      expect(data.result[0].nome).toEqual(result);
    })
  });

  var out4 = { 
    sessionId: '54310070',
    timestamp: '2017-08-07T08:41:16.425Z',
    actionIncomplete : false,
    action: 'auleLibereDalleAlle',
    parameters: { date: '', dipartimento: '2', timeperiod: '14:00/16:00'},
    speech: 'Adesso sono disponibili queste aule:'
  }
  it('expect auleLibereDalleAlle with null date to return a valid result', () => {
    return disp.dispatcher(out4)
    .then(data => {
      expect(data.result[0].nome).toEqual(result);
    })
  });

  var out5 = { 
    sessionId: '54310070',
    timestamp: '2017-08-07T08:41:16.425Z',
    actionIncomplete : false,
    action: 'auleLibereDalleAlle',
    parameters: { date: '2017-12-10', dipartimento: '2', timeperiod: '14:00/16:00'},
    speech: 'Adesso sono disponibili queste aule:'
  }
  it('expect auleLibereDalleAlle with date to return a valid result', () => {
    return disp.dispatcher(out5)
    .then(data => {
      expect(data.result[0].nome).toEqual(result);
    })
  });

});