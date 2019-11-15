/* Copyright (c) 2019 Joe Honton */
var expect = require('./expect.function.js'), aver = require('./aver.function.js'), TextReader = require('./text-reader.class.js'), Pfile = require('./pfile.class.js');

module.exports = class CRC32 {
    constructor() {
        this.table = new Int32Array(256), this.crc = 4294967295, this.initialize();
    }
    initialize() {
        for (let e = 0; e <= 255; e++) {
            this.table[e] = this.reflect(e, 8) << 24;
            for (let t = 0; t < 8; t++) this.table[e] = this.table[e] << 1 ^ (this.table[e] & 1 << 31 ? 79764919 : 0);
            this.table[e] = this.reflect(this.table[e], 32);
        }
    }
    reflect(e, t) {
        expect(e, 'Number'), expect(t, 'Number');
        var r = 0;
        for (let i = 1; i < t + 1; i++) 1 & e && (r |= 1 << t - i), e >>>= 1;
        return r;
    }
    partialCRC(e, t) {
        expect(e, 'Buffer'), expect(t, 'Number');
        for (let l = 0; l < t; l++) {
            var r = this.crc >>> 8, i = 255 & this.crc, s = e[l], a = i ^ s;
            aver(a >= 0 && a <= 255);
            var c = this.table[a];
            this.crc = r ^ c;
        }
    }
    computeFileCRC(e) {
        if (expect(e, [ 'String', 'Pfile' ]), 'String' == e.constructor.name && (e = new Pfile(e)), 
        !e.exists() || !e.isFile()) return !1;
        var t = new TextReader(e.name);
        if (!t.open(e.name)) return !1;
        for (;t.readBlock(); ) this.partialCRC(t.buffer, t.bufferLength);
        return t.close(), !0;
    }
    getResult() {
        var e = 4294967295 ^ this.crc;
        return e;
    }
};