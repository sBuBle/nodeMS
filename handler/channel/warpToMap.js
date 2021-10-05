const MapleCharacter = require("../../client/MapleCharacter");
const MapleInventory = require('../../client/MapleInventory')
const MapleItem = require('../../client/MapleItem');

packetHandler.setHandler(0x0014, async function (client, reader) {
    const char_id = reader.readUInt32();
    client.info = {
        char_id: Number(char_id)
    }
    const character = client.character = await client.getSingleCharacterFromDB();

    let packet = new PacketWriter(0x007D);
    packet.writeUInt32(0); // channel id
    packet.writeUInt8(1); // Portal count
    packet.writeUInt8(1); // new channel
    packet.writeUInt16(0);

    // RNGs
    for (let i = 0; i < 3; i++)
        packet.writeUInt32(Math.floor(Math.random() * (0xFFFF - 0xFFFFFF) + 0xFFFFFF)); // idk, some random shit


    // Start character info
    packet.writeUInt64(0xFF);
    packet.writeUInt8(0);

    character.addStats(packet);

    packet.writeUInt8(0); // Buddylist size
    packet.writeUInt8(false); // Blessing of the Fairy name

    let i; {
        {
            /**
             * Inventory tab items/meso.
             */
            const itm = new MapleItem();
            const inv = new MapleInventory();
            const equipedInventory = character.getInventory(inv.getByType(inv.getInventoryTypeList().EQUIPPED));
            const myEquip = new Set();
            const maskedEquip = new Set();

            equipedInventory.addItem(1060000, 6); // pants
            equipedInventory.addItem(1072001, 7); // shose
            equipedInventory.addItem(1302000, 11); // weapon
            
            for (const item of equipedInventory.getItems().values()) {
                if (item.getPosition() <= -100) {
                    maskedEquip.add(item);
                } else {
                    myEquip.add(item);
                }
            }

            packet.writeUInt32(character.getMeso()); // Meso count

            for (i = 1; i <= 5; i++) {
                packet.writeUInt8(character.getInventory(inv.getByType(i)).getSlotLimit()); // Slot limit for every tab.
            }
            packet.writeUInt64(0x14F373BFDE04000); // Time

            // Equipped items
            for (const item of myEquip.values()) {
                console.log(item);
                packet.writeUInt16(Math.abs(item.getPosition()));
                itm.addItemInfo(item, packet);
            }
            packet.writeUInt16(0);

            // Equipped nx items
            for (const item of maskedEquip.values()) {
                packet.writeUInt16(Math.abs(item.getPosition()));
                itm.addItemInfo(item, packet);
            }
            packet.writeUInt16(0);

            // Equip Inventory
            const getEquipTab = character.getInventory(inv.getByType(inv.getInventoryTypeList().EQUIP));
            for (const item of getEquipTab.getItems().values()) {
                packet.writeUInt16(Math.abs(item.getPosition()));
                itm.addItemInfo(item, packet);
            }
            packet.writeUInt16(0);

            // USE
            const getUseTab = character.getInventory(inv.getByType(inv.getInventoryTypeList().USE));
            for (const item of getUseTab.getItems().values()) {
                packet.writeUInt16(Math.abs(item.getPosition()));
                itm.addItemInfo(item, packet);
            }
            packet.writeUInt16(0);

            // SETUP
            const getSetupTab = character.getInventory(inv.getByType(inv.getInventoryTypeList().SETUP));
            for (const item of getSetupTab.getItems().values()) {
                packet.writeUInt8(Math.abs(item.getPosition()));
                itm.addItemInfo(item, packet);
            }
            packet.writeUInt8(0);

            // ETC
            const getEtcTab = character.getInventory(inv.getByType(inv.getInventoryTypeList().ETC));
            for (const item of getEtcTab.getItems().values()) {
                packet.writeUInt8(Math.abs(item.getPosition()));
                itm.addItemInfo(item, packet);
            }
            packet.writeUInt8(0);

            // CASH
            const getCashTab = character.getInventory(inv.getByType(inv.getInventoryTypeList().CASH));
            for (const item of getCashTab.getItems().values()) {
                packet.writeUInt8(Math.abs(item.getPosition()));
                itm.addItemInfo(item, packet);
            }
            packet.writeUInt8(0);
        }

        // Skills
        packet.writeUInt16(0); // locked
        packet.writeUInt16(0); // Cooldowns

        // Quests
        packet.writeUInt16(0); // Running
        packet.writeUInt16(0); // Finished

        packet.writeUInt16(0); // Crush Rings
        packet.writeUInt16(0); // Friend Rings
        packet.writeUInt16(0); // Marriage Rings
        packet.writeUInt16(0);

        {
            // Teleport Rocks
            for (i = 0; i < 15; i++)
                packet.writeUInt32(999999999);
        }

        {
            // Monsterbook
            packet.writeUInt32(0); // Cover
            packet.writeUInt8(0); // 'readmode'
            packet.writeUInt16(0); // cards
        }

        packet.writeUInt16(0);
        packet.writeUInt16(0);
        packet.writeUInt16(0);

        packet.writeDate(new Date()); // Current time
    }
    
    client.getSocket().sendPacket(packet);
    getMap(client.getPlayer().mapId).addPlayer(client);
});