//=============================================================================
// File:         ternwords/test/cases/caps-and-spaces.test.js
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
var word = ' Text ';  		;; titleList == 'character - Typographic treatment | BLUEPHRASE;text-decoration - All-in-one spec | BLUEPHRASE;text-emphasis - All-in-one spec | BLUEPHRASE;text-underline-position - Make underlines more readable | BLUEPHRASE;text-emphasis-color - Emphasis mark color | BLUEPHRASE;text-decoration-line - Decorative line | BLUEPHRASE;text-decoration-style - Decorative line style | BLUEPHRASE;text-emphasis-position - Emphasis mark position | BLUEPHRASE;text-emphasis-style - Emphasis mark style | BLUEPHRASE;text-shadow - A typographic lighting effect | BLUEPHRASE;text-decoration-color - Decorative line color | BLUEPHRASE;text-decoration-thickness - Decorative line thickness | BLUEPHRASE;text-transform - UPPERCASE/lowercase | BLUEPHRASE;word-break - Force text to break when spaces are not present | BLUEPHRASE;min-height - Minimum height | BLUEPHRASE;min-width - Minimum width | BLUEPHRASE;max-height - Maximum height | BLUEPHRASE;max-width - Maximum width | BLUEPHRASE;white-space - When you really want to keep those spaces | BLUEPHRASE;'
var word = ' Character ';  	;; titleList == 'character - Typographic treatment | BLUEPHRASE;text-transform - UPPERCASE/lowercase | BLUEPHRASE;letter-spacing - Compress or expand letter spacing | BLUEPHRASE;overflow-wrap - Prevent overflow | BLUEPHRASE;quotes - Culturally aware quotations | BLUEPHRASE;tab-size - Oh no! Tabs versus spaces | BLUEPHRASE;text-decoration-color - Decorative line color | BLUEPHRASE;text-decoration-line - Decorative line | BLUEPHRASE;text-decoration-style - Decorative line style | BLUEPHRASE;text-decoration-thickness - Decorative line thickness | BLUEPHRASE;text-decoration - All-in-one spec | BLUEPHRASE;text-emphasis-color - Emphasis mark color | BLUEPHRASE;text-emphasis-position - Emphasis mark position | BLUEPHRASE;text-emphasis-style - Emphasis mark style | BLUEPHRASE;text-emphasis - All-in-one spec | BLUEPHRASE;text-shadow - A typographic lighting effect | BLUEPHRASE;text-underline-position - Make underlines more readable | BLUEPHRASE;white-space - When you really want to keep those spaces | BLUEPHRASE;word-break - Force text to break when spaces are not present | BLUEPHRASE;word-spacing - Whitespace effect for words | BLUEPHRASE;'
var word = ' Strike ';  	;; titleList == 'text-decoration-line - Decorative line | BLUEPHRASE;'
var	word = ' Decoration ';	;; titleList == 'character - Typographic treatment | BLUEPHRASE;text-decoration - All-in-one spec | BLUEPHRASE;text-decoration-color - Decorative line color | BLUEPHRASE;text-decoration-line - Decorative line | BLUEPHRASE;text-decoration-style - Decorative line style | BLUEPHRASE;text-decoration-thickness - Decorative line thickness | BLUEPHRASE;text-underline-position - Make underlines more readable | BLUEPHRASE;'
	
	
//@using
var documentIndexes = ternWords.multiWordSearch(multiWords, max);
var titleList = '';
for (let i=0; i < documentIndexes.length; i++) {
	var documentRef = ternWords.getDocumentRef(documentIndexes[i]);
	titleList += `${documentRef.title};`;
}

// @testing multiWordSearch
var max = 10; var multiWords = [' Min ', ' Max '];  					;; titleList == 'sizing - Width and height | BLUEPHRASE;resize - Can the user change the size? | BLUEPHRASE;max-height - Maximum height | BLUEPHRASE;max-width - Maximum width | BLUEPHRASE;min-height - Minimum height | BLUEPHRASE;min-width - Minimum width | BLUEPHRASE;'
var max = 10; var multiWords = [' Decoration ', ' Character '];  		;; titleList == 'character - Typographic treatment | BLUEPHRASE;text-decoration - All-in-one spec | BLUEPHRASE;text-decoration-color - Decorative line color | BLUEPHRASE;text-decoration-line - Decorative line | BLUEPHRASE;text-decoration-style - Decorative line style | BLUEPHRASE;text-decoration-thickness - Decorative line thickness | BLUEPHRASE;text-underline-position - Make underlines more readable | BLUEPHRASE;text-transform - UPPERCASE/lowercase | BLUEPHRASE;letter-spacing - Compress or expand letter spacing | BLUEPHRASE;overflow-wrap - Prevent overflow | BLUEPHRASE;'
		
