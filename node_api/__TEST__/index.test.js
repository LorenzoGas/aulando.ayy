const ind = require("../index.js");


/* TEST DATA*/
test('Check date 2017-11-20', () => {
    expect(ind.checkDate('2017-11-20')).toBe(true);
});
test('Check date 2017-13-20', () => {
    expect(ind.checkDate('2017-13-20')).toBe(false);
});
test('Check date 2017-00-20', () => {
    expect(ind.checkDate('2017-00-20')).toBe(false);
});
test('Check date 2017-11-32', () => {
    expect(ind.checkDate('2017-11-32')).toBe(false);
});
test('Check date 2017-11-00', () => {
    expect(ind.checkDate('2017-11-00')).toBe(false);
});

