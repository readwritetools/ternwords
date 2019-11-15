/* Copyright (c) 2019 Read Write Tools */
var StackTrace = require('./stack-trace.class.js');

function expectOne(e, t) {
    return void 0 === e ? 'undefined' == t : null === e ? 'null' == t : void 0 === e.__proto__ ? 'no prototype' == t : e.constructor.name == t;
}

function logicMessage(e) {
    writeToConsoleOrStderr(`[*EXPECT*] Logic: ${e = e || ''}\n`);
}

function expectMessage(e) {
    e = e || '', writeToConsoleOrStderr(`[*EXPECT*]${StackTrace.getFunctionName(4)} ${e}\n`);
}

function writeToConsoleOrStderr(e) {
    if ('object' == typeof console && 'function' == typeof console.warn) console.warn(e); else {
        if ('object' != typeof process || 'object' != typeof process.stderr || 'function' != typeof process.stderr.write) throw new Error(e);
        process.stderr.write(e);
    }
}

module.exports = function expect(e, t, o) {
    if (o = o || '', void 0 === t) return logicMessage('\'type\' should be a String or an Array of Strings, but is undefined'), 
    !1;
    if (null === t) return logicMessage('\'type\' should be a String or an Array of Strings, but is null'), 
    !1;
    if ('String' == t.constructor.name) {
        if (1 == expectOne(e, t)) return !0;
    } else {
        if ('Array' != t.constructor.name) return logicMessage('\'type\' should be a String or an Array of Strings'), 
        !1;
        for (let o of t) if (1 == expectOne(e, o)) return !0;
    }
    var r = '';
    return r = 'String' == t.constructor.name ? `Expected type '${t}'` : 'Expected one of these types \'' + t.join('|') + '\'', 
    void 0 === e ? expectMessage(`${r}, but got 'undefined' ${o}`) : null === e ? expectMessage(`${r}, but got 'null' ${o}`) : void 0 === e.__proto__ ? expectMessage(`${r}, but got 'no prototype' ${o}`) : expectMessage(`${r}, but got '${e.constructor.name}' ${o}`), 
    !1;
};