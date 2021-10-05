function checkNameValidity(name) {
	let forbidden = false;
	if (name.length >= 4 && name.length <= 12)
		DataFiles.etc.Child('ForbiddenName.img').ForEach(nName => {
			if (name.indexOf(nName.GetData()) !== -1) {
				forbidden = true;
				return;
			}
		});
	return forbidden;
}

function checkItemValidity(job, female, element, objectId) {
	let infoName = '';
	switch (job) {
		case 0:
			infoName = 'Info/Char';
			break; // Adventurer
		case 1000:
			infoName = 'PremiumChar';
			break; // Cygnus
		case 2000:
			infoName = 'OrientChar';
			break; // Aran
	}
	infoName += (female ? 'Female' : 'Male') + `/${element}`;

	let valid = false;
	DataFiles.etc.GetPath(`MakeCharInfo.img/${infoName}`).ForEach(node => {
		if (objectId === node.GetData()) {
			valid = true;
			return;
		}
	});
	return valid;
}

packetHandler.setHandler(0x0015, function (client, reader) {
	// Check character name
	const name = reader.readString();
	const taken = checkNameValidity(name);

	const packet = new PacketWriter(0x000D);
	packet.writeString(name);
	packet.writeUInt8(taken); // Taken bool
	client.getSocket().sendPacket(packet);
});

packetHandler.setHandler(0x0016, function (client, reader) {
	// Create character
	const name = reader.readString();
	const type = reader.readUInt32();
	let startJob = 0,
		startMap = 0;

	if (type === 0) {
		// Cygnus: Noblesse
		startJob = 1000;
		startMap = 130030000;
	} else if (type === 2) {
		// Aran: Legend
		startJob = 2000;
		startMap = 914000000;
	}

	const eyes = reader.readUInt32();
	const hair = reader.readUInt32();
	const hairColor = reader.readUInt32();
	const skin = reader.readUInt32();
	const top = reader.readUInt32();
	const bottom = reader.readUInt32();
	const shoes = reader.readUInt32();
	const weapon = reader.readUInt32();
	const gender = reader.readUInt8() == 1;

	// insert character to database
	const character = new(require('../../client/MapleCharacter'))();
	character.name = name;
	character.hair = hair + hairColor;
	character.eyes = eyes;
	character.gender = gender;
	character.stats.job = startJob;
	character.mapId = startMap;

	// Add items to character
	const MapleInventory = new(require('../../client/MapleInventory'));
	const equipeInventory = character.getInventory(MapleInventory.getByType(MapleInventory.getInventoryTypeList().EQUIP));

	equipeInventory.addItem(top, -5);
	equipeInventory.addItem(bottom, -6);
	equipeInventory.addItem(shoes, -7);
	equipeInventory.addItem(weapon, -1);


	const packet = new PacketWriter(0x000E);
	packet.writeUInt8(0);
	character.addStats(packet);
	character.addAvatar(packet);
	packet.writeUInt8(0); // ?
	packet.writeUInt8(false); // No rankings

	client.getSocket().sendPacket(packet);
	client.saveCharacters(character);
});