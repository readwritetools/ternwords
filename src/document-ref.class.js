//=============================================================================
//
// File:         sitewords/src/document-ref.class.js
// Language:     ECMAScript 2015
// Copyright:    Joe Honton © 2019
// License:      CC-BY-NC-ND 4.0
// Initial date: Oct 21, 2019
// Contents:     All of the meta data known about a single document file
//
//=============================================================================

import expect			from './utils/expect.js';

export default class DocumentRef {
	
    constructor(ternWords, documentIndex) {
    	expect(ternWords, 'TernWords');
    	expect(documentIndex, 'Number');
    	
    	this.ternWords = ternWords;				// provides access to the listOfHosts and listOfPaths
    	this.documentIndex = documentIndex;
		this.hostIndex = -1;					// zero-based index into array of hosts
		this.pathIndex = -1;					// zero-based index into array of paths
		this.document = '';						// document filename
		this.title = '';
		this.description = '';
		this.keywords = '';
		
		Object.seal(this);
    }
 
	writeDocumentRefs(tw) {
		expect(tw, 'TextWriter');
		
		tw.putline(`!di ${this.documentIndex}`);
		tw.putline(`!ur ${this.hostIndex} ${this.pathIndex} ${this.document}`);
		tw.putline(`!ti ${this.title}`);
		tw.putline(`!de ${this.description}`);
		tw.putline(`!ky ${this.keywords}`);
	}    
	
	get host() {
		return this.ternWords.listOfHosts.get(this.hostIndex);
	}
	
	get path() {
		return this.ternWords.listOfPaths.get(this.pathIndex);
	}
	
	//< assembles the host, path and document into a URL
	get url() {
		if (this.path != '')
			return `${this.host}/${this.path}/${this.document}`;
		else
			return `${this.host}/${this.document}`;
	}
}
