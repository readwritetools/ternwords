/* Copyright (c) 2020 Read Write Tools */
export default function expect(e, t, r) {
    if (r = r || '', void 0 === t) return logicMessage('\'type\' should be a String or an Array of Strings, but is undefined'), 
    !1;
    if (null === t) return logicMessage('\'type\' should be a String or an Array of Strings, but is null'), 
    !1;
    if ('String' == t.constructor.name) {
        if (1 == expectOne(e, t)) return !0;
    } else {
        if ('Array' != t.constructor.name) return logicMessage('\'type\' should be a String or an Array of Strings'), 
        !1;
        for (let r of t) if (1 == expectOne(e, r)) return !0;
    }
    var o = '';
    return o = 'String' == t.constructor.name ? `Expected type '${t}'` : 'Expected one of these types \'' + t.join('|') + '\'', 
    void 0 === e ? expectMessage(`${o}, but got 'undefined' ${r}`) : null === e ? expectMessage(`${o}, but got 'null' ${r}`) : void 0 === e.__proto__ ? expectMessage(`${o}, but got 'no prototype' ${r}`) : expectMessage(`${o}, but got '${e.constructor.name}' ${r}`), 
    !1;
};

function expectOne(e, t) {
    return void 0 === e ? 'undefined' == t : null === e ? 'null' == t : void 0 === e.__proto__ ? 'no prototype' == t : e.constructor.name == t;
}

function logicMessage(e) {
    writeToConsoleOrStderr(`[*EXPECT*] Logic: ${e = e || ''}\n`);
}

function expectMessage(e) {
    e = e || '', writeToConsoleOrStderr(`[*EXPECT*]${getStackTraceFunctionName(4)} ${e}\n`);
}

function writeToConsoleOrStderr(e) {
    if ('object' == typeof console && 'function' == typeof console.warn) console.warn(e); else {
        if ('object' != typeof process || 'object' != typeof process.stderr || 'function' != typeof process.stderr.write) throw new Error(e);
        process.stderr.write(e);
    }
}

function getStackTraceFunctionName(e) {
    var t = new Error().stack.split('\n')[e], r = /at (.*) ?\(/g.exec(t), o = '';
    return null == r ? t : (r.length > 1 && (o += r[1].trim()), `{${o = o.padStart(30, ' ')}}`);
}