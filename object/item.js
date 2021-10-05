module.exports = class Item {
    constructor(id, position, quantity) {
        this.id = id;
        this.position = position;
        this.quantity = quantity;
        this.petId = -1;
    }
    setPosition(position) {
        this.position = position;
    }
    setQuantity(quantity) {
        this.quantity = quantity;
    }
    getItemId() {
        return this.id;
    }
    getPosition() {
        return this.position;
    }
    getQuantity() {
        return this.quantity;
    }
    getPetId() {
        return this.petId;
    }
    getItemType() { // 1: equip, 2: other, 3: pet
        return this.getPetId() === -1 ? 1 : 3;
    }
};