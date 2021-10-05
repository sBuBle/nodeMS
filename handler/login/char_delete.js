packetHandler.setHandler(0x0017, function (client, reader) {
	// Deleting character

	const pic = reader.readString();
	const id = reader.readUInt32();
    const isDeleted = !client.deleteCharacter(id);

	const packet = new PacketWriter(0x000F);
	packet.writeUInt32(id);
	packet.writeUInt8(isDeleted);
	client.getSocket().sendPacket(packet);
});