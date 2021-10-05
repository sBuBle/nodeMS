const MapleLife = require('../../client/MapleLife');

packetHandler.setHandler(0x0029, function (client, reader) {
    const portal = reader.readUInt8();
    reader.skip(4); // unique value per-map?
    const MovableLife = new MapleLife();

    const movePath = MovableLife.decodeMovePath(reader, false);
    if (movePath.length === 0) {
        //client.disconnect('Empty move path');
        //return;
    }else{
        client.getPlayer().location.x = MovableLife.x;
        client.getPlayer().location.y = MovableLife.y;
        client.getPlayer().location.stance = MovableLife.stance;
        client.getPlayer().location.foothold = MovableLife.foothold;
    }

    const packet = new PacketWriter(0x00B9);
	packet.writeUInt32(client.getPlayer().id);
	MovableLife.encodeMovePath(movePath, packet);
	
	getMap(client.getPlayer().mapId).broadcastPacket(packet, client);
});