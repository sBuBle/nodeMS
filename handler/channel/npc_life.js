packetHandler.setHandler(0x00C5, function (client, reader) {
    const length = reader.buffer.length - reader.offset;
    const packet = new PacketWriter(0x00104);
    if (length == 6) { // NPC Talk
        packet.writeUInt32(reader.readUInt32());
        packet.writeUInt16(reader.readUInt16());
    } else if (length > 6) { // NPC Move
        let bytes = [];
        for (let i = 0; i < length - 9; i++)
            bytes[i] = reader.readUInt8();
        packet.writeBytes(bytes);
    }
    client.getSocket().sendPacket(packet);
});
