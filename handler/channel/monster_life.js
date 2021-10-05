const MapleLife = new (require('../../client/MapleLife'))();
packetHandler.setHandler(0x00BC, function (client, reader) {
    const objectid = reader.readInt32();
    const moveid = reader.readInt16();
    const skillByte = reader.readInt8();
    const skill = reader.readInt8();
    const skillId = reader.readInt8() & 0xFF;
    const skillLv = reader.readInt8();
    const pOption = reader.readInt8();
    const skill_4 = reader.readInt8();
    reader.skip(13);

    const MonsterMove = MapleLife.decodeMovePath(reader, false);
    const curretMap = getMap(client.getPlayer().mapId);
    const mapMonster = curretMap.lifePool.getMapObject(objectid);

    if(MonsterMove.length === 0) return;
    const MoveRes = moveMonsterResponse(objectid, moveid, 0, 0, 0, 0);
    const Move = moveMonster(objectid, skillByte, skill, skillId, skillLv, pOption, skill_4)
    MapleLife.encodeMovePath(MonsterMove, Move);
    curretMap.broadcastPacket(Move);
    client.getSocket().sendPacket(MoveRes);
});

function moveMonsterResponse(objectid, moveid, currentMp, useSkills, skillId, skillLevel) {
    const packet = new PacketWriter(0xF0);
    packet.writeInt32(objectid);
    packet.writeInt16(moveid);
    packet.writeInt8(useSkills ? 1 : 0);
    packet.writeInt16(currentMp);
    packet.writeInt8(skillId);
    packet.writeInt8(skillLevel);
    return packet;
}

function moveMonster(oid, skillPossible, skill, skillId, skillLevel, pOption, skill_4, startPos) {
    const packet = new PacketWriter(0xEF);
    packet.writeInt32(oid);
    packet.writeInt8(0);
    packet.writeInt8(skillPossible);
    packet.writeInt8(skill);
    packet.writeInt8(skillId);
    packet.writeInt8(skillLevel);
    packet.writeInt8(pOption);
    packet.writeInt8(skill_4);
    return packet;
}