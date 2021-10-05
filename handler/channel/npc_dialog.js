const NPCScriptManager = new (require('../../scripts/NPCScriptManager'))();

packetHandler.setHandler(0x003A, function (client, reader) {
    const objectid = reader.readUInt32(); // npc object id
    const curretMap = getMap(client.getPlayer().mapId);
    const mapNPC = curretMap.lifePool.getMapObject(objectid, 'n');

    NPCScriptManager.start(client, mapNPC[1].id, null, null);
});

packetHandler.setHandler(0x003C, function (client, reader) {
    const lastMsg = reader.readInt8(); // 00 (last msg type I think)
    const action = reader.readInt8(); // 00 = end chat, 01 == follow

    const bufferBytes = reader.buffer.length - reader.offset;
    let selection = -1;

    if (bufferBytes >= 4) {
        selection = reader.readInt32();
    } else if (bufferBytes > 0) {
        selection = reader.readInt8();
    }

    NPCScriptManager.action(client, action, lastMsg, selection);
});
