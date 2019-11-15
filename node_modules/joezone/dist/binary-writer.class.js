/* Copyright (c) 2019 Joe Honton */
var FS = require('fs'), terminal = require('./terminal.namespace.js'), expect = require('./expect.function.js'), aver = require('./aver.function.js');

module.exports = class BinaryWriter {
    constructor() {
        this.fd = null, 'BinaryWriter' == this.constructor.name && Object.seal(this);
    }
    open(e) {
        expect(e, [ 'String', 'Pfile' ]), 'Pfile' == e.constructor.name && (e = e.name);
        try {
            return this.fd = FS.openSync(e, 'w'), !0;
        } catch (e) {
            return terminal.abnormal(e.message), !1;
        }
    }
    isOpen() {
        return null != this.fd;
    }
    close() {
        if (this.isOpen()) try {
            this.fd = FS.closeSync(this.fd), this.fd = null;
        } catch (e) {
            terminal.abnormal(e.message), this.fd = null;
        }
    }
    writeText(e) {
        if (expect(e, 'String'), !this.isOpen()) return null;
        try {
            FS.writeSync(this.fd, e);
        } catch (e) {
            terminal.abnormal(e.message);
        }
    }
    writeBlock(e, r) {
        expect(e, 'Buffer'), expect(r, 'Number');
        try {
            FS.writeSync(this.fd, e, 0, r);
        } catch (e) {
            terminal.abnormal(e.message);
        }
    }
    writeUint32(e) {
        if (expect(e, 'Number'), aver(e < 4294967296), !this.isOpen()) return null;
        try {
            var r = new ArrayBuffer(4);
            new DataView(r).setUint32(0, e, !0);
            var t = new Uint8Array(r);
            FS.writeSync(this.fd, t);
        } catch (e) {
            terminal.abnormal(e.message);
        }
    }
    writeUint16(e) {
        if (expect(e, 'Number'), aver(e < 65536), !this.isOpen()) return null;
        try {
            var r = new ArrayBuffer(2);
            new DataView(r).setUint16(0, e, !0);
            var t = new Uint8Array(r);
            FS.writeSync(this.fd, t);
        } catch (e) {
            terminal.abnormal(e.message);
        }
    }
    writeUint8(e) {
        if (expect(e, 'Number'), aver(e < 256), !this.isOpen()) return null;
        try {
            var r = new ArrayBuffer(1);
            new DataView(r).setUint8(0, e, !0);
            var t = new Uint8Array(r);
            FS.writeSync(this.fd, t);
        } catch (e) {
            terminal.abnormal(e.message);
        }
    }
};