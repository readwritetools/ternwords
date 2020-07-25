//=============================================================================
// File:         ternwords/test/cases/caps-and-spaces.test.js
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
var weightRefs = ternWords.getExactMatch(word);
var sWeights = weightRefs.join(';');

// @testing values
var word = 'Less'; 					;; sWeights == '21 1;22 1'
var word = 'LESS';	 				;; sWeights == '21 1;22 1'
var word = 'leSS';	 				;; sWeights == '21 1;22 1'
var word = ' Less'; 				;; sWeights == '21 1;22 1'
var word = 'Less '; 				;; sWeights == '21 1;22 1'
var word = ' Less '; 				;; sWeights == '21 1;22 1'


//@using
var exists = ternWords.wordExists(word);
var isPrefix = ternWords.isPrefix(word);

// @testing exists
var word = ' Less '; 				;; exists == true && isPrefix == false
var word = ' Add ';					;; exists == true && isPrefix == true
var word = ' Addi ';				;; exists == false && isPrefix == true
var word = ' Hello ';				;; exists == false && isPrefix == false


//@using
var words = ternWords.getPrefixMatchesUnweighted(prefix, maxWords);
var wordList = words.join(',');

// @testing prefixMatchesUnweighted
var prefix = ' Rea ';  var maxWords= 15;		;; wordList == 'readability,readable,really'
var prefix = ' Read '; var maxWords= 15;		;; wordList == 'readability,readable'
var prefix = ' Readwrite '; var maxWords= 15;	;; wordList == ''


//@using
var words = ternWords.getPrefixMatchesWeighted(prefix, maxWords);
var wordList = '';
for (let i=0; i < words.length; i++) {
	var weightRefs = ternWords.getExactMatch(words[i]);
	wordList += `${words[i]} ${weightRefs[0].weight};`;
}


// @testing prefixMatchesWeighted
var prefix = ' St ';   var maxWords= 6;			;; wordList == 'style 64;string 6;strikethroughs 5;standard 2;stretches 1;strike 1;'
var prefix = ' Str ';  var maxWords= 6;			;; wordList == 'string 6;strikethroughs 5;stretches 1;strike 1;'
var prefix = ' Stri ';  var maxWords= 6;		;; wordList == 'string 6;strikethroughs 5;strike 1;'
var prefix = ' Strik ';  var maxWords= 6;		;; wordList == 'strikethroughs 5;strike 1;'
var prefix = ' Strike ';  var maxWords= 6;		;; wordList == 'strikethroughs 5;strike 1;'
var prefix = ' Strikes ';  var maxWords= 6;		;; wordList == ''

	
//@using
var weightRefs = ternWords.getExactMatch(word);
var titleList = '';
for (let i=0; i < weightRefs.length; i++) {
	var documentRef = ternWords.getDocumentRef(weightRefs[i].documentIndex);
	titleList += `${documentRef.title};`;
}

// @testing getDocumentRef
var word = ' Text ';  		;; titleList == 'character;text-decoration;text-emphasis;text-underline-position;text-emphasis-color;text-decoration-line;text-decoration-style;text-emphasis-position;text-emphasis-style;text-shadow;text-decoration-color;text-decoration-thickness;text-transform;word-break;min-height;min-width;max-height;max-width;white-space;'
var word = ' Character ';  	;; titleList == 'character;text-transform;letter-spacing;overflow-wrap;quotes;tab-size;text-decoration-color;text-decoration-line;text-decoration-style;text-decoration-thickness;text-decoration;text-emphasis-color;text-emphasis-position;text-emphasis-style;text-emphasis;text-shadow;text-underline-position;white-space;word-break;word-spacing;'
var word = ' Strike ';  	;; titleList == 'text-decoration-line;'
var	word = ' Decoration ';	;; titleList == 'character;text-decoration;text-decoration-color;text-decoration-line;text-decoration-style;text-decoration-thickness;text-underline-position;'
	
	
//@using
var documentIndexes = ternWords.multiWordSearch(multiWords, max);
var titleList = '';
for (let i=0; i < documentIndexes.length; i++) {
	var documentRef = ternWords.getDocumentRef(documentIndexes[i]);
	titleList += `${documentRef.title};`;
}

// @testing multiWordSearch
var max = 10; var multiWords = [' Min ', ' Max '];  					;; titleList == 'sizing;resize;max-height;max-width;min-height;min-width;'
var max = 10; var multiWords = [' Decoration ', ' Character '];  		;; titleList == 'character;text-decoration;text-decoration-color;text-decoration-line;text-decoration-style;text-decoration-thickness;text-underline-position;text-transform;letter-spacing;overflow-wrap;'
		