packetHandler.setHandler(0x0005, async function (client, reader) { // CHARLIST_REQUEST
    //if (reader.readUInt8() !== 2) return;
    reader.readUInt8()
    client.setWorld(reader.readUInt8());
    client.setChannel(reader.readUInt8());
    const isGM = false;
    const viewingAll = false;
    const characters =  await client.getCharactersFromDB();
    
    const packet = new PacketWriter(0x000B);
    if (client.getChannel() > config.CHANNELS_TO_LOAD || client.getChannel() < 0 || isNaN(client.getWorld())) {
        packet.writeUInt8(8);
        client.getSocket().sendPacket(packet);
        return;
    }

    packet.writeUInt8(0);
    packet.writeUInt8(characters.length); // character count

    for (let i = 0; i < characters.length; i++) { // character count
        const character = characters[i];
        character.addStats(packet);
        character.addAvatar(packet);

        if (!viewingAll) {
            packet.writeUInt8(0); // Something with the delete character confirmation?
        }

        if(isGM){
            packet.writeUInt8(0);
        }

        packet.writeUInt8(Number(config.WORLD_RANKING));
        if (config.WORLD_RANKING) {
            packet.writeUInt32(0); // world rank
            packet.writeUInt32(0); // move (negative is downwards)
            packet.writeUInt32(0); // job rank
            packet.writeUInt32(0); // move (negative is downwards)

        }
    }

    packet.writeUInt8(Number(!config.ENABLE_PIC)); // PIC registered
    packet.writeUInt32(client.info.characterslots); // Max Characters
    client.getSocket().sendPacket(packet);
});