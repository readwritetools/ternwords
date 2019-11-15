/* Copyright (c) 2019 Joe Honton */
var expect = require('./expect.function.js'), StackTrace = require('./stack-trace.class.js');

module.exports = function aver(e, t) {
    if (t = t || '', void 0 === e) process.stderr.write(`[* AVER *]${StackTrace.getFunctionName(3)} Expected boolean, but got 'undefined' (${t})\n`); else if (null === e) process.stderr.write(`[* AVER *]${StackTrace.getFunctionName(3)} Expected boolean, but got 'null' (${t})\n`); else if ('Boolean' != e.constructor.name) process.stderr.write(`[* AVER *]${StackTrace.getFunctionName(3)} Expected boolean, but got '${e.constructor.name}' (${t})\n`); else if (!1 === e) process.stderr.write(`[* AVER *]${StackTrace.getFunctionName(3)} Unable to aver ${StackTrace.getSitus(3)} (${t})\n`); else if (!0 === e) return !0;
    return !1;
};