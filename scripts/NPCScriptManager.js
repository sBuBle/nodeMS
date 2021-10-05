const fs = require('fs');

module.exports = class NPCScriptManager {
    constructor() {
        this.npc = null;
        this.status = 0;
        this.collector = new Map();
    }

    start(client, npc, filename) {
        const cm = this.NPCConversationManager(client, npc);
        this.npc = npc;
        if (!fs.existsSync(`${__dirname}/npc/${npc}.js`)) {
            cm.sendOk(`This npc id ${npc} is currectly not coded.`);
            return;
        }
        const npcFile = fs.readFileSync(`${__dirname}/npc/${npc}.js`);
        try {   
            this.status = 0;
            eval(`${npcFile} 
            start();`);
        } catch (e) {
            console.log(`[NPC - ${npc}] ${e}`);
            cm.sendOk(`This npc id ${npc} run into error trace, please report it on forums!`);
        }
    }

    action(client, mode, type, selection) {
        const cm = this.NPCConversationManager(client, this.npc);
        if (!fs.existsSync(`${__dirname}/npc/${this.npc}.js`)) return;
        const npcFile = fs.readFileSync(`${__dirname}/npc/${this.npc}.js`);
        try {
            if (mode == 1)
                this.status++;
            else
                this.status--;
            eval(`${npcFile}
                var status = ${this.status};
                action(${mode}, ${type}, ${selection});`);
        } catch (e) {
            console.log(`[NPC - ${this.npc}] ${e}`);
        }
    }


    getNPCTalk(npc, msgType, talk, endBytes, speaker) {
        const packet = new PacketWriter(0x130);
        packet.writeInt8(4); // ?
        packet.writeInt32(npc);
        packet.writeInt8(msgType);
        packet.writeInt8(speaker);
        packet.writeString(talk);
        packet.writeBytes(packet.hexToBytes(endBytes));
        return packet;
    }

    NPCConversationManager(client, npc) {
        const localFucntions = {};
        localFucntions.sendNext = (string) => client.getSocket().sendPacket(this.getNPCTalk(npc, 0, string, "00 01", 0));
        localFucntions.sendPrev = (string) => client.getSocket().sendPacket(this.getNPCTalk(npc, 0, string, "01 00", 0));
        localFucntions.sendNextPrev = (string) => client.getSocket().sendPacket(this.getNPCTalk(npc, 0, string, "01 01", 0));
        localFucntions.sendOk = (string) => client.getSocket().sendPacket(this.getNPCTalk(npc, 0, string, "00 00", 0));
        localFucntions.sendYesNo = (string) => client.getSocket().sendPacket(this.getNPCTalk(npc, 1, string, "", 0));
        localFucntions.sendAcceptDecline = (string) => client.getSocket().sendPacket(this.getNPCTalk(npc, 0x0C, string, "", 0));
        localFucntions.sendSimple = (string) => client.getSocket().sendPacket(this.getNPCTalk(npc, 4, string, "", 0));
        localFucntions.sendStyle = (string, styles) => client.getSocket().sendPacket(this.getNPCTalk(npc, string, styles));
        localFucntions.sendGetNumber = (string, def, min, max) => client.getSocket().sendPacket(this.getNPCTalk(npc, string, def, min, max));
        localFucntions.sendGetText = (string) => client.getSocket().sendPacket(this.getNPCTalk(npc, string, ""));
        //localFucntions.sendDimensionalMirror = (string) => {};
        localFucntions.getJobs = () => require('../client/MapleJob');
        localFucntions.getJobId = () => client.character.stats.job;
        localFucntions.getPlayer = () => client.character;
        localFucntions.warp = (mapid) => getMap(client.character.mapId).changeMap(client, mapid);
        localFucntions.dispose = () => null;
        localFucntions.gainExp = (exp) => null;
        return localFucntions;
    }
}