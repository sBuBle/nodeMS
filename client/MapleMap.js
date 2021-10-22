let maps = new Map();

global.getMap = (MapID) => {
    const MapCategory = Math.floor(Number(MapID) / 100000000);
    const fullMapID = MapID.toString().padStart(9, 0);
    let Map = DataFiles.map.GetPath(`Map/Map${MapCategory}/${fullMapID}.img`);
    if (Map === null) return null;
    if (!maps.has(MapID)) {
        maps.set(MapID, new MapleMap(Map));
    }
    return maps.get(MapID);
}

function findStringNXMapNode(mapid) {
    let node = null;
    DataFiles.string.GetPath('Map.img').ForEach((CityMap) => {
        CityMap.ForEach((MapID) => {
            if (mapid == MapID.GetName()) {
                node = MapID;
                return false;
            }
        })
        if (node !== null) return false;
    })
    return node;
}

const MapleMap = class MapleMap {
    constructor(MapData) {
        this.id = Number(MapData.GetName().split(".img")[0]);
        this.clients = new Map();

        // Street name of Map.
        this.fieldName = findStringNXMapNode(this.id).Child('mapName') ?? '';
        this.fieldStreetName = findStringNXMapNode(this.id).Child('streetName') ?? '';


        const infoBlock = MapData.Child('info');

        this.fieldType = infoBlock.Child('fieldType')?.GetData() ?? 0;
        this.returnMap = infoBlock.Child('returnMap')?.GetData() ?? 999999999;
        this.forcedReturn = infoBlock.Child('forcedReturn')?.GetData() ?? 999999999;
        this.mobRate = infoBlock.Child('mobRate')?.GetData() ?? 0;
        this.onFirstUserEnter = infoBlock.Child('onFirstUserEnter')?.GetData() ?? '';
        this.onUserEnter = infoBlock.Child('onUserEnter')?.GetData() ?? '';
        this.lvLimit = infoBlock.Child('lvLimit')?.GetData() ?? 0;
        this.lvForceMove = infoBlock.Child('lvLimit')?.GetData() ?? 10000;
        this.dropsExpire = !!(infoBlock.Child('everlast'))?.GetData() === 0;
        const portals = new Map();
        this.portals = (() => {
            if(portals.size > 0) return portals;
            MapData.Child('portal').ForEach((Portal) => {
                const PortalID = Number(Portal.GetName());
                if (!portals.has(PortalID))
                    portals.set(PortalID, {
                        id: PortalID,
                        name: Portal.Child('pn')?.GetData() ?? '',
                        type: Portal.Child('pt')?.GetData() ?? '',
                        toMap: Portal.Child('tm')?.GetData() ?? '',
                        toName: Portal.Child('tn')?.GetData() ?? '',
                        script: Portal.Child('script')?.GetData()?? '',
                        x: Portal.Child('x')?.GetData() ?? 0,
                        y: Portal.Child('y')?.GetData() ?? 0
                    });
            });
            return portals;
        })();
        this.playableMapArea = null;
        this.bounds = null;
        this.lifePool = new (require('./MapleMapLife'))(this, MapData);
    }

    broadcastPacket(packet, skipClient) {
        this.clients.forEach((client) => {
            if (client === skipClient) return;
            client.getSocket().sendPacket(packet);
        });
    }

    isMapExist(MapID){
        const MapCategory = Math.floor(Number(MapID) / 100000000);
        const fullMapID = MapID.toString().padStart(9, 0);
        return DataFiles.map.GetPath(`Map/Map${MapCategory}/${fullMapID}.img`) !== null;
    }

    addPlayer(client) {
        if (!this.clients.has(client.getSocket()))
            this.clients.set(client.getSocket(), client);

        // Broadcast the user entering
        this.broadcastPacket(this.getEnterMapPacket(client), client);

        // Show other characters for player
        this.clients.forEach((loopClient) => client.getSocket().sendPacket(this.getEnterMapPacket(loopClient)));

        this.lifePool.sendSpawnData(client)
    }

    removePlayer(client, reAdd = true) {
        this.clients.delete(client.getSocket());
        if(reAdd) this.broadcastPacket(this.getLeaveMapPacket(client), client);
    }

    getPortalByName(portalName) {
        for(const portal of this.portals.values()){
            if(portal.name === portalName) return portal;
        }
        return null;
    }

    changeMap(client, map) {
        if(!this.isMapExist(map)) return;

        this.removePlayer(client);
        client.character.mapId = map;

        let packet = new PacketWriter(0x007D);
        packet.writeUInt32(client.character.id); // character id;
        packet.writeUInt32(0); // portal count
        packet.writeUInt8(0); // idk

        packet.writeUInt32(map); // map id?
        packet.writeUInt8(0); // spawn point
        packet.writeUInt16(client.character.stats.hp); // character hp
        packet.writeUInt8(0);
        packet.writeDate(new Date()); // Current time

        client.getSocket().sendPacket(packet);
        getMap(map).addPlayer(client);
    }

    getLeaveMapPacket(client) {
        const packet = new PacketWriter(0x00A1);
        packet.writeUInt32(client.character.id);
        return packet;
    }

    getEnterMapPacket(client) {
        const packet = new PacketWriter(0x00A0);

        {
            /**
             * [Character info - 40 bits + string]
             *  Int (32 bits) - Character account id.
             *  Byte (8 Bits) - Character current level.
             *  String (depend on text length) - Character name.
             */
            packet.writeUInt32(client.character.id);
            packet.writeUInt8(client.character.stats.level);
            packet.writeString(client.character.name);
        }

        {
            /**
             *  [Guild info -  String + 48 bits]
             *   String (depend on text length) - Guild name.
             *   Short (16 bits) - Guild logo background type
             *   Byte (8 Bits) - Guild logo background color
             *   Short (16 bits) - Guild logo symbul type
             *   Byte (8 Bits) - Guild logo symbul color
             */
            packet.writeString('');
            packet.writeUInt16(0);
            packet.writeUInt8(0);
            packet.writeUInt16(0);
            packet.writeUInt8(0);

        }

        {
            /**
             * WTF is that, copied from moopleDEV...
             */
            packet.writeUInt32(0);
            packet.writeUInt16(0); //v83
            packet.writeUInt8(0xFC);
            packet.writeUInt8(1);
            packet.writeUInt32(0); // buff value
            const buffmask = 0;
            packet.writeUInt32(((buffmask >> 32) & 0xffffffff));
            packet.writeUInt32((buffmask & 0xffffffff));

            const {
                randomBytes
            } = require('crypto');
            const CHAR_MAGIC_SPAWN = Math.floor(Math.random() * (32767 - 1) + 1);
            packet.writeBytes(randomBytes(6));
            packet.writeUInt32(CHAR_MAGIC_SPAWN);
            packet.writeBytes(randomBytes(11));
            packet.writeUInt32(CHAR_MAGIC_SPAWN);
            packet.writeBytes(randomBytes(11));
            packet.writeUInt32(CHAR_MAGIC_SPAWN);
            packet.writeUInt16(0);
            packet.writeUInt8(0);
            packet.writeUInt64(0); // monster riding
            packet.writeUInt32(CHAR_MAGIC_SPAWN);
            packet.writeBytes(randomBytes(9));
            packet.writeUInt32(CHAR_MAGIC_SPAWN);
            packet.writeUInt16(0);
            packet.writeUInt32(0); // actually not 0, why is it 0 then?
            packet.writeBytes(randomBytes(10));
            packet.writeUInt32(CHAR_MAGIC_SPAWN);
            packet.writeBytes(randomBytes(13));
            packet.writeUInt32(CHAR_MAGIC_SPAWN);
            packet.writeUInt16(0);
            packet.writeUInt8(0);
        }

        {
            /**
             * Character job/location/effects/chair 
             *  Short (16 bits) - Character job id
             *  addAvater - avatar data info lol..
             *  Int (32 bits) - Choco count: the amount of valentine boxes in its inventory (5110000)
             *  Int (32 bits) - Active item ID
             *  Int (32 bits) - Active chair ID
             *  Short (16 bits) - Character x position 
             *  Short (16 bits) - Character y position 
             *  Byte (8 bits) - Character stance
             *  Short (16 bits) - Character foothold
             *  Byte (8 bits) - Probably admin flag: GradeCode & 1. Doesn't seem to do anything, tho
             */
            packet.writeUInt16(client.character.stats.job);
            client.getPlayer().addAvatar(packet);
            packet.writeUInt32(0);
            packet.writeUInt32(0);
            packet.writeUInt32(0);
            packet.writeInt16(client.character.location.x);
            packet.writeInt16(client.character.location.y);
            packet.writeInt8(client.character.location.stance);
            packet.writeInt16(client.character.location.foothold);
            packet.writeUInt8(0);

        }

        {
            /**
             * Character pets
             */
            if (false) {
                for (i = 0; i < 3; i++) {
                    packet.writeUInt8(1);
                    packet.writeUInt32(0); // Pet Item ID
                    packet.writeString(''); // Pet name
                    packet.writeUInt64(0); // Pet Cash ID
                    packet.writeUInt16(0); // X
                    packet.writeUInt16(0); // Y
                    packet.writeUInt16(0); // Stance
                    packet.writeUInt16(0); // Foothold
                    packet.writeUInt8(0); // Name tag
                    packet.writeUInt8(0); // Quote item
                }
            }
            packet.writeUInt8(0); // unavailable
        }

        {
            /**
             * Character mount
             */
            packet.writeUInt32(0); // Taming mob level
            packet.writeUInt32(0); // Taming mob EXP
            packet.writeUInt32(0); // Taming mob Fatigue
        }



        {
            /**
             * Mini room and player shop
             */
            if (false) {
                packet.writeUInt32(0);
                packet.writeString('');
                packet.writeUInt8(0);
                packet.writeUInt8(0);
                packet.writeUInt8(0);
                packet.writeUInt8(0);
                packet.writeUInt8(0);
            }
            packet.writeUInt8(0); // unavailable
        }

        {
            /**
             * Chalkboard
             */
            if (false) {
                packet.writeString('');
            }
            packet.writeUInt8(0); // unavailable
        }

        {
            /**
             * Character rings 
             */
            if (false) {
                // Couple ring
                packet.writeUInt64(0);
                packet.writeUInt64(0);
                packet.writeUInt32(0);
            }
            packet.writeUInt8(0); // unavailable

            if (false) {
                // Friend ring
                packet.writeUInt64(0);
                packet.writeUInt64(0);
                packet.writeUInt32(0);
            }
            packet.writeUInt8(0); // unavailable

            if (false) {
                // Marriage ring
                packet.writeUInt32(0);
                packet.writeUInt32(0);
                packet.writeUInt32(0);
            }
            packet.writeUInt8(0); // unavailable

            if (false) {
                var amount = 0;
                
                packet.writeUInt32(amount);
                for (i = 0; i < amount; i++) {
                    packet.writeUInt32(0); // OnNewYearRecordAdd ?
                }
            }
            packet.writeUInt8(0); // unavailable
        }

        packet.writeUInt8(0) // Beserk?
        packet.writeUInt8(0); // get team?
        return packet;
    }

    dropItemFromMapObject(drop, dropfrom, dropto, mod){
        const packet = new PacketWriter(0x10C);
        packet.writeInt8(mod);
        packet.writeInt32(0); // object id.
        packet.writeInt8(drop.getMeso() > 0); // 1 mesos, 0 item, 2 and above all item meso bag,
        packet.writeInt32(drop.getItemId()); // drop object ID
        packet.writeInt32(drop.getOwner()); // owner charid/partyid :)
        packet.writeInt8(drop.getDropType()); // 0 = timeout for non-owner, 1 = timeout for non-owner's party, 2 = FFA, 3 = explosive/FFA
        packet.writeInt16(dropfrom.x); // y
        packet.writeInt16(dropfrom.y); // x
        packet.writeInt32(drop.getDropType() == 0 ? drop.getOwner() : 0); //test

        if (mod != 2) {
            packet.writeInt16(dropto.x); // x
            packet.writeInt16(dropto.y); // y
            packet.writeInt16(0); //Foothold??
        }
        if (drop.getMeso() == 0) {
            //addExpirationTime(packet, drop.getItem().getExpiration());
        }
        packet.writeInt8(drop.isPlayerDrop() ? 0 : 1); //pet EQP pickup
        return packet;
    }
}