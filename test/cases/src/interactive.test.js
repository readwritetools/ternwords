//=============================================================================
// File:         ternwords/test/cases/core.test.js
// Language:     Bequiesce
// Copyright:    Joe Honton © 2019
// License:      CC-BY-NC-ND 4.0
// Initial date: Nov 13, 2019
//=============================================================================

// Suitable for running with node inspector

import FileInterface from '../../../dbg/file-interface.class.js';
import TernWords from '../../../dbg/tern-words.class.js';

var fileInterface = new FileInterface();
var ternWords = new TernWords();

// read file
fileInterface.readSiteWords('../test/fixtures/input/style-ternary', ternWords);
var weightRefs = ternWords.getExactMatch('less');
var s = weightRefs.join(';');

// diagnostics
var docCount = ternWords.documentRefs.length;
var nodeCount = ternWords.countNodes();
var wordCount = ternWords.countWords();

// type-ahead
var words = ternWords.getPrefixMatchesWeighted('mar', 5);
var wordList = '';
for (let i=0; i < words.length; i++) {
	var weightRefs = ternWords.getExactMatch(words[i]);
	wordList += `${words[i]} ${weightRefs[0].weight};`;
}

// single word lookup
var weightRefs = ternWords.getExactMatch('strike');
var titleList = '';
for (let i=0; i < weightRefs.length; i++) {
	var documentRef = ternWords.getDocumentRef(weightRefs[i].documentIndex);
	titleList += `${documentRef.title};`;
}

// multiword search
var documentIndexes = ternWords.multiWordSearch(['decoration', 'character'], 5);
var titleList = '';
for (let i=0; i < documentIndexes.length; i++) {
	var documentRef = ternWords.getDocumentRef(documentIndexes[i]);
	titleList += `${documentRef.title};`;
}
console.log(titleList);

debugger;
