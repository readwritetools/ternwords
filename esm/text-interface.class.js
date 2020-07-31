/* Copyright (c) 2020 Read Write Tools */
import expect from './utils/expect.js';

import terminal from './utils/terminal.js';

import DocumentRef from './document-ref.class.js';

import WeightRef from './weight-ref.class.js';

export default class TextInterface {
    constructor() {
        this.currentDocumentRef = null, Object.seal(this);
    }
    readSiteWords(e, t) {
        expect(e, 'String'), expect(t, 'TernWords');
        var r = e.split('\n');
        if (0 == r.length) return !1;
        if (-1 == (s = r[0]).indexOf('rwsearch') || -1 == s.indexOf('sitewords')) return terminal.abnormal('This doesn\'t look like an RWSEARCH sitewords file. The first line should begin with the signature "!rwsearch 1.0 sitewords". Skipping.'), 
        !1;
        for (let e = 1; e < r.length; e++) {
            var s, n = e + 1;
            13 == (s = r[e]).charCodeAt(s.length - 1) && (s = s.substr(0, s.length - 1)), '!' == s.charAt(0) ? this.processDocumentRef(n, s, t) : this.processWordRef(n, s, t);
        }
        return !0;
    }
    processDocumentRef(e, t, r) {
        expect(e, 'Number'), expect(t, 'String'), expect(r, 'TernWords');
        var s = t.substr(1, 2), n = t.substr(4);
        switch (s) {
          case 'ho':
            var [i, o] = n.split(' ', 2);
            return i = parseInt(i), void r.listOfHosts.set(i, o);

          case 'pa':
            var [c, u] = n.split(' ', 2);
            return c = parseInt(c), void r.listOfPaths.set(c, u);

          case 'di':
            var a = parseInt(n);
            this.currentDocumentRef = new DocumentRef(r, a), r.documentRefs.push(this.currentDocumentRef);
            var d = r.documentRefs.length - 1;
            return void (d != a && terminal.abnormal(`DocumentIndex on line number ${e} expected to be ${d}, not ${a}`));

          case 'ur':
            var [i, c, f] = n.split(' ', 3);
            return this.currentDocumentRef.hostIndex = parseInt(i), this.currentDocumentRef.pathIndex = parseInt(c), 
            void (this.currentDocumentRef.document = f);

          case 'dt':
            return void (this.currentDocumentRef.lastmod = n);

          case 'ti':
            return void (this.currentDocumentRef.title = n);

          case 'de':
            return void (this.currentDocumentRef.description = n);

          case 'ky':
            return void (this.currentDocumentRef.keywords = n);

          default:
            return void terminal.abnormal(`Unrecognized document ref on line number ${e} ${t}`);
        }
    }
    processWordRef(e, t, r) {
        if (expect(e, 'Number'), expect(t, 'String'), expect(r, 'TernWords'), '' != t) {
            var s = t.indexOf(' ');
            if (-1 != s) {
                var n = t.substr(0, s), i = t.substr(s + 1).split(';'), o = new Array();
                for (let e = 0; e < i.length; e++) {
                    var [c, u] = i[e].split(' ');
                    c = parseInt(c), u = parseInt(u);
                    var a = new WeightRef(c, u);
                    o.push(a);
                }
                r.putWord(n, o);
            }
        }
    }
};