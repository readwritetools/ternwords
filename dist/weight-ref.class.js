/* Copyright (c) 2019 Read Write Tools */
var expect = require('./utils/expect.js');

module.exports = class WeightRef {
    constructor(e, t) {
        expect(e, 'Number'), expect(t, 'Number'), this.documentIndex = e, this.weight = t, 
        Object.seal(this);
    }
    writeWordWeights(e) {
        expect(e, 'TextWriter'), e.puts(`${this.documentIndex} ${this.weight}`);
    }
    toString() {
        return `${this.documentIndex} ${this.weight}`;
    }
};