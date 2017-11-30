//var api = require('../node_dialog/index')
var tools = require ('../node_dialog/modules/functions')

describe('Function api', () => {

  test('format 12:34:56 to be 12:34', () => {
    expect(tools.formatHour('12:34:56')).toBe('12:34');
  });

  test('format 12:34 to be 12:34', () => {
    expect(tools.formatHour('12:34:56')).toBe('12:34');
  });

});