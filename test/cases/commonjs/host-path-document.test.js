//=============================================================================
// File:         ternwords/test/cases/host-path-document.test.js
// Language:     Bequiesce
// Copyright:    Joe Honton © 2020
// License:      CC-BY-NC-ND 4.0
// Initial date: July 25, 2020
//=============================================================================

// @common
var FileInterface = require('../../../dbg/file-interface.class.js');
var TernWords = require('../../../dbg/tern-words.class.js');

var fileInterface = new FileInterface();
var ternWords = new TernWords();
fileInterface.readSiteWords('../test/fixtures/input/style-ternary', ternWords);


//@using host
var host = ternWords.listOfHosts.get(hostIndex);

//@testing host
var hostIndex = 0; 					;; host == 'https://bluephrase.com'


//@using path
var path = ternWords.listOfPaths.get(pathIndex);

//@testing path
var pathIndex = 0; 					;; path == 'style/character'
var pathIndex = 1; 					;; path == 'style'
var pathIndex = 2; 					;; path == 'style/sizing'


//@using documentRef
var documentRef = ternWords.documentRefs[documentIndex];
var hostIndex = documentRef.hostIndex;
var pathIndex = documentRef.pathIndex;
var document = documentRef.document;

//@testing documentRef
var documentIndex = 0; 				;; hostIndex === 0 && pathIndex === 0 && document == 'letter-spacing.blue';
var documentIndex = 19;				;; hostIndex === 0 && pathIndex === 1 && document == 'character.blue';
var documentIndex = 20;				;; hostIndex === 0 && pathIndex === 2 && document == 'height.blue';


//@using url
var documentRef = ternWords.documentRefs[documentIndex];
var hostIndex = documentRef.hostIndex;
var pathIndex = documentRef.pathIndex;
var document = documentRef.document;
var host = documentRef.host;
var path = documentRef.path;
var url = documentRef.url;

//@testing url
var documentIndex = 0; 				;; host == 'https://bluephrase.com' && path == 'style/character' 	&& url == 'https://bluephrase.com/style/character/letter-spacing.blue';
var documentIndex = 19;				;; host == 'https://bluephrase.com' && path == 'style'				&& url == 'https://bluephrase.com/style/character.blue';
var documentIndex = 20;				;; host == 'https://bluephrase.com' && path == 'style/sizing'		&& url == 'https://bluephrase.com/style/sizing/height.blue';
