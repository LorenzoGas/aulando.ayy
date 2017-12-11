//jest.mock('../apiRequest')
var apiRequest = require('../apiRequest')

it("Test apiRequest query parole a caso", () => {
    var text = 'parole a caso'
    var id = '0000000000'
    return apiRequest.sendQuery(text, id).then((data) => {
        console.log(data)
        expect(typeof data).toBe('string');
    })
})

it("Test apiRequest query parole a caso con id a null", () => {
    var text = 'parole a caso'
    var id = null
    return apiRequest.sendQuery(text, id).then((data) => {
        expect(typeof data).toBe('string');
    })
})

it("Test apiRequest query text null", () => {
    var text = null
    var id = '0000000000'
    return apiRequest.sendQuery(text, id)
    .then()
    .catch((data) => {
        expect(data.message).toEqual('text must be a string.');
    })
})

it("Test apiRequest query text null and id null", () => {
    var text = null
    var id = null
    return apiRequest.sendQuery(text, id)
    .then()
    .catch((data) => {
        expect(data.message).toEqual('text must be a string.');
    })
})

it("Test apiRequest query text different object", () => {
    var text = {a: 'a', b: 'b'}
    var id = '0000000000'
    return apiRequest.sendQuery(text, id)
    .then()
    .catch((data) => {
        expect(data.message).toEqual('text must be a string.');
    })
})