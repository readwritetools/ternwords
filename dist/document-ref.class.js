/* Copyright (c) 2019 Read Write Tools */
var expect = require('./utils/expect.js');

module.exports = class DocumentRef {
    constructor(t) {
        expect(t, 'Number'), this.documentIndex = t, this.hostPath = '', this.title = '', 
        this.description = '', this.keywords = '', Object.seal(this);
    }
    writeDocumentRefs(t) {
        expect(t, 'TextWriter'), t.putline(`!di ${this.documentIndex}`), t.putline(`!hp ${this.hostPath}`), 
        t.putline(`!ti ${this.title}`), t.putline(`!de ${this.description}`), t.putline(`!ky ${this.keywords}`);
    }
};