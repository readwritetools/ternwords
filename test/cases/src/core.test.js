//=============================================================================
// File:         ternwords/test/cases/core.test.js
// Language:     Bequiesce
// Copyright:    Joe Honton © 2019
// License:      CC-BY-NC-ND 4.0
// Initial date: Nov 13, 2019
//=============================================================================

// @using
import TernWords from '../dbg/tern-words.class.js';
var tw = new TernWords();
tw.readSiteWords('../fixtures/input/style-ternary');
var weightRefs = tw.getExactMatch(word);
var s = weightRefs.toString();
console.log(s);

// @testing 
var word = 'hello'; 					;; s == 'todo';
