/* Copyright (c) 2019 Joe Honton */
var expect = require('./expect.function.js'), aver = require('./aver.function.js');

module.exports = class Text {
    constructor() {
        Object.seal(this);
    }
    static rightAlign(t, e) {
        expect(t, 'String'), expect(e, 'Number');
        var r = e, a = t.length;
        return a > r ? t.substr(0, r - 3) + '...' : Array(r + 1 - a).join(' ') + t;
    }
    static leftAlign(t, e) {
        expect(t, 'String'), expect(e, 'Number');
        var r = e, a = t.length;
        return a > r ? t.substr(0, r - 3) + '...' : t + Array(r + 1 - a).join(' ');
    }
    static ellipsed(t, e) {
        if ('' != t) {
            var r = t.length > e ? '...' : '';
            t = `${t.substr(0, e)}${r}`;
        }
        return t;
    }
    static countOccurences(t, e) {
        var r = 0;
        for (let a = 0; a < t.length; a++) t.charAt(a) == e && r++;
        return r;
    }
    static padLeft(t, e) {
        return expect(t, 'String'), expect(e, 'Number'), t.length > e ? t : t + ' '.repeat(e - t.length);
    }
    static padRight(t, e) {
        return expect(t, 'String'), expect(e, 'Number'), t.length > e ? t : ' '.repeat(e - t.length) + t;
    }
    static format32bits(t) {
        expect(t, 'Number'), aver(t < 4294967296), aver(t >= -2147483648);
        for (var e = (t < 0 ? 4294967295 + t + 1 : t).toString(2); e.length < 32; ) e = '0' + e;
        return e;
    }
    static format16bits(t) {
        expect(t, 'Number'), aver(t < 65536), aver(t >= -32768);
        for (var e = (t < 0 ? 65535 + t + 1 : t).toString(2); e.length < 16; ) e = '0' + e;
        return e;
    }
    static format8bits(t) {
        expect(t, 'Number'), aver(t < 256), aver(t >= -128);
        for (var e = (t < 0 ? 255 + t + 1 : t).toString(2); e.length < 8; ) e = '0' + e;
        return e;
    }
    static format32hex(t) {
        expect(t, 'Number'), aver(t < 4294967296), aver(t >= -2147483648);
        for (var e = (t < 0 ? 4294967295 + t + 1 : t).toString(16); e.length < 8; ) e = '0' + e;
        return e;
    }
    static format16hex(t) {
        expect(t, 'Number'), aver(t < 65536), aver(t >= -32768);
        for (var e = (t < 0 ? 65535 + t + 1 : t).toString(16); e.length < 4; ) e = '0' + e;
        return e;
    }
    static format8hex(t) {
        expect(t, 'Number'), aver(t < 256), aver(t >= -128);
        for (var e = (t < 0 ? 255 + t + 1 : t).toString(16); e.length < 2; ) e = '0' + e;
        return e;
    }
};