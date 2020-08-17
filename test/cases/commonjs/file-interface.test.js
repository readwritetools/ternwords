//=============================================================================
// File:         ternwords/test/cases/file-interface.test.js
// Language:     Bequiesce
// Copyright:    Joe Honton © 2019
// License:      CC-BY-NC-ND 4.0
// Initial date: Nov 13, 2019
//=============================================================================

// @common
var FileInterface = require('../../../commonjs/file-interface.class.js');
var TernWords = require('../../../commonjs/tern-words.class.js');

var fileInterface = new FileInterface();
var ternWords = new TernWords();
fileInterface.readSiteWords('../test/fixtures/input/style-ternary', ternWords);


//@using
var docCount = ternWords.documentRefs.length;
var hostCount = ternWords.listOfHosts.size;
var pathCount = ternWords.listOfPaths.size;
var nodeCount = ternWords.countNodes();
var wordCount = ternWords.countWords();

// @testing counts
									;; docCount == 28 && hostCount == 1 && pathCount == 3 && nodeCount == 2421 && wordCount == 588


//@using
var weightRefs = ternWords.getExactMatch(word);
var sWeights = weightRefs.join(';');

// @testing values
var word = 'le'; 					;; sWeights == ''
var word = 'less'; 					;; sWeights == '21 1;22 1'
var word = 'letters';				;; sWeights == '14 6;19 2;0 1;15 1;20 1;21 1;23 1'
var word = '水';						;; sWeights == '0 1;18 1;22 1;24 1;26 1';
var word = 'additional';			;; sWeights == '18 5;19 2';
var word = 'hello';					;; sWeights == '';


//@using
var exists = ternWords.wordExists(word);
var isPrefix = ternWords.isPrefix(word);

// @testing exists
var word = 'less'; 					;; exists == true && isPrefix == false
var word = 'letters';				;; exists == true && isPrefix == true
var word = '水';						;; exists == true && isPrefix == false
var word = 'additional';			;; exists == true && isPrefix == false
var word = 'add';					;; exists == true && isPrefix == true
var word = 'adds';					;; exists == true && isPrefix == false
var word = 'addi';					;; exists == false && isPrefix == true
var word = 'h';						;; exists == false && isPrefix == true
var word = 'he';					;; exists == false && isPrefix == true
var word = 'hex';					;; exists == true && isPrefix == false
var word = 'hello';					;; exists == false && isPrefix == false


//@using
var words = ternWords.getPrefixMatchesUnweighted(prefix, maxWords);
var wordList = words.join(',');

// @testing prefixMatchesUnweighted
var prefix = 'ma';   var maxWords= 10;		;; wordList == 'made,make,manuscript,mark,marked,marks,maroon,max,max-height,max-width'
var prefix = 'mar';  var maxWords= 10;		;; wordList == 'mark,marked,marks,maroon'
var prefix = 'mark'; var maxWords= 10; 		;; wordList == 'mark,marked,marks'
var prefix = 'ma';   var maxWords= 4;		;; wordList == 'made,make,manuscript,mark'
var prefix = 'mar';  var maxWords= 4;		;; wordList == 'mark,marked,marks,maroon'
var prefix = 'mark'; var maxWords= 4; 		;; wordList == 'mark,marked,marks'
var prefix = 're';   var maxWords= 15;		;; wordList == 'readability,readable,really,red,reduced,relative,rem,remove,required,resizable,resize,resized,resizing'
var prefix = 'rea';  var maxWords= 15;		;; wordList == 'readability,readable,really'
var prefix = 'read'; var maxWords= 15;		;; wordList == 'readability,readable'
var prefix = 'readwrite'; var maxWords= 15;	;; wordList == ''


//@using
var words = ternWords.getPrefixMatchesWeighted(prefix, maxWords);
var wordList = '';
for (let i=0; i < words.length; i++) {
	var weightRefs = ternWords.getExactMatch(words[i]);
	wordList += `${words[i]} ${weightRefs[0].weight};`;
}

// @testing prefixMatchesWeighted
var prefix = 'ma';   var maxWords= 10;		;; wordList == 'max 26;max-height 26;max-width 26;maximum 19;make 12;mark 12;marks 10;made 1;manuscript 1;marked 1;'
var prefix = 'ma';   var maxWords= 5;		;; wordList == 'max 26;max-height 26;max-width 26;maximum 19;make 12;'
var prefix = 're';   var maxWords= 15;		;; wordList == 'resize 22;readable 12;really 12;resized 8;readability 5;red 3;relative 3;reduced 1;rem 1;remove 1;required 1;resizable 1;resizing 1;'
var prefix = 're';   var maxWords= 5;		;; wordList == 'resize 22;readable 12;really 12;resized 8;readability 5;'
var prefix = 'st';   var maxWords= 6;		;; wordList == 'style 62;string 6;strikethroughs 5;standard 2;stretches 1;strike 1;'
var prefix = 'str';  var maxWords= 6;		;; wordList == 'string 6;strikethroughs 5;stretches 1;strike 1;'
var prefix = 'stri';  var maxWords= 6;		;; wordList == 'string 6;strikethroughs 5;strike 1;'
var prefix = 'strik';  var maxWords= 6;		;; wordList == 'strikethroughs 5;strike 1;'
var prefix = 'strike';  var maxWords= 6;	;; wordList == 'strikethroughs 5;strike 1;'
var prefix = 'strikes';  var maxWords= 6;	;; wordList == ''

