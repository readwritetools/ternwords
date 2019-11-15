/* Copyright (c) 2019 Joe Honton */
var FS = require('fs'), terminal = require('./terminal.namespace.js'), expect = require('./expect.function.js');

module.exports = class Pfile {
    constructor(e) {
        void 0 == e && (e = ''), 'Pfile' == e.constructor.name ? this._copyConstructor(e) : 'Object' == e.constructor.name && '_filename' in e ? this._copyConstructor(e) : this._normalConstructor(e), 
        Object.seal(this);
    }
    _normalConstructor(e) {
        expect(e, 'String'), this.setPath(e);
    }
    _copyConstructor(e) {
        expect(e, 'Pfile'), this._filename = e._filename;
    }
    get name() {
        return this._filename;
    }
    setPath(e) {
        return expect(e, 'String'), this._filename = Pfile.posixStyle(e), this;
    }
    addPath(e) {
        expect(e, [ 'String', 'Pfile' ]), 'Pfile' == e.constructor.name && (e = e.name), 
        e = Pfile.posixStyle(e);
        var t = this._filename.length;
        return t > 0 && '/' != this._filename.charAt(t - 1) ? this._filename += '/' + e : this._filename += e, 
        this.canonicalize(), this;
    }
    addPathBefore(e) {
        expect(e, 'String'), e = Pfile.posixStyle(e), this.isAbsolutePath() && terminal.logic(`Attempting to add the path "${e}" before the absolute filename "${this._filename}" is probably not what you want.`);
        var t = e.length;
        return t > 0 && '/' != e.charAt(t - 1) ? this._filename = e + '/' + this._filename : this._filename = e + this._filename, 
        this.canonicalize(), this;
    }
    canonicalize() {
        this._filename = this._filename.replace('/./', '/'), this._filename = this._filename.replace('//', '/');
        for (var e = !0; e; ) e = this.removeDoubleDots();
        var t = this._filename.length;
        t > 1 && '/' == this._filename.charAt(t - 1) && (this._filename = this._filename.substr(0, t - 1));
    }
    removeDoubleDots() {
        var e = this._filename.split('/');
        for (let t = 1; t < e.length - 1; t++) if ('..' != e[t - 1] && '..' == e[t]) return e.splice(t - 1, 2), 
        this._filename = e.join('/'), !0;
        return !1;
    }
    static getCwd() {
        return Pfile.posixStyle(process.cwd());
    }
    makeAbsolute(e) {
        return this.isAbsolutePath() ? this : (e = void 0 == e ? Pfile.getCwd() : Pfile.posixStyle(e), 
        expect(e, 'String'), 0 == this._filename.length ? (this._filename = e, this) : new Pfile(e).isAbsolutePath() ? (this.addPathBefore(e), 
        this) : (terminal.logic(`Attempting to make "${this._filename}" absolute by prefixing it with the non-absolute path "${e}" won't work.`), 
        this));
    }
    getFQN() {
        return this._filename;
    }
    getPath() {
        if (this.isDirectory()) return this._filename;
        var e = this._filename.split('/');
        return e.splice(0, e.length - 1).join('/');
    }
    getFilename() {
        if (this.isDirectory()) return '';
        var e = this._filename.split('/');
        return e[e.length - 1];
    }
    getStem() {
        var e = this.getFilename(), t = e.split('.');
        return t.length <= 1 ? e : 2 == t.length && 0 == t[0].length ? e : t.splice(0, t.length - 1).join('.');
    }
    getExtension() {
        var e = this.getFilename().split('.');
        return e.length <= 1 ? '' : 2 == e.length && 0 == e[0].length ? '' : e[e.length - 1];
    }
    addExtension(e) {
        return this._filename = `${this._filename}.${e}`, this;
    }
    replaceExtension(e) {
        var t = this.getPath(), i = this.getStem();
        return this._filename = `${t}/${i}.${e}`, this;
    }
    exists() {
        try {
            return FS.accessSync(this._filename, FS.constants.F_OK), !0;
        } catch (e) {
            return 'ENOENT' != e.code && ('EACCES' != e.code && 'ENOTDIR' != e.code);
        }
    }
    isReadable() {
        try {
            return FS.accessSync(this._filename, FS.constants.R_OK), !0;
        } catch (e) {
            return 'EACCES' != e.code;
        }
    }
    isWritable() {
        try {
            return FS.accessSync(this._filename, FS.constants.W_OK), !0;
        } catch (e) {
            return 'EACCES' != e.code;
        }
    }
    isExecutable() {
        try {
            return FS.accessSync(this._filename, FS.constants.X_OK), !0;
        } catch (e) {
            return 'EACCES' != e.code;
        }
    }
    unlinkFile() {
        try {
            return !(!this.exists() || !this.isFile()) && (FS.unlinkSync(this._filename), !0);
        } catch (e) {
            return !1;
        }
    }
    rmDir() {
        try {
            return !(!this.exists() || !this.isDirectory()) && (FS.rmdirSync(this._filename), 
            !0);
        } catch (e) {
            return !1;
        }
    }
    mkDir() {
        if (this.exists()) return !0;
        var e = new Pfile(this);
        e.makeAbsolute();
        var t = e._filename.split('/');
        t[0].length > 1 && ':' == t[0].charAt(1) && (t[0] = t[0].substr(2));
        var i = new Pfile('/');
        for (let e = 0; e < t.length; e++) if (t[e].length > 0 && (i.addPath(t[e]), !i.exists())) try {
            FS.mkdirSync(i.getFQN());
        } catch (e) {
            return !1;
        }
        return !0;
    }
    isAbsolutePath() {
        return 0 != this._filename.length && ('/' == this._filename.charAt(0) || this._filename.length > 1 && ':' == this._filename.charAt(1));
    }
    isRelativePath() {
        return 0 != this._filename.length && !this.isAbsolutePath();
    }
    isDottedPath() {
        return 0 != this._filename.length && '.' == this._filename.charAt(0);
    }
    isDirectory() {
        try {
            return FS.lstatSync(this._filename).isDirectory();
        } catch (e) {
            return !1;
        }
    }
    isFile() {
        try {
            return FS.lstatSync(this._filename).isFile();
        } catch (e) {
            return !1;
        }
    }
    isSymbolicLink() {
        try {
            return FS.lstatSync(this._filename).isSymbolickLink();
        } catch (e) {
            return !1;
        }
    }
    getFileSize() {
        try {
            return FS.statSync(this._filename).size;
        } catch (e) {
            return !1;
        }
    }
    getModificationTime() {
        try {
            return FS.statSync(this._filename).mtime;
        } catch (e) {
            return !1;
        }
    }
    isSpecialDirectory() {
        return '.' == this._filename || '..' == this._filename;
    }
    touch() {
        try {
            var e = new Date();
            return FS.utimesSync(this._filename, e, e), !0;
        } catch (e) {
            return !1;
        }
    }
    static posixStyle(e) {
        return expect(e, 'String'), e.replace(/\\/g, '/');
    }
    static windowsStyle(e) {
        return expect(e, 'String'), e.replace(/\//g, '\\');
    }
};