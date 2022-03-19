const fs = require('fs');
const node = require('./node');

module.exports = class file {
    constructor(pFilename) {
        this.filename = pFilename;
        this.fileHandle = fs.openSync(this.filename, 'rs');
        this.buffer = this.readFilePartially(0, 4 + ((4 + 8) * 4)); // Read 52 first bits.

        const [p, k, g, four] = this.buffer;
        if (p != 0x50 || k != 0x4B || g != 0x47 || four != 0x34) // PKG4
            throw 'Unsupported Format.';

        this.header = {};
        let offset = 4;
        ['node_count', 'node_offset', 'string_count', 'string_offset', 'bitmap_count', 'bitmap_offset', 'audio_count', 'audio_offset'].forEach((key, i) => {
            this.header[key] = ((i % 2) === 0) ? this.buffer.readUInt32LE(offset) : this.getInt64(offset);
            offset += ((i % 2) === 0) ? 4 : 8;
        });

        this.mainNode = new node(this, 0);
    }

    close() {
        fs.closeSync(this.fileHandle);
    }
    readFilePartially(pStart, pLength) {
        if (typeof pStart === 'bigint') pStart = Number(pStart);
        if (typeof pLength === 'bigint') pLength = Number(pLength);

        const buf = Buffer.alloc(pLength).fill(0); // Accept negative value.
        if (pLength == 0) return buf;
        fs.readSync(this.fileHandle, buf, 0, pLength, pStart);
        return buf;
    }

    getOffset(pFrom, pIndex) {
        return this.getInt64(pFrom + (pIndex * 8));
    }

    getInt64(pFrom) {
        let buffer = this.readFilePartially(pFrom, 8);
        return Number(buffer.readBigUInt64LE(0));
    }

    string_count() {
        return this.header.string_count;
    }
    bitmap_count() {
        return this.header.bitmap_count;
    }
    audio_count() {
        return this.header.audio_count;
    }
    node_count() {
        return this.header.node_count;
    }
    get_string(pIndex) {
        const offset = this.getOffset(this.header.string_offset, pIndex);
        let buffer = this.readFilePartially(offset, 2);
        const length = buffer.readUInt16LE(0);

        buffer = this.readFilePartially(offset + 2, length);

        return buffer.toString();
    }

    GetNodeName(pIndex) {
        const nodeOffset = this.header.node_offset + (pIndex * 20);
        const buffer = this.readFilePartially(nodeOffset, 4);
        return this.get_string(buffer.readUInt32LE(0));
    }

    // node object functions
    GetName() {
        return this.filename;
    }

    Child(pName) {
        return this.mainNode.Child(pName);
    }

    ChildById(pId) {
        return this.mainNode.ChildById(pId);
    }

    ForEach(pCallback) {
        return this.mainNode.ForEach(pCallback);
    }

    GetPath(pPath) {
        return this.mainNode.GetPath(pPath);
    }
};