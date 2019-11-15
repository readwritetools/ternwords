/* Copyright (c) 2019 Joe Honton */
var FS = require('fs'), expect = require('./expect.function.js'), Pfile = require('./pfile.class.js'), CRC32 = require('./crc32.class.js'), BinaryReader = require('./binary-reader.class.js'), BinaryWriter = require('./binary-writer.class.js'), terminal = require('./terminal.namespace.js');

class CentralDirectoryRecord {
    constructor() {
        this.numberOfThisDisk = 0, this.diskWhereCDRStarts = 0, this.numberOfCDRthisDisk = 0, 
        this.totalNumberOfCDR = 0, this.sizeOfCentralDirectory = 0, this.offsetOfStartOfCentralDirectory = 0, 
        this.commentLength = 0, this.comment = null, Object.seal(this);
    }
    writeEnd(e) {
        expect(e, 'BinaryWriter'), e.writeUint32(101010256), e.writeUint16(this.numberOfThisDisk), 
        e.writeUint16(this.diskWhereCDRStarts), e.writeUint16(this.numberOfCDRthisDisk), 
        e.writeUint16(this.totalNumberOfCDR), e.writeUint32(this.sizeOfCentralDirectory), 
        e.writeUint32(this.offsetOfStartOfCentralDirectory), e.writeUint16(this.commentLength);
    }
}

class LocalFileHeader {
    constructor(e, t, i) {
        if (expect(e, [ 'Pfile', 'String' ]), expect(t, [ 'Pfile', 'String' ]), expect(i, 'Number'), 
        'String' == e.constructor.name && (e = new Pfile(e)), 'String' == t.constructor.name && (t = new Pfile(t)), 
        e.exists() && e.isFile()) {
            var r = new CRC32();
            r.computeFileCRC(e), this.crc32Checksum = r.getResult(), this.compressedSize = e.getFileSize(), 
            this.uncompressedSize = this.compressedSize, this.setDateAndTime(e.getModificationTime());
        } else this.crc32Checksum = 0, this.compressedSize = 0, this.uncompressedSize = 0, 
        this.fileModificationTime = 0, this.fileModificationDate = 0;
        '' == t.name ? this.filename = e.getFilename() : this.filename = t.addPath(e.getFilename()).name, 
        this.filenameLength = this.determineFilenameLength(this.filename), this.versionNeeded = 20, 
        this.bitFlags = 2048, this.compressionMethod = 0, this.extraFieldLength = 0, this.extraField = null, 
        this.versionMadeBy = 788, this.fileCommentLength = 0, this.fileComment = null, this.diskNumberStart = 0, 
        this.internalFileAttributes = 1, this.externalFileAttributes = 32, this.relativeOffsetOfLocalHeader = i, 
        this.sizeofLFH = 30 + this.filenameLength, this.sizeofCDR = 46 + this.filenameLength, 
        Object.seal(this);
    }
    determineFilenameLength(e) {
        expect(e, 'String');
        var t = e.length;
        for (let r = e.length - 1; r >= 0; r--) {
            var i = e.charCodeAt(r);
            i > 127 && i <= 2047 ? t++ : i > 2047 && i <= 65535 && (t += 2), i >= 56320 && i <= 57343 && r--;
        }
        return t;
    }
    setDateAndTime(e) {
        expect(e, 'Date');
        var t = Math.floor(e.getSeconds() / 2), i = e.getMinutes() + 1;
        this.fileModificationTime = e.getHours() * Math.pow(2, 11) + i * Math.pow(2, 5) + t;
        var r = e.getFullYear() - 1980, s = e.getMonth() + 1;
        this.fileModificationDate = r * Math.pow(2, 9) + s * Math.pow(2, 5) + e.getDate();
    }
    writeLocalFileHeader(e) {
        expect(e, 'BinaryWriter'), e.writeUint32(67324752), e.writeUint16(this.versionNeeded), 
        e.writeUint16(this.bitFlags), e.writeUint16(this.compressionMethod), e.writeUint16(this.fileModificationTime), 
        e.writeUint16(this.fileModificationDate), e.writeUint32(this.crc32Checksum), e.writeUint32(this.compressedSize), 
        e.writeUint32(this.uncompressedSize), e.writeUint16(this.filenameLength), e.writeUint16(this.extraFieldLength), 
        e.writeText(this.filename);
    }
    writeCentralDirectoryFileHeader(e) {
        expect(e, 'BinaryWriter'), e.writeUint32(33639248), e.writeUint16(this.versionMadeBy), 
        e.writeUint16(this.versionNeeded), e.writeUint16(this.bitFlags), e.writeUint16(this.compressionMethod), 
        e.writeUint16(this.fileModificationTime), e.writeUint16(this.fileModificationDate), 
        e.writeUint32(this.crc32Checksum), e.writeUint32(this.compressedSize), e.writeUint32(this.uncompressedSize), 
        e.writeUint16(this.filenameLength), e.writeUint16(this.extraFieldLength), e.writeUint16(this.fileCommentLength), 
        e.writeUint16(this.diskNumberStart), e.writeUint16(this.internalFileAttributes), 
        e.writeUint32(this.externalFileAttributes), e.writeUint32(this.relativeOffsetOfLocalHeader), 
        e.writeText(this.filename);
    }
}

module.exports = class Zip {
    constructor() {
        this.bw = new BinaryWriter(), this.headers = new Array(), this.bytesWrittenSoFar = 0, 
        this.cdr = new CentralDirectoryRecord();
    }
    create(e) {
        expect(e, [ 'String', 'Pfile' ]), 'String' == e.constructor.name && (e = new Pfile(e)), 
        e.exists() && e.isFile() && FS.unlinkSync(e.name), this.bw.open(e);
    }
    addFile(e, t) {
        if (expect(e, [ 'String', 'Pfile' ]), expect(t, [ 'String', 'Pfile' ]), 'String' == e.constructor.name && (e = new Pfile(e)), 
        'String' == t.constructor.name && (t = new Pfile(t)), e.exists() && e.isFile()) if (e.isDirectory()) terminal.abnormal(`Directories cannot be added to zip archive "${e.name}"`); else try {
            var i = new LocalFileHeader(e, t, this.bytesWrittenSoFar);
            i.writeLocalFileHeader(this.bw), this.headers.push(i);
            var r = new BinaryReader(e);
            for (r.open(e); r.readBlock(); ) this.bw.writeBlock(r.buffer, r.bufferLength);
            r.close(), this.bytesWrittenSoFar += i.sizeofLFH + i.compressedSize, this.cdr.numberOfCDRthisDisk++, 
            this.cdr.totalNumberOfCDR++, this.cdr.offsetOfStartOfCentralDirectory = this.bytesWrittenSoFar, 
            this.cdr.sizeOfCentralDirectory += i.sizeofCDR;
        } catch (e) {
            terminal.abnormal(e.message);
        } else terminal.abnormal(`File does not exist "${e.name}", skipping`);
    }
    close() {
        for (let e = 0; e < this.headers.length; e++) this.headers[e].writeCentralDirectoryFileHeader(this.bw);
        this.cdr.writeEnd(this.bw), this.bw.close();
    }
};