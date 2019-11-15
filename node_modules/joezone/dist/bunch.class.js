/* Copyright (c) 2019 Joe Honton */
var FS = require('fs'), Pfile = require('./pfile.class.js'), terminal = require('./terminal.namespace.js');

module.exports = class Bunch {
    static get FILE() {
        return 1;
    }
    static get DIRECTORY() {
        return 2;
    }
    static get SYMLINK() {
        return 4;
    }
    constructor(t, e, a) {
        void 0 == t ? this._defaultConstructor() : 'Bunch' == t.constructor.name ? this._copyConstructor(t) : 'Pfile' == t.constructor.name ? this._pfileConstructor(t, e) : 'String' == t.constructor.name ? this._stringConstructor(t, e, a) : terminal.logic('The first argument to a new Bunch should be one of {Bunch, Pfile, String}'), 
        Object.seal(this);
    }
    _defaultConstructor() {
        this._path = new Pfile(''), this._pattern = '*', this._flags = Bunch.FILE;
    }
    _copyConstructor(t) {
        this._path = t._path, this._pattern = t._pattern, this._flags = t._flags;
    }
    _pfileConstructor(t, e) {
        void 0 == e && (e = Bunch.FILE), this._path = new Pfile(t.getPath()), this._pattern = t.getFilename(), 
        this._flags = e;
    }
    _stringConstructor(t, e, a) {
        void 0 == e && (e = '*'), void 0 == a && (a = Bunch.FILE), this._path = new Pfile(t), 
        this._pattern = e, this._flags = a;
    }
    set path(t) {
        this._path = new Pfile(t);
    }
    get path() {
        return this._path;
    }
    set pattern(t) {
        this._pattern = t;
    }
    get pattern() {
        return this._pattern;
    }
    set flags(t) {
        this._flags = t & Bunch.FILE + Bunch.DIRECTORY + Bunch.SYMLINK;
    }
    get flags() {
        return this._flags;
    }
    addPath(t) {
        return this._path.addPath(t), this;
    }
    find(t) {
        if (void 0 == t && (t = !1), this._path.isRelativePath() && terminal.logic(`Using a relative path "${this._path.name}" is probably not what you want.`), 
        -1 != this._path.name.indexOf('*') || -1 != this._path.name.indexOf('?')) return terminal.invalid(`The path "${this._path.name}" should not contain wildcard characters. Place wildcard characters in the pattern only.`), 
        [];
        if (!this._path.exists()) return terminal.logic(`The path "${this._path.name}" does not exist.`), 
        [];
        if (this._path.isFile()) return terminal.logic(`The path "${this._path.name}" is a file, not a directory, skipping.`), 
        [];
        if ('' == this._pattern) return terminal.invalid('The pattern is empty, did you mean "*"?'), 
        [];
        var e = FS.readdirSync(this._path.name);
        e.sort();
        var a = (this._flags & Bunch.FILE) == Bunch.FILE, i = (this._flags & Bunch.DIRECTORY) == Bunch.DIRECTORY, s = (this._flags & Bunch.SYMLINK) == Bunch.SYMLINK, r = new RegExp(this.getSafePattern()), n = new Array();
        for (let o = 0; o < e.length; o++) {
            var h = e[o];
            if (r.test(h)) {
                var c = new Pfile(this._path).addPath(h), l = t ? c : new Pfile(h);
                a && c.isFile() ? n.push(l) : i && c.isDirectory() ? n.push(l) : s && c.isSymbolicLink() && n.push(l);
            }
        }
        return n;
    }
    getSafePattern() {
        var t = this._pattern.length, e = new Array(t);
        for (let i = 0; i < t; i++) {
            var a = this._pattern.charAt(i);
            switch (a) {
              case '*':
                e[i] = '.*?';
                break;

              case '?':
                e[i] = '.{1}';
                break;

              case '.':
                e[i] = '\\.';
                break;

              case '$':
                e[i] = '\\$';
                break;

              case '\\':
              case '(':
              case '(':
              case '[':
              case ']':
              case '{':
              case '}':
              case '|':
              case '^':
                e[i] = a;
                break;

              default:
                e[i] = a;
            }
        }
        return '^' + e.join('') + '$';
    }
};