/* Copyright (c) 2020 Read Write Tools */
import expect from './utils/expect.js';

export default class WeightRef {
    constructor(t, e) {
        expect(t, 'Number'), expect(e, 'Number'), this.documentIndex = t, this.weight = e, 
        Object.seal(this);
    }
    writeWordWeights(t) {
        expect(t, 'TextWriter'), t.puts(`${this.documentIndex} ${this.weight}`);
    }
    toString() {
        return `${this.documentIndex} ${this.weight}`;
    }
};