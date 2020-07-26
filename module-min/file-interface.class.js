/* Copyright (c) 2020 Read Write Tools */
import expect from './utils/expect.js';

import terminal from './utils/terminal.js';

import TextInterface from './text-interface.class.js';

import DocumentRef from './document-ref.class.js';

import { Pfile } from 'joezone';

import { TextReader } from 'joezone';

export default class FileInterface extends TextInterface {
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
        var o = i.getline();
        if (-1 == o.indexOf('rwsearch') || -1 == o.indexOf('sitewords')) return terminal.abnormal('This doesn\'t look like an RWSEARCH sitewords file. The first line should begin with the signature "!rwsearch 1.0 sitewords". Skipping.'), 
        !1;
        for (var s = 0; null != (o = i.getline()); ) s++, '!' == o.charAt(0) ? this.processDocumentRef(s, o, r) : this.processWordRef(s, o, r);
        return i.close(), !0;
    }
};