packetHandler.setHandler(0x0033, function (client, reader) {
    const emote = reader.readInt16();
    if (emote > 7) { // Special emote.
        const emoteid = 5159992 + emote; 
    }

	const packet = new PacketWriter(0x00C1);
    packet.writeInt32(client.getPlayer().id);
    packet.writeInt32(emote);
    getMap(client.getPlayer().mapId).broadcastPacket(packet);
});