/* Copyright (c) 2019 Read Write Tools */
var expect = require('./utils/expect.js'), TernaryNode = require('./ternary-node.class.js'), WeightRef = require('./weight-ref.class.js');

module.exports = class TernWords {
    constructor() {
        this.rootNode = null, this.documentRefs = new Array(), Object.seal(this);
    }
    putWord(e, t) {
        expect(e, 'String'), expect(t, 'Array'), this.rootNode = this.put(this.rootNode, e, t, 0);
    }
    getPrefixMatchesUnweighted(e, t) {
        expect(e, 'String'), expect(t, 'Number');
        var r = new Array(), i = this.get(this.rootNode, e, 0);
        return null == i ? [] : (i.isWord() && r.push(e), null != i.mid && this.getPartialsUnweighted(i.mid, e, t, r), 
        r);
    }
    getPartialsUnweighted(e, t, r, i) {
        expect(e, 'TernaryNode'), expect(t, 'String'), expect(r, 'Number'), expect(i, 'Array'), 
        e.isWord() && i.length < r && i.push(t + e.glyph), null != e.left && i.length < r && this.getPartialsUnweighted(e.left, t, r, i), 
        null != e.mid && i.length < r && this.getPartialsUnweighted(e.mid, t + e.glyph, r, i), 
        null != e.right && i.length < r && this.getPartialsUnweighted(e.right, t, r, i);
    }
    getPrefixMatchesWeighted(e, t) {
        expect(e, 'String'), expect(t, 'Number');
        var r = new Array(), i = this.get(this.rootNode, e, 0);
        if (null == i) return [];
        if (i.isWord()) {
            var h = i.getMaxWordWeight();
            r.push([ e, h ]);
        }
        null != i.mid && this.getPartialsWeighted(i.mid, e, r), r.sort((e, t) => t[1] - e[1]);
        var l = new Array();
        for (let e = 0; e < r.length && e < t; e++) l.push(r[e][0]);
        return l;
    }
    getPartialsWeighted(e, t, r) {
        if (expect(e, 'TernaryNode'), expect(t, 'String'), expect(r, 'Array'), e.isWord()) {
            var i = e.getMaxWordWeight();
            r.push([ t + e.glyph, i ]);
        }
        null != e.left && this.getPartialsWeighted(e.left, t, r), null != e.mid && this.getPartialsWeighted(e.mid, t + e.glyph, r), 
        null != e.right && this.getPartialsWeighted(e.right, t, r);
    }
    getExactMatch(e) {
        expect(e, 'String');
        var t = this.get(this.rootNode, e, 0);
        return null == t ? new Array() : t.weightRefs;
    }
    multiWordSearch(e, t) {
        expect(e, 'Array'), expect(t, 'Number');
        var r = new Map();
        for (let t = 0; t < e.length; t++) {
            var i = this.getExactMatch(e[t]);
            for (let e = 0; e < i.length; e++) {
                var h = i[e].documentIndex, l = i[e].weight, s = r.get(h);
                void 0 == s && (s = 0), s += 1e3 + l, r.set(h, s);
            }
        }
        var n = Array.from(r);
        n.sort((e, t) => t[1] - e[1]);
        var g = new Array();
        for (let e = 0; e < n.length && e < t; e++) g.push(n[e][0]);
        return g;
    }
    wordExists(e) {
        var t = this.get(this.rootNode, e, 0);
        return null != t && null != t.weightRefs;
    }
    isPrefix(e) {
        var t = this.get(this.rootNode, word, 0);
        return null != t && null != t.mid;
    }
    getDocumentRef(e) {
        return expect(e, 'Number'), e < 0 ? null : e >= this.documentRefs.length ? null : this.documentRefs[e];
    }
    countNodes() {
        return null == this.rootNode ? 0 : this.rootNode.countNodes(0);
    }
    countWords() {
        return null == this.rootNode ? 0 : this.rootNode.countWords(0);
    }
    put(e, t, r, i) {
        expect(e, [ 'null', 'TernaryNode' ]), expect(t, 'String'), expect(r, 'Array'), expect(i, 'Number');
        var h = t.charAt(i);
        return null == e && ((e = new TernaryNode()).glyph = h), h < e.glyph ? e.left = this.put(e.left, t, r, i) : h > e.glyph ? e.right = this.put(e.right, t, r, i) : i < t.length - 1 ? e.mid = this.put(e.mid, t, r, i + 1) : e.weightRefs = r, 
        e;
    }
    get(e, t, r) {
        if (null == e) return null;
        var i = t.charAt(r);
        return i < e.glyph ? this.get(e.left, t, r) : i > e.glyph ? this.get(e.right, t, r) : r < t.length - 1 ? this.get(e.mid, t, r + 1) : e;
    }
};