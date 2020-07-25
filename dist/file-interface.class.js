/* Copyright (c) 2019 Read Write Tools */
var expect = require('./utils/expect.js'), terminal = require('./utils/terminal.js'), TextInterface = require('./text-interface.class.js'), DocumentRef = require('./document-ref.class.js'), Pfile = require('joezone').Pfile, TextReader = require('joezone').TextReader;

module.exports = class FileInterface extends TextInterface {
    constructor() {
        super(), this.currentDocumentRef = null, Object.seal(this);
    }
    readSiteWords(e, r) {
        expect(e, 'String'), expect(r, 'TernWords');
        var t = new Pfile(e);
        if (!t.exists()) return terminal.abnormal(`File ${t.makeAbsolute().name} does not exist`), 
        !1;
        if (t.isDirectory()) return terminal.abnormal(`${t.name} is a directory, not a file`), 
        !1;
        var i = new TextReader();
        i.open(t);
        var s = i.getline();
        if (-1 == s.indexOf('rwsearch') || -1 == s.indexOf('sitewords')) return terminal.abnormal('This doesn\'t look like an RWSEARCH sitewords file. The first line should begin with the signature "!rwsearch 1.0 sitewords". Skipping.'), 
        !1;
        for (var n = 0; null != (s = i.getline()); ) n++, '!' == s.charAt(0) ? this.processDocumentRef(n, s, r) : this.processWordRef(n, s, r);
        return i.close(), !0;
    }
};