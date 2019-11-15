/* Copyright (c) 2019 Joe Honton */
var StackTrace = require('./stack-trace.class.js'), Text = require('./text.class.js'), expect = require('./expect.function.js');

module.exports = class Log {
    constructor(t) {
        expect(t, [ 'String', 'undefined' ]), this.processName = void 0 === t ? '' : `[${t}]`, 
        this.tag = {
            todo: '    [TODO]',
            trace: '   [TRACE]',
            normal: '  [NORMAL]',
            abnormal: '[ABNORMAL]',
            invalid: ' [INVALID]',
            security: '[SECURITY]',
            logic: '   [LOGIC]',
            hopeless: '[HOPELESS]',
            exit: '[    EXIT]'
        }, Object.seal(this);
    }
    todo(t, e) {
        this.stderr(this.tag.todo, t, e);
    }
    trace(t, e) {
        this.stderr(this.tag.trace, t, e);
    }
    normal(t, e) {
        this.stderr(this.tag.normal, t, e);
    }
    abnormal(t, e) {
        this.stderr(this.tag.abnormal, t, e);
    }
    abnormalHalt(t, e) {
        this.stderr(this.tag.abnormal, t, e), this.exit(303, 'HALT');
    }
    invalid(t, e) {
        this.stderr(this.tag.invalid, t, e);
    }
    invalidHalt(t, e) {
        this.stderr(this.tag.invalid, t, e), this.exit(505, 'HALT');
    }
    security(t, e) {
        this.stderr(this.tag.security, t, e);
    }
    securityHalt(t, e) {
        this.stderr(this.tag.security, t, e), this.exit(707, 'HALT');
    }
    logic(t, e) {
        this.stderr(this.tag.logic, t, e);
    }
    logicHalt(t, e) {
        this.stderr(this.tag.logic, t, e), this.exit(808, 'HALT');
    }
    hopelessHalt(t, e) {
        this.stderr(this.tag.hopeless, t, e), this.exit(909, 'HALT');
    }
    exit(t, e) {
        e = e || '', expect(t, 'Number'), expect(e, 'String'), this.stderr(this.tag.exit, t, ` ${e}\n`), 
        process.exit(0);
    }
    stderr(t, e, r) {
        (e = e || '') instanceof Error && (e = e.toString()), expect(e, 'String'), expect(r = r || '', 'String'), 
        this.writeToConsoleOrStderr(`${this.processName}${t}${StackTrace.getFunctionName(4)} ${e}${r}`);
    }
    stackTrace() {
        var t = new Error().stack.split('\n');
        for (let e of t) this.trace(e);
    }
    writeToConsoleOrStderr(t) {
        if ('object' == typeof console && 'function' == typeof console.warn) console.warn(t); else {
            if ('object' != typeof process || 'object' != typeof process.stderr || 'function' != typeof process.stderr.write) throw new Error(t);
            process.stderr.write(t);
        }
    }
};