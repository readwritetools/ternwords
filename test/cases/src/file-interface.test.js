//=============================================================================
// File:         ternwords/test/cases/file-interface.test.js
// Language:     Bequiesce
// Copyright:    Joe Honton © 2019
// License:      CC-BY-NC-ND 4.0
// Initial date: Nov 13, 2019
//=============================================================================

// @common
import FileInterface from '../../../dbg/file-interface.class.js';
import TernWords from '../../../dbg/tern-words.class.js';

var fileInterface = new FileInterface();
var ternWords = new TernWords();
fileInterface.readSiteWords('../test/fixtures/input/style-ternary', ternWords);


//@using
var docCount = ternWords.documentRefs.length;
var nodeCount = ternWords.countNodes();
var wordCount = ternWords.countWords();

// @testing counts
									;; docCount == 28 && nodeCount == 2409 && wordCount == 588


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
//console.log(wordList);

// @testing prefixMatchesWeighted
var prefix = 'ma';   var maxWords= 10;		;; wordList == 'max 25;max-height 25;max-width 25;maximum 13;marks 10;mark 8;make 3;made 1;manuscript 1;marked 1;'
var prefix = 'ma';   var maxWords= 5;		;; wordList == 'max 25;max-height 25;max-width 25;maximum 13;marks 10;'
var prefix = 're';   var maxWords= 15;		;; wordList == 'resize 21;resized 8;readability 5;readable 3;really 3;red 3;relative 3;reduced 1;rem 1;remove 1;required 1;resizable 1;resizing 1;'
var prefix = 're';   var maxWords= 5;		;; wordList == 'resize 21;resized 8;readability 5;readable 3;really 3;'
var prefix = 'st';   var maxWords= 6;		;; wordList == 'style 64;string 6;strikethroughs 5;standard 2;stretches 1;strike 1;'
var prefix = 'str';  var maxWords= 6;		;; wordList == 'string 6;strikethroughs 5;stretches 1;strike 1;'
var prefix = 'stri';  var maxWords= 6;		;; wordList == 'string 6;strikethroughs 5;strike 1;'
var prefix = 'strik';  var maxWords= 6;		;; wordList == 'strikethroughs 5;strike 1;'
var prefix = 'strike';  var maxWords= 6;	;; wordList == 'strikethroughs 5;strike 1;'
var prefix = 'strikes';  var maxWords= 6;	;; wordList == ''

	
//@using
var weightRefs = ternWords.getExactMatch(word);
var titleList = '';
for (let i=0; i < weightRefs.length; i++) {
	var documentRef = ternWords.getDocumentRef(weightRefs[i].documentIndex);
	titleList += `${documentRef.title};`;
}

// @testing getDocumentRef
var word = 'text';  		;; titleList == 'character;text-decoration;text-emphasis;text-underline-position;text-emphasis-color;text-shadow;text-decoration-style;text-emphasis-position;text-emphasis-style;text-decoration-line;text-decoration-color;text-transform;text-decoration-thickness;word-break;min-height;min-width;max-height;max-width;white-space;'
var word = 'character';  	;; titleList == 'character;text-transform;quotes;tab-size;text-decoration-color;text-decoration-line;text-decoration-style;text-decoration-thickness;text-decoration;text-emphasis-color;overflow-wrap;text-emphasis-style;text-emphasis;text-shadow;letter-spacing;text-underline-position;white-space;word-break;word-spacing;text-emphasis-position;'
var word = 'strike';  		;; titleList == 'text-decoration-line;'
var	word = 'decoration';	;; titleList == 'character;text-decoration;text-decoration-color;text-decoration-line;text-decoration-style;text-decoration-thickness;text-underline-position;'
	
	
//@using
var documentIndexes = ternWords.multiWordSearch(multiWords, max);
var titleList = '';
for (let i=0; i < documentIndexes.length; i++) {
	var documentRef = ternWords.getDocumentRef(documentIndexes[i]);
	titleList += `${documentRef.title};`;
}
//console.log(titleList);

// @testing multiWordSearch
var max = 10; var multiWords = ['min', 'max'];  					;; titleList ==  'sizing;resize;max-height;max-width;min-height;min-width;'
var max = 10; var multiWords = ['decoration', 'character'];  		;; titleList ==  'character;text-decoration;text-decoration-color;text-decoration-line;text-decoration-style;text-decoration-thickness;text-underline-position;text-transform;quotes;tab-size;'
var max = 10; var multiWords = ['decoration', 'text'];  			;; titleList ==  'character;text-decoration;text-decoration-line;text-decoration-style;text-decoration-color;text-decoration-thickness;text-underline-position;text-emphasis;text-emphasis-color;text-shadow;'
var max = 10; var multiWords = ['decoration', 'text', 'min', 'max']; ;; titleList == 'character;text-decoration;text-decoration-line;text-decoration-style;text-decoration-color;text-decoration-thickness;text-underline-position;max-height;max-width;sizing;'
		