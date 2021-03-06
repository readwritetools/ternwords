//=============================================================================
// File:         ternwords/test/cases/file-interface.test.js
// Language:     Bequiesce
// Copyright:    Joe Honton © 2019
// License:      CC-BY-NC-ND 4.0
// Initial date: Nov 13, 2019
//=============================================================================

// @common
import FileInterface from '../../../commonjs/file-interface.class.js';
import TernWords from '../../../commonjs/tern-words.class.js';

var fileInterface = new FileInterface();
var ternWords = new TernWords();
fileInterface.readSiteWords('../test/fixtures/input/style-ternary', ternWords);


//@using
var weightRefs = ternWords.getExactMatch(word);
var sWeights = weightRefs.join(';');

//@testing values
var word = 'text'; 								;; sWeights == '19 110;8 38;12 32;15 29;9 28;5 27;6 27;10 27;11 27;13 27;4 23;7 22;14 22;17 18;23 4;24 4;21 3;22 3;16 2'
var word = 'text-decoration'; 					;; sWeights == '8 22;19 9;15 5'
var word = 'text-decoration-color'; 			;; sWeights == '4 22;19 7'
var word = 'text-decoration-line';				;; sWeights == '5 22;19 9;8 5'
var word = 'text-decoration-style';				;; sWeights == '6 22;19 9;8 5'
var word = 'textdecoration'; 					;; sWeights == '8 22;19 9;15 5'
var word = 'textdecorationcolor'; 				;; sWeights == '4 22;19 7'
var word = 'textdecorationline';				;; sWeights == '5 22;19 9;8 5'
var word = 'textdecorationstyle';				;; sWeights == '6 22;19 9;8 5'


//@using
var exists = ternWords.wordExists(word);
var isPrefix = ternWords.isPrefix(word);

// @testing exists
var word = 'text'; 							;; exists == true && isPrefix == true
var word = 'text-decoration'; 				;; exists == true && isPrefix == true
var word = 'text-decoration-color'; 		;; exists == true && isPrefix == false
var word = 'text-decoration-line'; 			;; exists == true && isPrefix == false
var word = 'text-decoration-style'; 		;; exists == true && isPrefix == false
var word = 'textdecoration'; 				;; exists == true && isPrefix == true
var word = 'textdecorationcolor'; 			;; exists == true && isPrefix == false
var word = 'textdecorationline'; 			;; exists == true && isPrefix == false
var word = 'textdecorationstyle'; 			;; exists == true && isPrefix == false
	

//@using
var words = ternWords.getPrefixMatchesUnweighted(prefix, maxWords);
var wordList = words.join(',');

// @testing prefixMatchesUnweighted
var prefix = 'text';   						var maxWords= 25;		;; wordList == 'text,text-decoration,text-decoration-color,text-decoration-line,text-decoration-style,text-decoration-thickness,text-emphasis,text-emphasis-color,text-emphasis-position,text-emphasis-style,text-shadow,text-transform,text-underline-position'
var prefix = 'offset';  					var maxWords= 5;		;; wordList == 'offset,offset-x,offset-y'
var prefix = 'max';  						var maxWords= 6;		;; wordList == 'max,max-height,max-width,maximum'
var prefix = 'pre';  						var maxWords= 7;		;; wordList == 'pre,pre-line,pre-wrap,present,prevent'

var prefix = 'text';   						var maxWords= 13;		;; wordList == 'text,text-decoration,text-decoration-color,text-decoration-line,text-decoration-style,text-decoration-thickness,text-emphasis,text-emphasis-color,text-emphasis-position,text-emphasis-style,text-shadow,text-transform,text-underline-position'
var prefix = 'offset';  					var maxWords= 3;		;; wordList == 'offset,offset-x,offset-y'
var prefix = 'max';  						var maxWords= 4;		;; wordList == 'max,max-height,max-width,maximum'
var prefix = 'pre';  						var maxWords= 5;		;; wordList == 'pre,pre-line,pre-wrap,present,prevent'


//@using
var words = ternWords.getPrefixMatchesWeighted(prefix, maxWords);
var wordList = words.join(',');

// @testing prefixMatchesWeighted
var prefix = 'text';   						var maxWords= 25;		;; wordList == 'text,text-decoration,text-decoration-color,text-decoration-line,text-decoration-style,text-decoration-thickness,text-emphasis,text-emphasis-color,text-emphasis-position,text-emphasis-style,text-shadow,text-transform,text-underline-position'
var prefix = 'offset';  					var maxWords= 5;		;; wordList == 'offset,offset-x,offset-y'
var prefix = 'max';  						var maxWords= 6;		;; wordList == 'max,max-height,max-width,maximum'
var prefix = 'pre';  						var maxWords= 7;		;; wordList == 'present,prevent,pre,pre-wrap,pre-line'

	