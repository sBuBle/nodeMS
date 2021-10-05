const inventoryType = {
    UNDEFINED: 0,
    EQUIP: 1,
    USE: 2,
    SETUP: 3,
    ETC: 4,
    CASH: 5,
    CANHOLD: 6,
    EQUIPPED: -1,
    type: null
};
module.exports = class MapleInventory {
    constructor(type, slotLimit) {
        this.slotLimit = slotLimit;
        this.type = type;
        this.checked = false;
        this.inventory = new Map();
    }

    addItem(itemid, position, quantity = 1) {
        this.inventory.set(itemid, new (require('../object/item'))(itemid, position, quantity));
    }

    getItems() {
        return this.inventory;
    }

    getItem(itemid){
        return this.inventory.get(itemid);
    }

    getSlotLimit() {
        return this.slotLimit;
    }

    getInventoryTypeList() {
        return inventoryType;
    }

    getByType(type) {
        for (const [iType, value] of Object.entries(inventoryType)) {
            if (value !== type) continue;
            return iType;
        }
        return null;
    }

    getByWZName(name) {
        switch (name) {
            case 'Install':
                return inventoryType.SETUP;
            case 'Etc':
                return inventoryType.USE;
            case 'Cash':
                return inventoryType.CASH;
            case 'Pet':
                return inventoryType.CASH;
            default:
                return inventoryType.UNDEFINED;
        }
    }
};