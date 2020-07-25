/* Copyright (c) 2020 Read Write Tools */
/* Copyright (c) 2019 Read Write Tools */
var expect = require('./utils/expect.js');

module.exports = class TernaryNode {
    constructor() {
        this.glyph = '', this.left = null, this.mid = null, this.right = null, this.weightRefs = null, 
        Object.seal(this);
    }
    isWord() {
        return null != this.weightRefs;
    }
    getMaxWordWeight() {
        return null == this.weightRefs ? -1 : this.weightRefs[0].weight;
    }
    countNodes(t) {
        return expect(t, 'Number'), null != this.left && (t = this.left.countNodes(t)), 
        null != this.mid && (t = this.mid.countNodes(t)), null != this.right && (t = this.right.countNodes(t)), 
        ++t;
    }
    countWords(t) {
        return expect(t, 'Number'), null != this.left && (t = this.left.countWords(t)), 
        null != this.mid && (t = this.mid.countWords(t)), null != this.right && (t = this.right.countWords(t)), 
        null != this.weightRefs && t++, t;
    }
};