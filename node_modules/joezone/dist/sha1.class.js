/* Copyright (c) 2019 Joe Honton */
var Crypto = require('crypto'), expect = require('./expect.function.js'), Pfile = require('./pfile.class.js'), BinaryReader = require('./binary-reader.class.js'), TextReader = require('./text-reader.class.js');

module.exports = class SHA1 {
    constructor() {
        Object.seal(this);
    }
    checksum(e) {
        expect(e, 'Pfile');
        var r = Crypto.createHash('sha1'), a = new TextReader();
        a.open(e.getFQN());
        for (var t; null != (t = a.getline()); ) r.update(t, 'utf8');
        a.close();
        var s = r.digest('hex');
        return s;
    }
    checksumBinary(e) {
        expect(e, 'Pfile');
        var r = Crypto.createHash('sha1'), a = new BinaryReader();
        for (a.open(e.getFQN()); a.readBlock(); ) r.update(a.buffer);
        a.close();
        var t = r.digest('hex');
        return t;
    }
};