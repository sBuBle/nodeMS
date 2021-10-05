function getLengthFromHeader(data) {
    let length = data[0] | data[1] << 8 | data[2] << 16 | data[3] << 24;
    return ((length >>> 16) ^ (length & 0xFFFF)) & 0xFFFF;
};

module.exports = class MaplePacket {
    constructor() {
        this._blockLength = 4;
        this._buffer = Buffer.alloc(0);
        this._packet = Buffer.alloc(0);
        this._header = true;
    }

    push(receivedData) {
        this._buffer = Buffer.concat([this._buffer, receivedData]);
    }

    getPacket() {
        this.handleData();
        return this._packet;
    }

    isVaildHeader() {
        return this._blockLength <= this._buffer.length;
    }

    isHeader() {
        return this._header;
    }

    handleData() {
        const receivedData = this._buffer;
        this._packet = Buffer.alloc(this._blockLength);
        receivedData.copy(this._packet, 0, 0, this._packet.length);
        this._buffer = Buffer.alloc(receivedData.length - this._packet.length);
        receivedData.copy(this._buffer, 0, this._packet.length);
        this._blockLength = this.isHeader() ? getLengthFromHeader(this._packet) : 4;
        this._header = !this._header;
    }
};