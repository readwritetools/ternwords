/* Copyright (c) 2019 Joe Honton */
var FS = require('fs'), expect = require('./expect.function.js'), SHA1 = require('./sha1.class.js'), Pfile = require('./pfile.class.js');

module.exports = class Diff {
    constructor(t, e, i, n) {
        expect(t, 'String'), expect(e, 'String'), expect(i, 'String'), expect(n, 'String'), 
        this.prefixMissing = t, this.postfixMissing = e, this.prefixAdditions = i, this.postfixAdditions = n, 
        Object.seal(this);
    }
    diffFiles(t, e) {
        expect(t, 'Pfile'), expect(e, 'Pfile');
        var i = new SHA1(), n = i.checksum(t), h = i.checksum(e);
        if (n == h) return '';
        var r = FS.readFileSync(t.name, 'utf8'), a = FS.readFileSync(e.name, 'utf8');
        return this.diffStrings(r, a);
    }
    diffStrings(t, e) {
        expect(t, 'String'), expect(e, 'String');
        var i = new diff_match_patch(), n = i.diff_main(t, e);
        i.diff_cleanupSemantic(n);
        var h = '';
        for (let t = 0; t < n.length; t++) switch (n[t][0]) {
          case -1:
            h += this.prefixMissing, h += n[t][1], h += this.postfixMissing;
            break;

          case 0:
            h += n[t][1];
            break;

          case 1:
            h += this.prefixAdditions, h += n[t][1], h += this.postfixAdditions;
        }
        return h;
    }
};

function diff_match_patch() {
    this.Diff_Timeout = 1, this.Diff_EditCost = 4, this.Match_Threshold = .5, this.Match_Distance = 1e3, 
    this.Patch_DeleteThreshold = .5, this.Patch_Margin = 4, this.Match_MaxBits = 32;
}

var DIFF_DELETE = -1, DIFF_INSERT = 1, DIFF_EQUAL = 0;

diff_match_patch.Diff, diff_match_patch.prototype.diff_main = function(t, e, i, n) {
    void 0 === n && (n = this.Diff_Timeout <= 0 ? Number.MAX_VALUE : new Date().getTime() + 1e3 * this.Diff_Timeout);
    var h = n;
    if (null == t || null == e) throw new Error('Null input. (diff_main)');
    if (t == e) return t ? [ [ DIFF_EQUAL, t ] ] : [];
    void 0 === i && (i = !0);
    var r = i, a = this.diff_commonPrefix(t, e), f = t.substring(0, a);
    t = t.substring(a), e = e.substring(a), a = this.diff_commonSuffix(t, e);
    var s = t.substring(t.length - a);
    t = t.substring(0, t.length - a), e = e.substring(0, e.length - a);
    var c = this.diff_compute_(t, e, r, h);
    return f && c.unshift([ DIFF_EQUAL, f ]), s && c.push([ DIFF_EQUAL, s ]), this.diff_cleanupMerge(c), 
    c;
}, diff_match_patch.prototype.diff_compute_ = function(t, e, i, n) {
    var h;
    if (!t) return [ [ DIFF_INSERT, e ] ];
    if (!e) return [ [ DIFF_DELETE, t ] ];
    var r = t.length > e.length ? t : e, a = t.length > e.length ? e : t, f = r.indexOf(a);
    if (-1 != f) return h = [ [ DIFF_INSERT, r.substring(0, f) ], [ DIFF_EQUAL, a ], [ DIFF_INSERT, r.substring(f + a.length) ] ], 
    t.length > e.length && (h[0][0] = h[2][0] = DIFF_DELETE), h;
    if (1 == a.length) return [ [ DIFF_DELETE, t ], [ DIFF_INSERT, e ] ];
    var s = this.diff_halfMatch_(t, e);
    if (s) {
        var c = s[0], l = s[1], _ = s[2], g = s[3], o = s[4], p = this.diff_main(c, _, i, n), u = this.diff_main(l, g, i, n);
        return p.concat([ [ DIFF_EQUAL, o ] ], u);
    }
    return i && t.length > 100 && e.length > 100 ? this.diff_lineMode_(t, e, n) : this.diff_bisect_(t, e, n);
}, diff_match_patch.prototype.diff_lineMode_ = function(t, e, i) {
    t = (l = this.diff_linesToChars_(t, e)).chars1, e = l.chars2;
    var n = l.lineArray, h = this.diff_main(t, e, !1, i);
    this.diff_charsToLines_(h, n), this.diff_cleanupSemantic(h), h.push([ DIFF_EQUAL, '' ]);
    for (var r = 0, a = 0, f = 0, s = '', c = ''; r < h.length; ) {
        switch (h[r][0]) {
          case DIFF_INSERT:
            f++, c += h[r][1];
            break;

          case DIFF_DELETE:
            a++, s += h[r][1];
            break;

          case DIFF_EQUAL:
            if (a >= 1 && f >= 1) {
                h.splice(r - a - f, a + f), r = r - a - f;
                for (var l, _ = (l = this.diff_main(s, c, !1, i)).length - 1; _ >= 0; _--) h.splice(r, 0, l[_]);
                r += l.length;
            }
            f = 0, a = 0, s = '', c = '';
        }
        r++;
    }
    return h.pop(), h;
}, diff_match_patch.prototype.diff_bisect_ = function(t, e, i) {
    for (var n = t.length, h = e.length, r = Math.ceil((n + h) / 2), a = r, f = 2 * r, s = new Array(f), c = new Array(f), l = 0; l < f; l++) s[l] = -1, 
    c[l] = -1;
    s[a + 1] = 0, c[a + 1] = 0;
    for (var _ = n - h, g = _ % 2 != 0, o = 0, p = 0, u = 0, d = 0, F = 0; F < r && !(new Date().getTime() > i); F++) {
        for (var m = -F + o; m <= F - p; m += 2) {
            for (var E = a + m, D = (M = m == -F || m != F && s[E - 1] < s[E + 1] ? s[E + 1] : s[E - 1] + 1) - m; M < n && D < h && t.charAt(M) == e.charAt(D); ) M++, 
            D++;
            if (s[E] = M, M > n) p += 2; else if (D > h) o += 2; else if (g) {
                if ((v = a + _ - m) >= 0 && v < f && -1 != c[v]) {
                    if (M >= (b = n - c[v])) return this.diff_bisectSplit_(t, e, M, D, i);
                }
            }
        }
        for (var I = -F + u; I <= F - d; I += 2) {
            for (var b, v = a + I, x = (b = I == -F || I != F && c[v - 1] < c[v + 1] ? c[v + 1] : c[v - 1] + 1) - I; b < n && x < h && t.charAt(n - b - 1) == e.charAt(h - x - 1); ) b++, 
            x++;
            if (c[v] = b, b > n) d += 2; else if (x > h) u += 2; else if (!g) {
                if ((E = a + _ - I) >= 0 && E < f && -1 != s[E]) {
                    var M;
                    D = a + (M = s[E]) - E;
                    if (M >= (b = n - b)) return this.diff_bisectSplit_(t, e, M, D, i);
                }
            }
        }
    }
    return [ [ DIFF_DELETE, t ], [ DIFF_INSERT, e ] ];
}, diff_match_patch.prototype.diff_bisectSplit_ = function(t, e, i, n, h) {
    var r = t.substring(0, i), a = e.substring(0, n), f = t.substring(i), s = e.substring(n), c = this.diff_main(r, a, !1, h), l = this.diff_main(f, s, !1, h);
    return c.concat(l);
}, diff_match_patch.prototype.diff_linesToChars_ = function(t, e) {
    var i = [], n = {};
    i[0] = '';
    function diff_linesToCharsMunge_(t) {
        for (var e = '', h = 0, r = -1, a = i.length; r < t.length - 1; ) {
            -1 == (r = t.indexOf('\n', h)) && (r = t.length - 1);
            var f = t.substring(h, r + 1);
            h = r + 1, (n.hasOwnProperty ? n.hasOwnProperty(f) : void 0 !== n[f]) ? e += String.fromCharCode(n[f]) : (e += String.fromCharCode(a), 
            n[f] = a, i[a++] = f);
        }
        return e;
    }
    return {
        chars1: diff_linesToCharsMunge_(t),
        chars2: diff_linesToCharsMunge_(e),
        lineArray: i
    };
}, diff_match_patch.prototype.diff_charsToLines_ = function(t, e) {
    for (var i = 0; i < t.length; i++) {
        for (var n = t[i][1], h = [], r = 0; r < n.length; r++) h[r] = e[n.charCodeAt(r)];
        t[i][1] = h.join('');
    }
}, diff_match_patch.prototype.diff_commonPrefix = function(t, e) {
    if (!t || !e || t.charAt(0) != e.charAt(0)) return 0;
    for (var i = 0, n = Math.min(t.length, e.length), h = n, r = 0; i < h; ) t.substring(r, h) == e.substring(r, h) ? r = i = h : n = h, 
    h = Math.floor((n - i) / 2 + i);
    return h;
}, diff_match_patch.prototype.diff_commonSuffix = function(t, e) {
    if (!t || !e || t.charAt(t.length - 1) != e.charAt(e.length - 1)) return 0;
    for (var i = 0, n = Math.min(t.length, e.length), h = n, r = 0; i < h; ) t.substring(t.length - h, t.length - r) == e.substring(e.length - h, e.length - r) ? r = i = h : n = h, 
    h = Math.floor((n - i) / 2 + i);
    return h;
}, diff_match_patch.prototype.diff_commonOverlap_ = function(t, e) {
    var i = t.length, n = e.length;
    if (0 == i || 0 == n) return 0;
    i > n ? t = t.substring(i - n) : i < n && (e = e.substring(0, i));
    var h = Math.min(i, n);
    if (t == e) return h;
    for (var r = 0, a = 1; ;) {
        var f = t.substring(h - a), s = e.indexOf(f);
        if (-1 == s) return r;
        a += s, 0 != s && t.substring(h - a) != e.substring(0, a) || (r = a, a++);
    }
}, diff_match_patch.prototype.diff_halfMatch_ = function(t, e) {
    if (this.Diff_Timeout <= 0) return null;
    var i = t.length > e.length ? t : e, n = t.length > e.length ? e : t;
    if (i.length < 4 || 2 * n.length < i.length) return null;
    var h = this;
    function diff_halfMatchI_(t, e, i) {
        for (var n, r, a, f, s = t.substring(i, i + Math.floor(t.length / 4)), c = -1, l = ''; -1 != (c = e.indexOf(s, c + 1)); ) {
            var _ = h.diff_commonPrefix(t.substring(i), e.substring(c)), g = h.diff_commonSuffix(t.substring(0, i), e.substring(0, c));
            l.length < g + _ && (l = e.substring(c - g, c) + e.substring(c, c + _), n = t.substring(0, i - g), 
            r = t.substring(i + _), a = e.substring(0, c - g), f = e.substring(c + _));
        }
        return 2 * l.length >= t.length ? [ n, r, a, f, l ] : null;
    }
    var r, a = diff_halfMatchI_(i, n, Math.ceil(i.length / 4)), f = diff_halfMatchI_(i, n, Math.ceil(i.length / 2));
    if (!a && !f) return null;
    r = f ? a && a[4].length > f[4].length ? a : f : a;
    var s, c, l, _;
    t.length > e.length ? (s = r[0], c = r[1], l = r[2], _ = r[3]) : (l = r[0], _ = r[1], 
    s = r[2], c = r[3]);
    return [ s, c, l, _, r[4] ];
}, diff_match_patch.prototype.diff_cleanupSemantic = function(t) {
    for (var e = !1, i = [], n = 0, h = null, r = 0, a = 0, f = 0, s = 0, c = 0; r < t.length; ) t[r][0] == DIFF_EQUAL ? (i[n++] = r, 
    a = s, f = c, s = 0, c = 0, h = t[r][1]) : (t[r][0] == DIFF_INSERT ? s += t[r][1].length : c += t[r][1].length, 
    h && h.length <= Math.max(a, f) && h.length <= Math.max(s, c) && (t.splice(i[n - 1], 0, [ DIFF_DELETE, h ]), 
    t[i[n - 1] + 1][0] = DIFF_INSERT, n--, r = --n > 0 ? i[n - 1] : -1, a = 0, f = 0, 
    s = 0, c = 0, h = null, e = !0)), r++;
    for (e && this.diff_cleanupMerge(t), this.diff_cleanupSemanticLossless(t), r = 1; r < t.length; ) {
        if (t[r - 1][0] == DIFF_DELETE && t[r][0] == DIFF_INSERT) {
            var l = t[r - 1][1], _ = t[r][1], g = this.diff_commonOverlap_(l, _), o = this.diff_commonOverlap_(_, l);
            g >= o ? (g >= l.length / 2 || g >= _.length / 2) && (t.splice(r, 0, [ DIFF_EQUAL, _.substring(0, g) ]), 
            t[r - 1][1] = l.substring(0, l.length - g), t[r + 1][1] = _.substring(g), r++) : (o >= l.length / 2 || o >= _.length / 2) && (t.splice(r, 0, [ DIFF_EQUAL, l.substring(0, o) ]), 
            t[r - 1][0] = DIFF_INSERT, t[r - 1][1] = _.substring(0, _.length - o), t[r + 1][0] = DIFF_DELETE, 
            t[r + 1][1] = l.substring(o), r++), r++;
        }
        r++;
    }
}, diff_match_patch.prototype.diff_cleanupSemanticLossless = function(t) {
    function diff_cleanupSemanticScore_(t, e) {
        if (!t || !e) return 6;
        var i = t.charAt(t.length - 1), n = e.charAt(0), h = i.match(diff_match_patch.nonAlphaNumericRegex_), r = n.match(diff_match_patch.nonAlphaNumericRegex_), a = h && i.match(diff_match_patch.whitespaceRegex_), f = r && n.match(diff_match_patch.whitespaceRegex_), s = a && i.match(diff_match_patch.linebreakRegex_), c = f && n.match(diff_match_patch.linebreakRegex_), l = s && t.match(diff_match_patch.blanklineEndRegex_), _ = c && e.match(diff_match_patch.blanklineStartRegex_);
        return l || _ ? 5 : s || c ? 4 : h && !a && f ? 3 : a || f ? 2 : h || r ? 1 : 0;
    }
    for (var e = 1; e < t.length - 1; ) {
        if (t[e - 1][0] == DIFF_EQUAL && t[e + 1][0] == DIFF_EQUAL) {
            var i = t[e - 1][1], n = t[e][1], h = t[e + 1][1], r = this.diff_commonSuffix(i, n);
            if (r) {
                var a = n.substring(n.length - r);
                i = i.substring(0, i.length - r), n = a + n.substring(0, n.length - r), h = a + h;
            }
            for (var f = i, s = n, c = h, l = diff_cleanupSemanticScore_(i, n) + diff_cleanupSemanticScore_(n, h); n.charAt(0) === h.charAt(0); ) {
                i += n.charAt(0), n = n.substring(1) + h.charAt(0), h = h.substring(1);
                var _ = diff_cleanupSemanticScore_(i, n) + diff_cleanupSemanticScore_(n, h);
                _ >= l && (l = _, f = i, s = n, c = h);
            }
            t[e - 1][1] != f && (f ? t[e - 1][1] = f : (t.splice(e - 1, 1), e--), t[e][1] = s, 
            c ? t[e + 1][1] = c : (t.splice(e + 1, 1), e--));
        }
        e++;
    }
}, diff_match_patch.nonAlphaNumericRegex_ = /[^a-zA-Z0-9]/, diff_match_patch.whitespaceRegex_ = /\s/, 
diff_match_patch.linebreakRegex_ = /[\r\n]/, diff_match_patch.blanklineEndRegex_ = /\n\r?\n$/, 
diff_match_patch.blanklineStartRegex_ = /^\r?\n\r?\n/, diff_match_patch.prototype.diff_cleanupEfficiency = function(t) {
    for (var e = !1, i = [], n = 0, h = null, r = 0, a = !1, f = !1, s = !1, c = !1; r < t.length; ) t[r][0] == DIFF_EQUAL ? (t[r][1].length < this.Diff_EditCost && (s || c) ? (i[n++] = r, 
    a = s, f = c, h = t[r][1]) : (n = 0, h = null), s = c = !1) : (t[r][0] == DIFF_DELETE ? c = !0 : s = !0, 
    h && (a && f && s && c || h.length < this.Diff_EditCost / 2 && a + f + s + c == 3) && (t.splice(i[n - 1], 0, [ DIFF_DELETE, h ]), 
    t[i[n - 1] + 1][0] = DIFF_INSERT, n--, h = null, a && f ? (s = c = !0, n = 0) : (r = --n > 0 ? i[n - 1] : -1, 
    s = c = !1), e = !0)), r++;
    e && this.diff_cleanupMerge(t);
}, diff_match_patch.prototype.diff_cleanupMerge = function(t) {
    t.push([ DIFF_EQUAL, '' ]);
    for (var e, i = 0, n = 0, h = 0, r = '', a = ''; i < t.length; ) switch (t[i][0]) {
      case DIFF_INSERT:
        h++, a += t[i][1], i++;
        break;

      case DIFF_DELETE:
        n++, r += t[i][1], i++;
        break;

      case DIFF_EQUAL:
        n + h > 1 ? (0 !== n && 0 !== h && (0 !== (e = this.diff_commonPrefix(a, r)) && (i - n - h > 0 && t[i - n - h - 1][0] == DIFF_EQUAL ? t[i - n - h - 1][1] += a.substring(0, e) : (t.splice(0, 0, [ DIFF_EQUAL, a.substring(0, e) ]), 
        i++), a = a.substring(e), r = r.substring(e)), 0 !== (e = this.diff_commonSuffix(a, r)) && (t[i][1] = a.substring(a.length - e) + t[i][1], 
        a = a.substring(0, a.length - e), r = r.substring(0, r.length - e))), 0 === n ? t.splice(i - h, n + h, [ DIFF_INSERT, a ]) : 0 === h ? t.splice(i - n, n + h, [ DIFF_DELETE, r ]) : t.splice(i - n - h, n + h, [ DIFF_DELETE, r ], [ DIFF_INSERT, a ]), 
        i = i - n - h + (n ? 1 : 0) + (h ? 1 : 0) + 1) : 0 !== i && t[i - 1][0] == DIFF_EQUAL ? (t[i - 1][1] += t[i][1], 
        t.splice(i, 1)) : i++, h = 0, n = 0, r = '', a = '';
    }
    '' === t[t.length - 1][1] && t.pop();
    var f = !1;
    for (i = 1; i < t.length - 1; ) t[i - 1][0] == DIFF_EQUAL && t[i + 1][0] == DIFF_EQUAL && (t[i][1].substring(t[i][1].length - t[i - 1][1].length) == t[i - 1][1] ? (t[i][1] = t[i - 1][1] + t[i][1].substring(0, t[i][1].length - t[i - 1][1].length), 
    t[i + 1][1] = t[i - 1][1] + t[i + 1][1], t.splice(i - 1, 1), f = !0) : t[i][1].substring(0, t[i + 1][1].length) == t[i + 1][1] && (t[i - 1][1] += t[i + 1][1], 
    t[i][1] = t[i][1].substring(t[i + 1][1].length) + t[i + 1][1], t.splice(i + 1, 1), 
    f = !0)), i++;
    f && this.diff_cleanupMerge(t);
}, diff_match_patch.prototype.diff_xIndex = function(t, e) {
    var i, n = 0, h = 0, r = 0, a = 0;
    for (i = 0; i < t.length && (t[i][0] !== DIFF_INSERT && (n += t[i][1].length), t[i][0] !== DIFF_DELETE && (h += t[i][1].length), 
    !(n > e)); i++) r = n, a = h;
    return t.length != i && t[i][0] === DIFF_DELETE ? a : a + (e - r);
}, diff_match_patch.prototype.diff_prettyHtml = function(t) {
    for (var e = [], i = /&/g, n = /</g, h = />/g, r = /\n/g, a = 0; a < t.length; a++) {
        var f = t[a][0], s = t[a][1].replace(i, '&amp;').replace(n, '&lt;').replace(h, '&gt;').replace(r, '&para;<br>');
        switch (f) {
          case DIFF_INSERT:
            e[a] = '<ins style="background:#e6ffe6;">' + s + '</ins>';
            break;

          case DIFF_DELETE:
            e[a] = '<del style="background:#ffe6e6;">' + s + '</del>';
            break;

          case DIFF_EQUAL:
            e[a] = '<span>' + s + '</span>';
        }
    }
    return e.join('');
}, diff_match_patch.prototype.diff_text1 = function(t) {
    for (var e = [], i = 0; i < t.length; i++) t[i][0] !== DIFF_INSERT && (e[i] = t[i][1]);
    return e.join('');
}, diff_match_patch.prototype.diff_text2 = function(t) {
    for (var e = [], i = 0; i < t.length; i++) t[i][0] !== DIFF_DELETE && (e[i] = t[i][1]);
    return e.join('');
}, diff_match_patch.prototype.diff_levenshtein = function(t) {
    for (var e = 0, i = 0, n = 0, h = 0; h < t.length; h++) {
        var r = t[h][0], a = t[h][1];
        switch (r) {
          case DIFF_INSERT:
            i += a.length;
            break;

          case DIFF_DELETE:
            n += a.length;
            break;

          case DIFF_EQUAL:
            e += Math.max(i, n), i = 0, n = 0;
        }
    }
    return e += Math.max(i, n);
}, diff_match_patch.prototype.diff_toDelta = function(t) {
    for (var e = [], i = 0; i < t.length; i++) switch (t[i][0]) {
      case DIFF_INSERT:
        e[i] = '+' + encodeURI(t[i][1]);
        break;

      case DIFF_DELETE:
        e[i] = '-' + t[i][1].length;
        break;

      case DIFF_EQUAL:
        e[i] = '=' + t[i][1].length;
    }
    return e.join('\t').replace(/%20/g, ' ');
}, diff_match_patch.prototype.diff_fromDelta = function(t, e) {
    for (var i = [], n = 0, h = 0, r = e.split(/\t/g), a = 0; a < r.length; a++) {
        var f = r[a].substring(1);
        switch (r[a].charAt(0)) {
          case '+':
            try {
                i[n++] = [ DIFF_INSERT, decodeURI(f) ];
            } catch (t) {
                throw new Error('Illegal escape in diff_fromDelta: ' + f);
            }
            break;

          case '-':
          case '=':
            var s = parseInt(f, 10);
            if (isNaN(s) || s < 0) throw new Error('Invalid number in diff_fromDelta: ' + f);
            var c = t.substring(h, h += s);
            '=' == r[a].charAt(0) ? i[n++] = [ DIFF_EQUAL, c ] : i[n++] = [ DIFF_DELETE, c ];
            break;

          default:
            if (r[a]) throw new Error('Invalid diff operation in diff_fromDelta: ' + r[a]);
        }
    }
    if (h != t.length) throw new Error('Delta length (' + h + ') does not equal source text length (' + t.length + ').');
    return i;
}, diff_match_patch.prototype.match_main = function(t, e, i) {
    if (null == t || null == e || null == i) throw new Error('Null input. (match_main)');
    return i = Math.max(0, Math.min(i, t.length)), t == e ? 0 : t.length ? t.substring(i, i + e.length) == e ? i : this.match_bitap_(t, e, i) : -1;
}, diff_match_patch.prototype.match_bitap_ = function(t, e, i) {
    if (e.length > this.Match_MaxBits) throw new Error('Pattern too long for this browser.');
    var n = this.match_alphabet_(e), h = this;
    function match_bitapScore_(t, n) {
        var r = t / e.length, a = Math.abs(i - n);
        return h.Match_Distance ? r + a / h.Match_Distance : a ? 1 : r;
    }
    var r = this.Match_Threshold, a = t.indexOf(e, i);
    -1 != a && (r = Math.min(match_bitapScore_(0, a), r), -1 != (a = t.lastIndexOf(e, i + e.length)) && (r = Math.min(match_bitapScore_(0, a), r)));
    var f = 1 << e.length - 1;
    a = -1;
    for (var s, c, l, _ = e.length + t.length, g = 0; g < e.length; g++) {
        for (s = 0, c = _; s < c; ) match_bitapScore_(g, i + c) <= r ? s = c : _ = c, c = Math.floor((_ - s) / 2 + s);
        _ = c;
        var o = Math.max(1, i - c + 1), p = Math.min(i + c, t.length) + e.length, u = Array(p + 2);
        u[p + 1] = (1 << g) - 1;
        for (var d = p; d >= o; d--) {
            var F = n[t.charAt(d - 1)];
            if (u[d] = 0 === g ? (u[d + 1] << 1 | 1) & F : (u[d + 1] << 1 | 1) & F | (l[d + 1] | l[d]) << 1 | 1 | l[d + 1], 
            u[d] & f) {
                var m = match_bitapScore_(g, d - 1);
                if (m <= r) {
                    if (r = m, !((a = d - 1) > i)) break;
                    o = Math.max(1, 2 * i - a);
                }
            }
        }
        if (match_bitapScore_(g + 1, i) > r) break;
        l = u;
    }
    return a;
}, diff_match_patch.prototype.match_alphabet_ = function(t) {
    for (var e = {}, i = 0; i < t.length; i++) e[t.charAt(i)] = 0;
    for (i = 0; i < t.length; i++) e[t.charAt(i)] |= 1 << t.length - i - 1;
    return e;
}, diff_match_patch.prototype.patch_addContext_ = function(t, e) {
    if (0 != e.length) {
        for (var i = e.substring(t.start2, t.start2 + t.length1), n = 0; e.indexOf(i) != e.lastIndexOf(i) && i.length < this.Match_MaxBits - this.Patch_Margin - this.Patch_Margin; ) n += this.Patch_Margin, 
        i = e.substring(t.start2 - n, t.start2 + t.length1 + n);
        n += this.Patch_Margin;
        var h = e.substring(t.start2 - n, t.start2);
        h && t.diffs.unshift([ DIFF_EQUAL, h ]);
        var r = e.substring(t.start2 + t.length1, t.start2 + t.length1 + n);
        r && t.diffs.push([ DIFF_EQUAL, r ]), t.start1 -= h.length, t.start2 -= h.length, 
        t.length1 += h.length + r.length, t.length2 += h.length + r.length;
    }
}, diff_match_patch.prototype.patch_make = function(t, e, i) {
    var n, h;
    if ('string' == typeof t && 'string' == typeof e && void 0 === i) n = t, (h = this.diff_main(n, e, !0)).length > 2 && (this.diff_cleanupSemantic(h), 
    this.diff_cleanupEfficiency(h)); else if (t && 'object' == typeof t && void 0 === e && void 0 === i) h = t, 
    n = this.diff_text1(h); else if ('string' == typeof t && e && 'object' == typeof e && void 0 === i) n = t, 
    h = e; else {
        if ('string' != typeof t || 'string' != typeof e || !i || 'object' != typeof i) throw new Error('Unknown call format to patch_make.');
        n = t, h = i;
    }
    if (0 === h.length) return [];
    for (var r = [], a = new diff_match_patch.patch_obj(), f = 0, s = 0, c = 0, l = n, _ = n, g = 0; g < h.length; g++) {
        var o = h[g][0], p = h[g][1];
        switch (f || o === DIFF_EQUAL || (a.start1 = s, a.start2 = c), o) {
          case DIFF_INSERT:
            a.diffs[f++] = h[g], a.length2 += p.length, _ = _.substring(0, c) + p + _.substring(c);
            break;

          case DIFF_DELETE:
            a.length1 += p.length, a.diffs[f++] = h[g], _ = _.substring(0, c) + _.substring(c + p.length);
            break;

          case DIFF_EQUAL:
            p.length <= 2 * this.Patch_Margin && f && h.length != g + 1 ? (a.diffs[f++] = h[g], 
            a.length1 += p.length, a.length2 += p.length) : p.length >= 2 * this.Patch_Margin && f && (this.patch_addContext_(a, l), 
            r.push(a), a = new diff_match_patch.patch_obj(), f = 0, l = _, s = c);
        }
        o !== DIFF_INSERT && (s += p.length), o !== DIFF_DELETE && (c += p.length);
    }
    return f && (this.patch_addContext_(a, l), r.push(a)), r;
}, diff_match_patch.prototype.patch_deepCopy = function(t) {
    for (var e = [], i = 0; i < t.length; i++) {
        var n = t[i], h = new diff_match_patch.patch_obj();
        h.diffs = [];
        for (var r = 0; r < n.diffs.length; r++) h.diffs[r] = n.diffs[r].slice();
        h.start1 = n.start1, h.start2 = n.start2, h.length1 = n.length1, h.length2 = n.length2, 
        e[i] = h;
    }
    return e;
}, diff_match_patch.prototype.patch_apply = function(t, e) {
    if (0 == t.length) return [ e, [] ];
    t = this.patch_deepCopy(t);
    var i = this.patch_addPadding(t);
    e = i + e + i, this.patch_splitMax(t);
    for (var n = 0, h = [], r = 0; r < t.length; r++) {
        var a, f = t[r].start2 + n, s = this.diff_text1(t[r].diffs), c = -1;
        if (s.length > this.Match_MaxBits ? -1 != (a = this.match_main(e, s.substring(0, this.Match_MaxBits), f)) && (-1 == (c = this.match_main(e, s.substring(s.length - this.Match_MaxBits), f + s.length - this.Match_MaxBits)) || a >= c) && (a = -1) : a = this.match_main(e, s, f), 
        -1 == a) h[r] = !1, n -= t[r].length2 - t[r].length1; else {
            h[r] = !0, n = a - f;
            var l;
            if (s == (l = -1 == c ? e.substring(a, a + s.length) : e.substring(a, c + this.Match_MaxBits))) e = e.substring(0, a) + this.diff_text2(t[r].diffs) + e.substring(a + s.length); else {
                var _ = this.diff_main(s, l, !1);
                if (s.length > this.Match_MaxBits && this.diff_levenshtein(_) / s.length > this.Patch_DeleteThreshold) h[r] = !1; else {
                    this.diff_cleanupSemanticLossless(_);
                    for (var g, o = 0, p = 0; p < t[r].diffs.length; p++) {
                        var u = t[r].diffs[p];
                        u[0] !== DIFF_EQUAL && (g = this.diff_xIndex(_, o)), u[0] === DIFF_INSERT ? e = e.substring(0, a + g) + u[1] + e.substring(a + g) : u[0] === DIFF_DELETE && (e = e.substring(0, a + g) + e.substring(a + this.diff_xIndex(_, o + u[1].length))), 
                        u[0] !== DIFF_DELETE && (o += u[1].length);
                    }
                }
            }
        }
    }
    return [ e = e.substring(i.length, e.length - i.length), h ];
}, diff_match_patch.prototype.patch_addPadding = function(t) {
    for (var e = this.Patch_Margin, i = '', n = 1; n <= e; n++) i += String.fromCharCode(n);
    for (n = 0; n < t.length; n++) t[n].start1 += e, t[n].start2 += e;
    var h = t[0], r = h.diffs;
    if (0 == r.length || r[0][0] != DIFF_EQUAL) r.unshift([ DIFF_EQUAL, i ]), h.start1 -= e, 
    h.start2 -= e, h.length1 += e, h.length2 += e; else if (e > r[0][1].length) {
        var a = e - r[0][1].length;
        r[0][1] = i.substring(r[0][1].length) + r[0][1], h.start1 -= a, h.start2 -= a, h.length1 += a, 
        h.length2 += a;
    }
    if (0 == (r = (h = t[t.length - 1]).diffs).length || r[r.length - 1][0] != DIFF_EQUAL) r.push([ DIFF_EQUAL, i ]), 
    h.length1 += e, h.length2 += e; else if (e > r[r.length - 1][1].length) {
        a = e - r[r.length - 1][1].length;
        r[r.length - 1][1] += i.substring(0, a), h.length1 += a, h.length2 += a;
    }
    return i;
}, diff_match_patch.prototype.patch_splitMax = function(t) {
    for (var e = this.Match_MaxBits, i = 0; i < t.length; i++) if (!(t[i].length1 <= e)) {
        var n = t[i];
        t.splice(i--, 1);
        for (var h = n.start1, r = n.start2, a = ''; 0 !== n.diffs.length; ) {
            var f = new diff_match_patch.patch_obj(), s = !0;
            for (f.start1 = h - a.length, f.start2 = r - a.length, '' !== a && (f.length1 = f.length2 = a.length, 
            f.diffs.push([ DIFF_EQUAL, a ])); 0 !== n.diffs.length && f.length1 < e - this.Patch_Margin; ) {
                var c = n.diffs[0][0], l = n.diffs[0][1];
                c === DIFF_INSERT ? (f.length2 += l.length, r += l.length, f.diffs.push(n.diffs.shift()), 
                s = !1) : c === DIFF_DELETE && 1 == f.diffs.length && f.diffs[0][0] == DIFF_EQUAL && l.length > 2 * e ? (f.length1 += l.length, 
                h += l.length, s = !1, f.diffs.push([ c, l ]), n.diffs.shift()) : (l = l.substring(0, e - f.length1 - this.Patch_Margin), 
                f.length1 += l.length, h += l.length, c === DIFF_EQUAL ? (f.length2 += l.length, 
                r += l.length) : s = !1, f.diffs.push([ c, l ]), l == n.diffs[0][1] ? n.diffs.shift() : n.diffs[0][1] = n.diffs[0][1].substring(l.length));
            }
            a = (a = this.diff_text2(f.diffs)).substring(a.length - this.Patch_Margin);
            var _ = this.diff_text1(n.diffs).substring(0, this.Patch_Margin);
            '' !== _ && (f.length1 += _.length, f.length2 += _.length, 0 !== f.diffs.length && f.diffs[f.diffs.length - 1][0] === DIFF_EQUAL ? f.diffs[f.diffs.length - 1][1] += _ : f.diffs.push([ DIFF_EQUAL, _ ])), 
            s || t.splice(++i, 0, f);
        }
    }
}, diff_match_patch.prototype.patch_toText = function(t) {
    for (var e = [], i = 0; i < t.length; i++) e[i] = t[i];
    return e.join('');
}, diff_match_patch.prototype.patch_fromText = function(t) {
    var e = [];
    if (!t) return e;
    for (var i = t.split('\n'), n = 0, h = /^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@$/; n < i.length; ) {
        var r = i[n].match(h);
        if (!r) throw new Error('Invalid patch string: ' + i[n]);
        var a = new diff_match_patch.patch_obj();
        for (e.push(a), a.start1 = parseInt(r[1], 10), '' === r[2] ? (a.start1--, a.length1 = 1) : '0' == r[2] ? a.length1 = 0 : (a.start1--, 
        a.length1 = parseInt(r[2], 10)), a.start2 = parseInt(r[3], 10), '' === r[4] ? (a.start2--, 
        a.length2 = 1) : '0' == r[4] ? a.length2 = 0 : (a.start2--, a.length2 = parseInt(r[4], 10)), 
        n++; n < i.length; ) {
            var f = i[n].charAt(0);
            try {
                var s = decodeURI(i[n].substring(1));
            } catch (t) {
                throw new Error('Illegal escape in patch_fromText: ' + s);
            }
            if ('-' == f) a.diffs.push([ DIFF_DELETE, s ]); else if ('+' == f) a.diffs.push([ DIFF_INSERT, s ]); else if (' ' == f) a.diffs.push([ DIFF_EQUAL, s ]); else {
                if ('@' == f) break;
                if ('' !== f) throw new Error('Invalid patch mode "' + f + '" in: ' + s);
            }
            n++;
        }
    }
    return e;
}, diff_match_patch.patch_obj = function() {
    this.diffs = [], this.start1 = null, this.start2 = null, this.length1 = 0, this.length2 = 0;
}, diff_match_patch.patch_obj.prototype.toString = function() {
    for (var t, e = [ '@@ -' + (0 === this.length1 ? this.start1 + ',0' : 1 == this.length1 ? this.start1 + 1 : this.start1 + 1 + ',' + this.length1) + ' +' + (0 === this.length2 ? this.start2 + ',0' : 1 == this.length2 ? this.start2 + 1 : this.start2 + 1 + ',' + this.length2) + ' @@\n' ], i = 0; i < this.diffs.length; i++) {
        switch (this.diffs[i][0]) {
          case DIFF_INSERT:
            t = '+';
            break;

          case DIFF_DELETE:
            t = '-';
            break;

          case DIFF_EQUAL:
            t = ' ';
        }
        e[i + 1] = t + encodeURI(this.diffs[i][1]) + '\n';
    }
    return e.join('').replace(/%20/g, ' ');
};