//=============================================================================
//
// File:         ternwords/src/text-interface.class.js
// Language:     ECMAScript 2015
// Copyright:    Joe Honton © 2019
// License:      CC-BY-NC-ND 4.0
// Initial date: Nov 13, 2019
// Contents:     Read a SITEWORDS text blob to build a Ternary Search Trie
//
//=============================================================================

var expect = require('./utils/expect.js');
var terminal = require('./utils/terminal.js');
var DocumentRef = require('./document-ref.class.js');
var WeightRef = require('./weight-ref.class.js');

module.exports = class TextInterface {
	
    constructor() {
    	this.currentDocumentRef = null;
		Object.seal(this);
    }
 
    //> textBlob is the full text of a SITEWORDS file
    //> ternWords is the public interface to the library
    //< returns true if successfully read
    //< returns false if a problem occurred
	readSiteWords(textBlob, ternWords) {
		expect(textBlob, 'String');
		expect(ternWords, 'TernWords');
		
		var lines = textBlob.split('\n');
		if (lines.length == 0)
			return false;
		
    	// sanity check
    	var line = lines[0];
    	if (line.indexOf('rwsearch') == -1 || line.indexOf('sitewords') == -1) {
    		terminal.abnormal(`This doesn't look like an RWSEARCH sitewords file. The first line should begin with the signature "!rwsearch 1.0 sitewords". Skipping.`);
    		return false;
    	}
    	
		// add to Ternary Search Trie
		for (let i=1; i < lines.length; i++) {
			var lineNumber = i+1;
			var line = lines[i];

			// remove any Windows CR at end of line
	    	if (line.charCodeAt(line.length-1) == 13)
	    		line = line.substr(0, line.length-1); 
			
			if (line.charAt(0) == '!')
				this.processDocumentRef(lineNumber, line, ternWords);
			else
				this.processWordRef(lineNumber, line, ternWords);
		}
		
		return true;
	}
	
	// Handle these document ref lines:
	// !ho host definition
	// !pa path definition
	// !di documentIndex
	// !ti title
	// !de description
	// !ky keywords
	processDocumentRef(lineNumber, line, ternWords) {
		expect(lineNumber, 'Number');
		expect(line, 'String');
		expect(ternWords, 'TernWords');
		
		var key = line.substr(1,2);
		var value = line.substr(4);
		
		switch(key) {
			// host definition, like 'https://example.com'
			case 'ho':
				var [hostIndex, host] = value.split(' ', 2);
				hostIndex = parseInt(hostIndex);
				ternWords.listOfHosts.set(hostIndex, host);
				return;
				
			// path definition, like '' or 'dir' or 'dir/subdir'
			case 'pa':
				var [pathIndex, path] = value.split(' ', 2);
				pathIndex = parseInt(pathIndex);
				ternWords.listOfPaths.set(pathIndex, path);
				return;

			// document index	
			case 'di':
				var documentIndex = parseInt(value);
				this.currentDocumentRef = new DocumentRef(ternWords, documentIndex);
				ternWords.documentRefs.push(this.currentDocumentRef);
				
				// sanity check: documentRefs[0] will have a documentIndex == 0
				var thisIndex = ternWords.documentRefs.length - 1;
				if (thisIndex != documentIndex) 
					terminal.abnormal(`DocumentIndex on line number ${lineNumber} expected to be ${thisIndex}, not ${documentIndex}`);
				return;
			
			// URL	
			case 'ur':
				var [hostIndex, pathIndex, document] = value.split(' ', 3);		// 0 2 term-mark.blue
				this.currentDocumentRef.hostIndex = parseInt(hostIndex);		// 0
				this.currentDocumentRef.pathIndex = parseInt(pathIndex);		// 2
				this.currentDocumentRef.document = document;					// term-mark.blue
				return;
				
			// lastmod
			case 'dt':
				this.currentDocumentRef.lastmod = value;
				return;
				
				// title	
			case 'ti':
				this.currentDocumentRef.title = value;
				return;
				
			// description	
			case 'de':
				this.currentDocumentRef.description = value;
				return;
				
			// keywords	
			case 'ky':
				this.currentDocumentRef.keywords = value;
				return;
				
			default:
				terminal.abnormal(`Unrecognized document ref on line number ${lineNumber} ${line}`);
				return;
		}
	}
	
	processWordRef(lineNumber, line, ternWords) {
		expect(lineNumber, 'Number');
		expect(line, 'String');
		expect(ternWords, 'TernWords');
						
		if (line == '')												// line == 'letters 14 6;19 2;0 1;15 1;20 1;21 1;23 1'
			return;
		var verticalBar = line.indexOf('|');						// verticalBar == 7				
		if (verticalBar == -1)
			return;
		var word = line.substr(0, verticalBar);						// word == 'letters'
		
		var docsAndWeights = line.substr(verticalBar+1);			// docsAndWeights == '14 6;19 2;0 1;15 1;20 1;21 1;23 1'
		var arr = docsAndWeights.split(';');						// arr.length == 7
		
		var weightRefs = new Array();
		for (let i=0; i < arr.length; i++) {
			var [documentIndex, weight] = arr[i].split(' ');		// arr[0] == '14 6'
			documentIndex = parseInt(documentIndex);				// 14
			weight = parseInt(weight);								// 6
			var weightRef = new WeightRef(documentIndex, weight);
			weightRefs.push(weightRef);
		}
		
		// add to Ternary Search Trie
		ternWords.putWord(word, weightRefs);
	}
}
