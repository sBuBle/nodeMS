module.exports = class MapleMapLife {
    constructor(map, mapData) {
        this.map = map;
        this.mobs = this.lifeFactory(mapData, 'm');
        this.npcs = this.lifeFactory(mapData, 'n');


        this.lastMobSpawn = new Date();
    }

    getMapObject(oid, type = 'm') {
        return Object.entries(type === 'm' ? this.mobs : this.npcs)[oid];
    }

    lifeFactory(mapData, type) {
        let factory = [];
        mapData.Child('life').ForEach((life) => {
            const ntype = life.Child('type').GetData();
            if (ntype !== type || ntype === null) return;
            const info = {
                id: Number(life.Child('id')?.GetData()) ?? 9999999,
                fh: life.Child('fh')?.GetData() ?? -1,
                x: life.Child('x')?.GetData() ?? 0,
                y: life.Child('cy')?.GetData() ?? 0,
                f: life.Child('f')?.GetData() ?? 0,
                fh: life.Child('fh')?.GetData() ?? 0,
                rx0: life.Child('rx0')?.GetData() ?? 0,
                rx1: life.Child('rx1')?.GetData() ?? 0,
                mcTeam: life.Child('team')?.GetData() ?? -1,
                respawnInterval: (life.Child('mobTime')?.GetData() ?? 0) * 1000,
                mobCount: 0,
                respawnTime: 0
            };
            factory.push(info);
        });
        return factory;
    }

    sendSpawnData(client) {
        const npcList = Object.entries(this.npcs);
        const mobList = Object.entries(this.mobs);

        // Spawn map npc
        if (npcList.length > 0) {
            npcList.forEach(([key, value]) => {
                value.objectId = Number(key);
                if (value.id > 9010010 && value.id < 9010014) {
                    client.getSocket().sendPacket(this.spawnNPCRequestController(value, false));
                } else {
                    client.getSocket().sendPacket(this.spawnNPC(value));
                    client.getSocket().sendPacket(this.spawnNPCRequestController(value, true));
                }
            });
        }

        // Spawn map monsters
        if (mobList.length <= 0) return;
        mobList.forEach(([key, value]) => {
            value.objectId = Number(key);
            client.getSocket().sendPacket(this.spawnMonsterInternal(value, true, true, false, 0, false));
        });
    }

    spawnNPC(life) {
        const packet = new PacketWriter(0x101);
        packet.writeInt32(life.objectId);
        packet.writeInt32(life.id);
        packet.writeInt16(life.x);
        packet.writeInt16(life.y); // out of rang error
        if (life.f == 1) {
            packet.writeUInt8(0);
        } else {
            packet.writeUInt8(1);
        }
        packet.writeInt16(life.fh);
        packet.writeInt16(life.rx0);
        packet.writeInt16(life.rx1);
        packet.writeUInt8(1);
        return packet;
    }

    spawnNPCRequestController(life, MiniMap) {
        const packet = new PacketWriter(0x103);
        packet.writeUInt8(1);
        packet.writeInt32(life.objectId);
        packet.writeInt32(life.id);
        packet.writeInt16(life.x);
        packet.writeInt16(life.y);
        if (life.f == 1) {
            packet.writeUInt8(0);
        } else {
            packet.writeUInt8(1);
        }
        packet.writeInt16(life.fh);
        packet.writeInt16(life.rx0);
        packet.writeInt16(life.rx1);
        packet.writeUInt8(MiniMap ? 1 : 0);
        return packet;
    }

    spawnMonsterInternal(life, requestController, newSpawn, aggro, effect, makeInvis) {
        let packet = new PacketWriter(0xEE);
        if (makeInvis) {
            packet.writeUInt8(0);
            packet.writeInt32(life.objectId);
            return packet;
        }
        if (requestController) {
            packet.writeUInt8(aggro ? 2 : 1);
        } else {
            packet = new PacketWriter(0xEC);
        }
        packet.writeInt32(life.objectId);
        packet.writeUInt8(5); // getController
        packet.writeInt32(life.id);
        packet.skip(15);
        packet.writeUInt8(0x88);
        packet.skip(6);
        packet.writeInt16(life.x);
        packet.writeInt16(life.y);
        packet.writeInt8(5); // stance default is 5 (Lmao)
        packet.writeInt16(0); //Origin FH //life.getStartFh()
        packet.writeInt16(life.fh);

        if (effect > 0) {
            packet.writeUInt8(effect);
            packet.writeUInt8(0);
            packet.writeInt16(0);
            if (effect == 15) {
                packet.writeUInt8(0);
            }
        }
        packet.writeInt8(newSpawn ? -2 : -1);
        packet.writeInt8(life.mcTeam); // get team
        packet.writeInt32(0);
        return packet;
    }
};