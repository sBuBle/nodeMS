function expandIfNeeded(size) {
    if (this.writtenData + size > this.buffer.length) {
        let oldBuffer = this.buffer;
        let newSize = this.buffer.length;

        while (newSize < (this.writtenData + size)) newSize *= 2;

        this.buffer = Buffer.alloc(~~newSize);
        oldBuffer.copy(this.buffer);
    }
}

module.exports = class PacketWriter {
    constructor(opCode) {
        this.buffer = Buffer.alloc(32);
        this.writtenData = 0;

        if (arguments.length > 0) {
            this.writeUInt16(opCode);
        }
    }

    writeInt8(value) {
        expandIfNeeded.call(this, 1);
        this.buffer.writeInt8(value, this.writtenData, true);
        this.writtenData += 1;
        return this;
    }

    writeInt16(value) {
        expandIfNeeded.call(this, 2);
        this.buffer.writeInt16LE(value, this.writtenData, true);
        this.writtenData += 2;
        return this;
    }

    writeInt32(value) {
        expandIfNeeded.call(this, 4);
        this.buffer.writeInt32LE(value, this.writtenData, true);
        this.writtenData += 4;
        return this;
    }

    writeUInt8(value) {
        expandIfNeeded.call(this, 1);
        this.buffer.writeUInt8(value, this.writtenData, true);
        this.writtenData += 1;
        return this;
    }

    writeUInt16(value) {
        expandIfNeeded.call(this, 2);
        this.buffer.writeUInt16LE(value, this.writtenData, true);
        this.writtenData += 2;
        return this;
    }

    writeUInt32(value) {
        expandIfNeeded.call(this, 4);
        this.buffer.writeUInt32LE(value, this.writtenData, true);
        this.writtenData += 4;
        return this;
    }

    writeFloat32(value) {
        expandIfNeeded.call(this, 4);
        this.buffer.writeFloatLE(value, this.writtenData, true);
        this.writtenData += 4;
        return this;
    }

    writeFloat64(value) {
        expandIfNeeded.call(this, 8);
        this.buffer.writeDoubleLE(value, this.writtenData, true);
        this.writtenData += 8;
        return this;
    }

    writeUInt64(value) {
        if (isNaN(value) || value === null) value = 0;
        expandIfNeeded.call(this, 8);
        this.buffer.writeBigUInt64LE(BigInt(value), this.writtenData, true);
        this.writtenData += 8;
        return this;
    }

    writeDate(pDate) {
        if (!(pDate instanceof Date)) return null;
        let rawTime = pDate.getTime();
        rawTime += 11644473600000; // Seconds between 1601-01-01 00:00:00 and 1970-01-01 00:00:00
        rawTime *= 10000; // Convert to nanoseconds
        this.writeUInt64(rawTime);
        return this;
    }

    writeString(value, length) {
        if (value === null || typeof value === 'undefined')
            value = '';
        if (arguments.length == 1) {
            this.writeUInt16(value.length);

            expandIfNeeded.call(this, value.length);
            this.buffer.write(value, this.writtenData, value.length);
            this.writtenData += value.length;
        } else {
            expandIfNeeded.call(this, length);

            this.buffer.fill(0, this.writtenData, this.writtenData + length);
            this.buffer.write(value, this.writtenData, value.length);

            this.writtenData += length;
        }
        return this;
    }

    writeBytes(value) {
        for (let i = 0; i < value.length; i++) {
            this.writeUInt8(value[i]);
        }
        return this;
    }

    writeHexString(value) {
        value = value.replace(/[^0-9A-Fa-f]/g, '');
        if ((value.length % 2) !== 0) throw 'HexString is not a valid length. Text: ' + value;

        for (let i = 0; i < value.length; i += 2) {
            this.writeUInt8(parseInt(value.substr(i, 2), 16));
        }
        return this;
    }

    getBufferCopy() {
        const buffer = Buffer.alloc(this.writtenData);
        this.buffer.copy(buffer);
        return buffer;
    }

    // Convert a hex string to a byte array
    hexToBytes(hex) {
        for (var bytes = [], c = 0; c < hex.length; c += 2)
            bytes.push(parseInt(hex.substr(c, 2), 16));
        return bytes;
    }

    // Convert a byte array to a hex string
    bytesToHex(bytes) {
        for (var hex = [], i = 0; i < bytes.length; i++) {
            const current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
            hex.push((current >>> 4).toString(16));
            hex.push((current & 0xF).toString(16));
        }
        return hex.join("");
    }

    skip(pAmount) {
        for (let i = 0; i < pAmount; i++)
            this.writeUInt8(0);
        return this;
    }
}