function EnterChannel(client, pCharacterId) {
    const world = client.getWorld();
    let localPort = 7575;
    for (const {worldId, port} of avaibleWorlds.values()) {
        if (world === worldId) {
            localPort = port;
            break;
        }
    }

    // Remote-hack vulnerable
    const packet = new PacketWriter(0x000C);
    packet.writeUInt16(0);
    packet.writeBytes([127, 0, 0, 1]);
    packet.writeUInt16(localPort);
    packet.writeUInt32(pCharacterId);
    packet.writeUInt8(0); // Flag bit 1 set = korean popup?
    packet.writeUInt32(0); // Minutes left on Internet Cafe?
    client.getSocket().sendPacket(packet);
}

packetHandler.setHandler(0x0013, function (client, reader) {
    // Select character

    const characterId = reader.readUInt32();
    const macAddr = reader.readString();
    const macAddrNoDashes = reader.readString();
    EnterChannel(client, characterId);
});


packetHandler.setHandler(0x001E, function (client, reader) {
    // Select character using PIC

    const pic = reader.readString();
    const characterId = reader.readUInt32();
    const macAddr = reader.readString();
    const macAddrNoDashes = reader.readString();
    EnterChannel(client, characterId);
});