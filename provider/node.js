module.exports = class node {
	constructor(pFile, pIndex) {
		this.file = pFile;
		this.nameIdMap = {}; // name-id map
		this.children = null;

		if (arguments.length == 2) {
			const nodeOffset = pFile.header.node_offset + (pIndex * 20);
			const buffer = pFile.readFilePartially(nodeOffset, 20);
			this.InitFromBuffer(buffer, 0);
		}
	}

	InitFromBuffer(pBuffer, pOffset) {
		this.name_id = pBuffer.readUInt32LE(pOffset);
		pOffset += 4;
		this.first_child_id = pBuffer.readUInt32LE(pOffset);
		pOffset += 4;
		this.child_count = pBuffer.readUInt16LE(pOffset);
		pOffset += 2;
		this.type = pBuffer.readUInt16LE(pOffset);
		pOffset += 2;


		const buffer = pBuffer.slice(pOffset, pOffset + 8);
		switch (this.type) {
			case 0:
				break;
			case 1: // Int64
				this.data = buffer.readInt32LE(0); // Should be BigInt 64
				break;
			case 2: // Double
				this.data = buffer.readDoubleLE(0);
				break;
			case 3: // StringID
				this.data = buffer.readUInt32LE(0);
				break;
			case 4: // VectorInt32
				this.data = [buffer.readUInt32LE(0), buffer.readUInt32LE(4)];
				break;
			case 5: // Bitmap
				this.data = [buffer.readUInt32LE(0), buffer.readUInt16LE(4), buffer.readUInt16LE(6)];
				break;
			case 6: // Audio
				this.data = [buffer.readUInt32LE(0), buffer.readUInt32LE(4)];
				break;
			default:
				throw 'Unknown node type.';
		}
	}

	InitializeChildren() {
		if (this.child_count == 0 || this.children !== null) return;

		const buffer = this.file.readFilePartially(this.file.header.node_offset + (this.first_child_id * 20), this.child_count * 20);

		this.children = [];
		for (let i = 0; i < this.child_count; i++) {
			let subn = new node(this.file);
			subn.InitFromBuffer(buffer, i * 20);
			let name = this.file.get_string(subn.name_id);

			this.nameIdMap[name] = i;
			this.children.push(subn);
		}
	}

	GetName() {
		return this.file.get_string(this.name_id);
	}

	ChildById(pId) {
		if (pId < 0 || pId >= this.child_count) return null;
		this.InitializeChildren(); // Lazy Load

		return this.children[pId];
	}

	Child(pName) {
		this.InitializeChildren(); // Lazy Load

		if (this.children !== null && this.nameIdMap.hasOwnProperty(pName)) {
			return this.children[this.nameIdMap[pName]];
		}
		return null;
	}

	ForEach(pCallback) {
		for (let i = 0; i < this.child_count; i++) {
			let returnCode = pCallback(this.ChildById(i));
			if (returnCode === false) break;
		}
	}


	GetData() {
		if (this.type == 3) {
			return this.file.get_string(this.data);
		}
		return this.data;
	}

	GetPath(pPath) {
		// Searches for the specified path. For example, 'Tips.img/all/0' will go into Tips.img first, then all, then 0
		// Returns null if any of the nodes were not found
		const elements = pPath.split('/');
		let currentNode = this;

		for (let i = 0; i < elements.length; i++) {
			let nextNode = currentNode.Child(elements[i]);
			if (nextNode === null) return null;

			currentNode = nextNode;
		}

		return currentNode;
	}
};