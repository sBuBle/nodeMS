const MapleInventory = require('./MapleInventory');
module.exports = class MapleCharacter {
    constructor() {
        this.id = 0;
        this.accountid = 0;
        this.name = 'undefined';
        this.gender = 0;
        this.skin = 0;
        this.eyes = 20000;
        this.hair = 30030;

        this.worldid = 0;
        this.channelid = 0;
        this.mapId = 10000; // Maple Road (Maple Island)
        this.mapPos = 0;

        this.location = {
            x: 0,
            y: 0,
            stance: 0,
            foothold: 0
        };

        this.stats = {
            level: 1,
            job: 0,
            str: 12,
            dex: 5,
            int: 4,
            luk: 4,
            hp: 50,
            mhp: {
                type: 50,
                min: 1
            },
            mp: 5,
            mmp: {
                type: 5,
                min: 1
            },
            ap: 0,
            sp: 3,
            exp: 1,
            fame: 0,
        };

        this.KeyMap = new Map();
        this.skills = new Map();
        this.meso = 0;
        this.inventory = new Map();

        const InventoryType = new MapleInventory().getInventoryTypeList();
        for (const [type, value] of Object.entries(InventoryType)) {
            let b = value === InventoryType.CASH ? 96 : 24; // slot limit
            this.inventory.set(type, new MapleInventory(value, b));
        }
    }
    getCurrentMapID() {
        return this.mapId;
    }

    getMeso() {
        return this.meso;
    }

    getInventory(type) {
        return this.inventory.get(type);
    }

    addStats(writer) {
        writer.writeUInt32(this.id);
        writer.writeString(this.name, 13);
        writer.writeUInt8(this.gender);
        writer.writeUInt8(this.skin);
        writer.writeUInt32(this.eyes);
        writer.writeUInt32(this.hair);

        writer.writeUInt64(0);
        writer.writeUInt64(0);
        writer.writeUInt64(0);

        writer.writeUInt8(this.stats.level);
        writer.writeUInt16(this.stats.job);
        writer.writeUInt16(this.stats.str);
        writer.writeUInt16(this.stats.dex);
        writer.writeUInt16(this.stats.int);
        writer.writeUInt16(this.stats.luk);
        writer.writeUInt16(this.stats.hp);
        writer.writeUInt16(this.stats.mhp.type);
        writer.writeUInt16(this.stats.mp);
        writer.writeUInt16(this.stats.mmp.type);
        writer.writeUInt16(this.stats.ap); // Byte if evan?
        writer.writeUInt16(this.stats.sp);
        writer.writeUInt32(this.stats.exp);
        writer.writeUInt16(this.stats.fame);
        writer.writeUInt32(0); // Gachapon EXP

        writer.writeUInt32(this.mapId);
        writer.writeUInt8(this.mapPos);

        writer.writeUInt32(0); // Unk
    };


    addAvatar(writer) {
        const cashWeapon = 0;
        const inv = new MapleInventory();
        const equipedInventory = this.getInventory(inv.getByType(inv.getInventoryTypeList().EQUIPPED));
        const myEquip = new Map();
        const maskedEquip = new Map();

        //equipedInventory.addItem(1060002, 5); // top
        equipedInventory.addItem(1060000, 6); // pants
        equipedInventory.addItem(1072001, 7); // shose
        equipedInventory.addItem(1302000, 11); // weapon

        for (const item of equipedInventory.getItems().values()) {
            let pos = item.getPosition() * inv.getInventoryTypeList().EQUIPPED;
            if (pos < 100 && !myEquip.has(pos)) {
                myEquip.set(pos, item.getItemId());
            } else if (pos > 100 && pos != 111) { // don't ask. o.o
                pos -= 100;
                if (myEquip.has(pos)) {
                    maskedEquip.set(pos, myEquip.get(pos));
                }
                myEquip.set(pos, item.getItemId());
            } else if (myEquip.has(pos)) {
                maskedEquip.set(pos, item.getItemId());
            }
        }

        // Write info
        writer.writeUInt8(this.gender);
        writer.writeUInt8(this.skin);
        writer.writeUInt32(this.eyes);

        writer.writeUInt8(0); // mega?
        writer.writeUInt32(this.hair);

        for (const [key, value] of myEquip) {
            writer.writeInt8(Math.abs(key));
            writer.writeUInt32(value);
        }
        writer.writeUInt8(0xFF);

        for (const [key, value] of maskedEquip) {
            writer.writeInt8(Math.abs(key));
            writer.writeUInt32(value);
        }
        writer.writeUInt8(0xFF);

        const cWeapon = equipedInventory.getItem(-111);
        writer.writeUInt32(cWeapon != null ? cWeapon.getItemId() : 0);

        // Pet IDs
        for (let i = 0; i < 3; i++)
            writer.writeUInt32(0);
    };

    dropMessage(type, channel, message, servermessage = false, megaEar = false) {
        const packet = new PacketWriter(0x44);
        packet.writeUInt8(type);
        if (servermessage) packet.write(1);
        packet.writeString(message);
        if (type == 3) {
            packet.writeUInt8(channel - 1); // channel
            packet.writeUInt8(megaEar);
        } else if (type == 6) {
            packet.writeUInt32(0);
        }
        return packet;
    }
};