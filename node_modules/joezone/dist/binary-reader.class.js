/* Copyright (c) 2019 Joe Honton */
var FS = require('fs'), terminal = require('./terminal.namespace.js'), expect = require('./expect.function.js');

module.exports = class BinaryReader {
    constructor() {
        this.fd = null, this.readSize = 8192, this.buffer = new Buffer(this.readSize), this.bufferLength = null, 
        this.blockOffset = null, this.bufferOffset = null, Object.seal(this), this.initialize();
    }
    initialize() {
        this.buffer.fill(0), this.bufferLength = 0, this.blockOffset = 0, this.bufferOffset = 0;
    }
    open(e) {
        expect(e, [ 'String', 'Pfile' ]), 'Pfile' == e.constructor.name && (e = e.name);
        try {
            return this.fd = FS.openSync(e, 'r'), this.initialize(), !0;
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
    readBlock() {
        if (!this.isOpen()) return !1;
        try {
            return this.buffer.fill(0), this.bufferLength = FS.readSync(this.fd, this.buffer, 0, this.readSize, this.blockOffset), 
            this.blockOffset += this.bufferLength, this.bufferOffset = 0, this.bufferLength > 0;
        } catch (e) {
            return terminal.trace(e.message), this.bufferLength = 0, this.bufferOffset = 0, 
            !1;
        }
    }
};