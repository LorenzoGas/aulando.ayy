const db = require("database.js");
describe('foo', function () {
    beforeEach(function (done) {
        window.jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
        setTimeout(function () {
            console.log('inside timeout');
            done();
        }, 500);
    });
    it('passes', function () {
        expect({}).toBeDefined();
    });
});

test('Il risultato è una lista di aule contenenti l aula A218', () => {
    expect.assertions(1);
    return db.auleLibere(2,"2017-12-7","16:00").then(data => {
        var json = '{"nome":"Aula A218","fino":null}';
        expect(JSON.stringify(data)).toContain(json);
    });
});
test('Aule libere per dipartimento -1 è un array vuoto', () => {
    expect.assertions(1);
    return db.auleLibere(-1,"2017-12-44","16:00").then(data => {
        var errore = '[]';
        expect(JSON.stringify(data)).toBe(errore);
    });
});

test('Lista di aule libere', () => {
    expect.assertions(1);
    return db.auleLibereDalleAlle(2,"2017-11-20","12:00","14:00").then(data => {
        var json = '{"nome":"Aula A223"}';
        expect(JSON.stringify(data)).toContain(json);
    });
});
test('Aule libere per dipartimento -1 è un array vuoto', () => {
    expect.assertions(1);
    return db.auleLibereDalleAlle(-1,"2017-11-20","12:00","14:00").then(data => {
        var errore = '[]';
        expect(JSON.stringify(data)).toBe(errore);
    });
});
test('Aule libere per un intervallo di tempo negativo è un array vuoto', () => {
    expect.assertions(1);
    return db.auleLibereDalleAlle(-1,"2017-11-20","16:00","14:00").then(data => {
        var errore = '[]';
        expect(JSON.stringify(data)).toBe(errore);
    });
});

test('Lista di lezioni per una aula', () => {
    expect.assertions(1);
    return db.orariAula(2,"Aula pc B106","2017-12-07").then(data => {
        var json = '{"docente":"Casati Fabio","materia":"Ingegneria del software 2","inizio":"09:00","fine":"11:00"}';
        expect(JSON.stringify(data)).toContain(json);
    });
});
test('Lista di lezioni per una aula non esistente', () => {
    expect.assertions(1);
    return db.orariAula(2,"Aula pc C106","2017-12-07").then(data => {
        var errore = '[]';
        expect(JSON.stringify(data)).toContain(errore);
    });
});
test('Lista di lezioni per una aula di un dipartimento non esistente', () => {
    expect.assertions(1);
    return db.orariAula(-1,"Aula pc B106","2017-12-07").then(data => {
        var errore = '[]';
        expect(JSON.stringify(data)).toContain(errore);
    });
});

test('Lista di dipartimenti', () => {
    expect.assertions(1);
    return db.listaDipartimenti().then(data => {
        var json = '{"id":2,"codice":"E0503","nome":"Dipartimenti - POVO"}';
        expect(JSON.stringify(data)).toContain(json);
    });
});

test('Lista di aule per un dipartimento', () => {
    expect.assertions(1);
    return db.listaAule(2).then(data => {
        var json = '{"nome":"Aula pc A201","codice":"A201"}';
        expect(JSON.stringify(data)).toContain(json);
    });
});
test('Lista di aule per un dipartimento non esistente', () => {
    expect.assertions(1);
    return db.listaAule(-1).then(data => {
        var errore = '[]';
        expect(JSON.stringify(data)).toContain(errore);
    });
});

test('Lista di docenti per un dipartimento', () => {
    expect.assertions(1);
    return db.listaDocenti(2).then(data => {
        var json = '{"cognomenome":"Casati Fabio","id":128,"codice":"000761"}';
        expect(JSON.stringify(data)).toContain(json);
    });
});
test('Lista di docenti per un dipartimento non esistente', () => {
    expect.assertions(1);
    return db.listaDocenti(-1).then(data => {
        var errore = '[]';
        expect(JSON.stringify(data)).toContain(errore);
    });
});

test('Lista di corsi per un dipartimento', () => {
    expect.assertions(1);
    return db.listaCorsi(2).then(data => {
        var json = '{"nome":"Informatica (triennale)","id":22,"codice":"0514G"}';
        expect(JSON.stringify(data)).toContain(json);
    });
});
test('Lista di corsi per un dipartimento non esistente', () => {
    expect.assertions(1);
    return db.listaCorsi(-1).then(data => {
        var errore = '[]';
        expect(JSON.stringify(data)).toContain(errore);
    });
});

test('Lista di subcorsi per un corso', () => {
    expect.assertions(1);
    return db.listaSubcorsi(22).then(data => {
        var json = '{"nome":"3 anno - scienze e tecnologie informatiche","id":123,"codice":"P0405|3"}';
        expect(JSON.stringify(data)).toContain(json);
    });
});
test('Lista di subcorsi per un corso non esistente', () => {
    expect.assertions(1);
    return db.listaSubcorsi(-1).then(data => {
        var errore = '[]';
        expect(JSON.stringify(data)).toContain(errore);
    });
});

test('Lista di materie per un subcorso', () => {
    expect.assertions(1);
    return db.listaMaterie(123).then(data => {
        var json = '{"nome":"Ingegneria del software 2","id":332}';
        expect(JSON.stringify(data)).toContain(json);
    });
});
test('Lista di materie per un subcorso non esistente', () => {
    expect.assertions(1);
    return db.listaMaterie(-1).then(data => {
        var errore = '[]';
        expect(JSON.stringify(data)).toContain(errore);
    });
});