/* Copyright (c) 2020 Read Write Tools */
/* Copyright (c) 2019 Read Write Tools */
var expect = require('./utils/expect.js');

module.exports = class DocumentRef {
    constructor(t, e) {
        expect(t, 'TernWords'), expect(e, 'Number'), this.ternWords = t, this.documentIndex = e, 
        this.hostIndex = -1, this.pathIndex = -1, this.document = '', this.title = '', this.description = '', 
        this.keywords = '', Object.seal(this);
    }
    writeDocumentRefs(t) {
        expect(t, 'TextWriter'), t.putline(`!di ${this.documentIndex}`), t.putline(`!ur ${this.hostIndex} ${this.pathIndex} ${this.document}`), 
        t.putline(`!ti ${this.title}`), t.putline(`!de ${this.description}`), t.putline(`!ky ${this.keywords}`);
    }
    get host() {
        return this.ternWords.listOfHosts.get(this.hostIndex);
    }
    get path() {
        return this.ternWords.listOfPaths.get(this.pathIndex);
    }
    get url() {
        return '' != this.path ? `${this.host}/${this.path}/${this.document}` : `${this.host}/${this.document}`;
    }
};