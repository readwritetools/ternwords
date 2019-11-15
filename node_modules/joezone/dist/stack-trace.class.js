/* Copyright (c) 2019 Joe Honton */
module.exports = class StackTrace {
    constructor() {
        Object.seal(this);
    }
    static getFunctionName(e) {
        var t = new Error().stack.split('\n')[e], a = /at (.*) ?\(/g, r = a.exec(t), n = '';
        return null == r ? t : (r.length > 1 && (n += r[1].trim()), `{${n = n.padStart(30, ' ')}}`);
    }
    static getSitus(e) {
        var t = new Error().stack.split('\n')[e], a = /at .*\((.*)\)/g, r = a.exec(t), n = '';
        return r.length > 1 && (n += r[1].trim()), n;
    }
    static getInfo(e) {
        var t = {
            classname: '',
            member: '',
            path: '',
            filename: '',
            line: '',
            column: ''
        }, a = new Error().stack.split('\n')[e], r = /at (.*) ?\(/g, n = r.exec(a), l = '';
        n.length > 1 && (l = n[1].trim());
        var s = l.split('.');
        t.classname = s[0], s.length > 1 && (t.member = s[1], t.member = t.member.replace(' (eval at evaluate', ''));
        var c = /at .*\((.*)\)/g, m = c.exec(a), i = '';
        m.length > 1 && (i = m[1].trim());
        var g = i.split(':'), u = g[0];
        g.length > 1 && (t.line = g[1]), g.length > 2 && (t.column = g[2]);
        var o = u.lastIndexOf('/');
        return -1 != o ? (t.path = u.substr(0, o), t.filename = u.substr(o + 1)) : t.filename = u, 
        t;
    }
};