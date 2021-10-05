const EquipItems = new Map();
const BundleItems = new Map();
module.exports = class MapleItem {
    getItemCategoryName(itemId) {
        switch (this.getItemCategory(itemId)) {

            case 101:
            case 102:
            case 103:
            case 112:
            case 113:
            case 114:
                return 'Accessory';

            case 100:
                return 'Cap';

            case 110:
                return 'Cape';

            case 104:
                return 'Coat';

            case 194:
            case 195:
            case 196:
            case 197:
                return 'Dragon';
            case 2:
                return 'Face';

            case 108:
                return 'Glove';

            case 3:
                return 'Hair';

            case 105:
                return 'Longcoat';

            case 106:
                return 'Pants';

            case 180:
            case 181:
            case 182:
            case 183:
                return 'PetEquip';

            case 111:
                return 'Ring';

            case 109:
                return 'Shield';

            case 107:
                return 'Shoes';

            case 190:
            case 191: // 192 is missing?
            case 193:
                return 'TamingMob';

            case 130:
            case 131:
            case 132:
            case 133:
            case 137:
            case 138:
            case 140:
            case 141:
            case 142:
            case 143:
            case 144:
            case 145:
            case 146:
            case 147:
            case 148:
            case 149:
            case 160:
            case 170:
                return 'Weapon';
            default:
                throw `Unknown item category. Item:  ${itemId}`;
        }
    }

    getItemCategory(itemId) {
        return (itemId / 10000) >>> 0;
    }

    getCharacterNXNode(itemId) {
        const typeName = this.getItemCategoryName(itemId);
        const item = DataFiles.character.GetPath(`${typeName}/${itemId.toString().padStart(8, 0)}.img`);
        return item;
    }

    getEquipItem(itemId) {
        if (EquipItems.has(itemId)) {
            return EquipItems.get(itemId);
        }

        const node = this.getCharacterNXNode(itemId);
        if (node === null) return null;

        const infoNode = node.Child('info');
        const info = {};
        const stringNXNode = DataFiles.string.GetPath(`Eqp.img/Eqp/${this.getItemCategoryName(itemId)}/${itemId}`);
        info.name = (stringNXNode.Child('name')?.GetData() ?? '');
        info.description = (stringNXNode.Child('desc')?.GetData() ?? '');

        // Unknowns
        info.ruc = (infoNode.Child('tuc')?.GetData() ?? 0)
        info.fs = (infoNode.Child('fs')?.GetData() ?? 0)

        // Others
        info.timeLimited = (infoNode.Child('timeLimited')?.GetData() ?? '0');
        info.requiredStr = (infoNode.Child('reqSTR')?.GetData() ?? 0)
        info.requiredDex = (infoNode.Child('reqDEX')?.GetData() ?? 0)
        info.requiredInt = (infoNode.Child('reqINT')?.GetData() ?? 0)
        info.requiredLuk = (infoNode.Child('reqLUK')?.GetData() ?? 0)
        info.requiredFame = (infoNode.Child('reqPOP')?.GetData() ?? 0)
        info.requiredJob = (infoNode.Child('reqJob')?.GetData() ?? 0)
        info.requiredLevel = (infoNode.Child('reqLev')?.GetData() ?? 0)
        info.requiredMobLevel = (infoNode.Child('reqMobLevel')?.GetData() ?? 0)

        info.increaseStr = (infoNode.Child('incSTR')?.GetData() ?? 0)
        info.increaseDex = (infoNode.Child('incDEX')?.GetData() ?? 0)
        info.increaseInt = (infoNode.Child('incINT')?.GetData() ?? 0)
        info.increaseLuk = (infoNode.Child('incLUK')?.GetData() ?? 0)
        info.increaseMaxHP = (infoNode.Child('incMHP')?.GetData() ?? 0)
        info.increaseMaxMP = (infoNode.Child('incMMP')?.GetData() ?? 0)
        info.increaseWeaponAttack = (infoNode.Child('incPAD')?.GetData() ?? 0)
        info.increaseWeaponDefence = (infoNode.Child('incPDD')?.GetData() ?? 0)
        info.increaseMagicAttack = (infoNode.Child('incMAD')?.GetData() ?? 0)
        info.increaseMagicDefence = (infoNode.Child('incMDD')?.GetData() ?? 0)
        info.increaseAcc = (infoNode.Child('incACC')?.GetData() ?? 0)
        info.increaseAvo = (infoNode.Child('incEVO')?.GetData() ?? 0)
        info.increaseCrafting = (infoNode.Child('incCraft')?.GetData() ?? 0)
        info.increaseSpeed = (infoNode.Child('incSpeed')?.GetData() ?? 0)
        info.increaseJump = (infoNode.Child('incJump')?.GetData() ?? 0)
        info.increaseSwim = (infoNode.Child('incSwim')?.GetData() ?? 0)
        info.increaseFatigue = (infoNode.Child('incFatigue')?.GetData() ?? 0)

        info.sellPrice = (infoNode.Child('price')?.GetData() ?? 0)
        info.isCash = (infoNode.Child('cash')?.GetData() ?? 0);
        info.isQuest = (infoNode.Child('quest')?.GetData() ?? 0) !== 0;
        info.isPartyQuest = (infoNode.Child('pquest')?.GetData() ?? 0) !== 0;
        info.isOneInInventory = (infoNode.Child('only')?.GetData() ?? 0) !== 0;
        info.isTradeBlocked = (infoNode.Child('tradeBlock')?.GetData() ?? 0) !== 0;
        info.isUnsellable = (infoNode.Child('notSale')?.GetData() ?? 0) !== 0;
        info.isExpiringOnLogout = (infoNode.Child('expireOnLogout')?.GetData() ?? 0) !== 0;
        info.givesKnockback = (infoNode.Child('knockback')?.GetData() ?? 0) !== 0;
        info.isBigSize = (infoNode.Child('bigSize')?.GetData() ?? 0) !== 0;
        info.swim = (infoNode.Child('swim')?.GetData() ?? 0)
        info.tamingMob = (infoNode.Child('tamingMob')?.GetData() ?? 0)
        info.recovery = (infoNode.Child('recovery')?.GetData() ?? 1.0);
        info.afterImageFlag = 0;

        if (this.getItemCategory(itemId) === 170) { // If is weapon?
            // Cash item afterImage
            const weaponTypes = [30, 31, 32, 33, 37, 38, 40, 41, 42, 43, 44, 45, 46, 47];
            let hasSetAFlag = false;
            for (let i = 0; i < weaponTypes.length; i++) {
                if (node.Child(String(weaponTypes[i])) !== null) {
                    info.afterImageFlag |= (1 << i);
                    hasSetAFlag = true;
                }
            }

            if (!hasSetAFlag) throw `Weapon ${equipId} does not have cash-weapon cover info.`;
        }

        EquipItems.set(itemId, info);
        return info;
    };

    addItemInfo(item, writer) {
        /**
         * 1 = equip
         * 2 = other
         * 3 = pet
         */
        const itemInfo = this.getEquipItem(item.getItemId());
        const itemType = item.getItemType();
        if(itemType === 1 && typeof itemInfo === null)
            itemType = 2;

        writer.writeUInt8(itemType);
        writer.writeUInt32(item.getItemId());

        writer.writeUInt8(!!itemInfo.isCash);
        if(!!itemInfo.isCash)
            writer.writeUInt64(0); // Cash(Nx) item id.

        writer.writeDate(0x217E646BB058000); // No expiration

        if (itemType == 1) { 
            writer.writeUInt8(0);   // upgrade slots
            writer.writeUInt8(0);   // scrolls
            writer.writeUInt16(itemInfo.increaseStr);
            writer.writeUInt16(itemInfo.increaseDex);
            writer.writeUInt16(itemInfo.increaseInt);
            writer.writeUInt16(itemInfo.increaseLuk);
            writer.writeUInt16(itemInfo.increaseMaxHP);
            writer.writeUInt16(itemInfo.increaseMaxMP);
            writer.writeUInt16(itemInfo.increaseWeaponAttack);
            writer.writeUInt16(itemInfo.increaseMagicAttack);
            writer.writeUInt16(itemInfo.increaseWeaponDefence);
            writer.writeUInt16(itemInfo.increaseMagicDefence);
            writer.writeUInt16(itemInfo.increaseAcc);
            writer.writeUInt16(itemInfo.increaseAvo);
            writer.writeUInt16(itemInfo.increaseHands);
            writer.writeUInt16(itemInfo.increaseSpeed);
            writer.writeUInt16(itemInfo.increaseJump);
            writer.writeString(itemInfo.name); // Owner name
            writer.writeUInt16(itemInfo.afterImageFlag);

            if (!!itemInfo.isCash) { // is cash
                writer.writeHexString('91174826F700');
                writer.writeUInt32(0);
            } else {
                writer.writeUInt8(0);
                writer.writeUInt8(0);   // Item level
                writer.writeUInt32(0);  // get Exp Needed For Level
                writer.writeUInt32(0);  // hammers
                writer.writeUInt64(0);
            }


        } else if (itemType == 2) { 
            writer.writeUInt16(item.getQuantity());
            writer.writeString(itemInfo.name); // Owner name 
            writer.writeUInt16(itemInfo.afterImageFlag);

            // Todo: fix this; add rechargeable check
            if (false) { // is rechargeable?
                writer.writeUInt32(2);
                const bytes = [0x54, 0, 0, 0x34];
                for(let i = 0; i < bytes.length; i++)
                    writer.writeUInt8(bytes[i]);
            }
        }else if (itemType == 3) {
            throw 'Pet item'
        }

        writer.writeUInt64(0x14F373BFDE04000); // Time
        writer.writeUInt32(0xFF);
    };
}