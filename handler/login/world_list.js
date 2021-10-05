const SendOpcode = {
    SERVERSTATUS: 0x0003,
    SERVERLIST: 0x000A,
};

const showWorldspacketHandler = function (client, reader) {
    let packetCollector;
    const defaultFlag = 0; // Display type of flag on world name.
    const charCreateStatus = 0; // Disable creation of character in world (true/false).
    for (const {
            worldId,
            worldName
        } of avaibleWorlds.values()) {
        packetCollector = new PacketWriter(SendOpcode.SERVERLIST);
        packetCollector.writeUInt8(worldId);
        packetCollector.writeString(worldName);
        packetCollector.writeUInt8(defaultFlag);
        packetCollector.writeString(config.EVENTS);
        packetCollector.writeUInt16(100); // EXP Rate
        packetCollector.writeUInt16(100); // DROP Rate
        packetCollector.writeUInt8(charCreateStatus);

        packetCollector.writeUInt8(config.CHANNELS_TO_LOAD);
        for (let i = 1; i <= config.CHANNELS_TO_LOAD; i++) {
            packetCollector.writeString(`${worldName}-${i}`); // (Server Name - Channel ID)
            packetCollector.writeUInt32(((require('os').totalmem / 1024 ** 2) - (require('os').freemem / 1024 ** 2)) / 10 ** i); // Count online players
            packetCollector.writeUInt8(worldId); // World id
            packetCollector.writeUInt16(i - 1); // Channel id 
        }

        const dialogs = []; // idk?
        packetCollector.writeUInt16(dialogs.length);
        for (let j = 0; j < dialogs.length; j++) {
            const dialog = dialogs[j];
            packetCollector.writeUInt16(dialog.x);
            packetCollector.writeUInt16(dialog.y);
            packetCollector.writeString(dialog.text);
        }
        client.getSocket().sendPacket(packetCollector);
    }

    // End of server list.
    packetCollector = new PacketWriter(SendOpcode.SERVERLIST);
    packetCollector.writeUInt8(0xFF);
    client.getSocket().sendPacket(packetCollector);
}
packetHandler.setHandler(0x000B, showWorldspacketHandler); // SERVERLIST_REQUEST
packetHandler.setHandler(0x0004, showWorldspacketHandler); // SERVERLIST_REREQUEST

packetHandler.setHandler(0x0006, function (client, reader) { // SERVERSTATUS_REQUEST
    const packet = new PacketWriter(SendOpcode.SERVERSTATUS);
    /**
     * status: 
     * 0 - Normal
     * 1 - Highly populated
     * 2 - Full
     */
    packet.writeUInt16(0); // Status of the world.
    client.getSocket().sendPacket(packet);
});