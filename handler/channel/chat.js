const MapleCommandsProccesor = require('../../client/MapleCommands');
packetHandler.setHandler(0x0031, function (client, reader) {
	if (!client.getPlayer()) {
		client.disconnect('Trying to chat while not loaded.');
		return;
	}

	const text = reader.readString();
	const shouting = reader.readUInt8() !== 0;

	if (text.startsWith("@")) {
		new MapleCommandsProccesor(client, text);
		return;
	}

	let packet = new PacketWriter(0x00A2);
	packet.writeUInt32(client.getPlayer().id);
	packet.writeUInt8(0); // is admin?
	packet.writeString(text);
	packet.writeUInt8(shouting);
	getMap(client.getPlayer().mapId).broadcastPacket(packet);
});