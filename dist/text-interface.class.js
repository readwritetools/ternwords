/* Copyright (c) 2019 Read Write Tools */
var expect = require('./utils/expect.js'), terminal = require('./utils/terminal.js'), DocumentRef = require('./document-ref.class.js'), WeightRef = require('./weight-ref.class.js');

module.exports = class TextInterface {
    constructor() {
        this.currentDocumentRef = null, Object.seal(this);
    }
    readSiteWords(e, r) {
        expect(e, 'String'), expect(r, 'TernWords');
        var t = e.split('\n');
        if (0 == t.length) return !1;
        if (-1 == (n = t[0]).indexOf('rwsearch') || -1 == n.indexOf('sitewords')) return terminal.abnormal('This doesn\'t look like an RWSEARCH sitewords file. The first line should begin with the signature "!rwsearch 1.0 sitewords". Skipping.'), 
        !1;
        for (let e = 1; e < t.length; e++) {
            var n, s = e + 1;
            13 == (n = t[e]).charCodeAt(n.length - 1) && (n = n.substr(0, n.length - 1)), '!' == n.charAt(0) ? this.processDocumentRef(s, n, r) : this.processWordRef(s, n, r);
        }
        return !0;
    }
    processDocumentRef(e, r, t) {
        expect(e, 'Number'), expect(r, 'String'), expect(t, 'TernWords');
        var n = r.substr(1, 2), s = r.substr(4);
        switch (n) {
          case 'di':
            var i = parseInt(s);
            this.currentDocumentRef = new DocumentRef(i), t.documentRefs.push(this.currentDocumentRef);
            var o = t.documentRefs.length - 1;
            return void (o != i && terminal.abnormal(`DocumentIndex on line number ${e} expected to be ${o}, not ${i}`));

          case 'hp':
            return void (this.currentDocumentRef.hostPath = s);

          case 'ti':
            return void (this.currentDocumentRef.title = s);

          case 'de':
            return void (this.currentDocumentRef.description = s);

          case 'ky':
            return void (this.currentDocumentRef.keywords = s);

          default:
            return void terminal.abnormal(`Unrecognized document ref on line number ${e} ${r}`);
        }
    }
    processWordRef(e, r, t) {
        if (expect(e, 'Number'), expect(r, 'String'), expect(t, 'TernWords'), '' != r) {
            var n = r.indexOf(' ');
            if (-1 != n) {
                var s = r.substr(0, n), i = r.substr(n + 1).split(';'), o = new Array();
                for (let e = 0; e < i.length; e++) {
                    var [c, u] = i[e].split(' ');
                    c = parseInt(c), u = parseInt(u);
                    var a = new WeightRef(c, u);
                    o.push(a);
                }
                t.putWord(s, o);
            }
        }
    }
};