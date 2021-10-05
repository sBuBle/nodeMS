module.exports = class PacketReader {
    constructor(data) {
        this.buffer = Buffer.from(data);
        this.offset = 0;
    }

	readInt8(){
		const ret = this.buffer.readInt8(this.offset);
		this.offset += 1;
		return ret;
	}

	readInt16(){
		const ret = this.buffer.readInt16LE(this.offset);
		this.offset += 2;
		return ret;
	}

	readInt32(){
		const ret = this.buffer.readInt32LE(this.offset);
		this.offset += 4;
		return ret;
	}

	readUInt8(){
		const ret = this.buffer.readUInt8(this.offset);
		this.offset += 1;
		return ret;
	}

	readUInt16(){
		const ret = this.buffer.readUInt16LE(this.offset);
		this.offset += 2;
		return ret;
	}

	readUInt32(){
		const ret = this.buffer.readUInt32LE(this.offset);
		this.offset += 4;
		return ret;
	}

	readFloat64(){
		const ret = this.buffer.readFloat64LE(this.offset);
		this.offset += 4;
		return ret;
	}

	readFloat64(){
		const ret = this.buffer.readDoubleLE(this.offset);
		this.offset += 8;
		return ret;
	}

	readString(pLength){
		pLength = pLength || this.readUInt16();
		let ret = '';
		for (; pLength > 0; pLength--) {
			const byte = this.readUInt8();
			if (byte === 0) break;
			ret += String.fromCharCode(byte);
		}
		this.offset += pLength;
		return ret;
	}
	
	skip(pAmount) {
		this.offset += pAmount;
	}
}