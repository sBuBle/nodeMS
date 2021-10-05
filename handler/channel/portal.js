packetHandler.setHandler(0x0064, function (client, reader) {
	// Enter scripted portal
	reader.readInt8();
	const portalName = reader.readString();
	reader.readInt16();

	const portalData = getMap(client.getPlayer().getCurrentMapID()).getPortalByName(portalName);
	if(typeof portalData === null) return;
	const PortalScriptManager = new (require('../../scripts/PortalScriptManager'));
	PortalScriptManager.executePortalScript(client, portalData);
});

packetHandler.setHandler(0x0026, function (client, reader) {
	// Enter regular portal
	
	const portals = reader.readUInt8();
	const map = getMap(client.getPlayer().getCurrentMapID());
	const opcode = reader.readInt32();


	switch (opcode) {
		case 0:
			// Dead
			return;
		case -1:
			// Entering portal
			const portalName = reader.readString();
			const x = reader.readInt16();
			const y = reader.readInt16();
			const portal = map.getPortalByName(portalName)
			const newMap = getMap(portal.toMap);

			if (newMap === null) {
				const message = client.getPlayer().dropMessage(0, 0, `[portal] Unhandled portal id ${portal}`);
				client.getSocket().sendPacket(message);		
			}else {
				//const portalTo = newMap.getPortalByName(portal.toName);
				client.getPlayer().location.x = x;
				client.getPlayer().location.y = y;
				map.changeMap(client, portal.toMap);
			}
			return;
	}
});