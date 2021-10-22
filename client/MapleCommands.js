module.exports = class MapleCommands {
    constructor(client, receivedMessage) {
        this.commandList = new Map();
        const hasPrefix = receivedMessage.startsWith("@");
        if (hasPrefix)
            this.processCommand(client, receivedMessage);
    }

    processCommand(client, receivedMessage) {
        const fullCommand = receivedMessage.substr(1);
        const splitCommand = fullCommand.split(" ");
        const primaryCommand = splitCommand[0];
        const args = splitCommand.slice(1);
        this.commandProccess(client, PacketWriter);
        if (this.isExsits(primaryCommand) === false) {
            const chatMessasge = client.getPlayer().dropMessage(0, 0, `[command processor] The commnad ${primaryCommand} does not exsits!`);
            client.getSocket().sendPacket(chatMessasge);
            return;
        }
        this.excuteCommand(primaryCommand)(args);
    }

    addCommand(name, callback) {
        if (!this.commandList.has(name))
            this.commandList.set(name, callback);
    }

    isExsits(name) {
        return this.commandList.has(name);
    }

    excuteCommand(name) {
        return this.commandList.get(name);
    }

    commandProccess(client) {
        this.addCommand('packet', args => {
            const packet = new PacketWriter();
            packet.writeHexString(args.slice(1).join());
            client.getSocket().sendPacket(packet);
        });

        this.addCommand('map', args => {
            if (args.length !== 1) return;
            const gotomapid = {
                GmMap: 180000000,
                Southperry: 60000,
                Amherst: 1010000,
                henesys: 100000000,
                ellinia: 101000000,
                perion: 102000000,
                kerning: 103000000,
                lith: 104000000,
                sleepywood: 105040300,
                florina: 110000000,
                orbis: 200000000,
                happy: 209000000,
                elnath: 211000000,
                ludi: 220000000,
                aqua: 230000000,
                leafre: 240000000,
                mulung: 250000000,
                herb: 251000000,
                omega: 221000000,
                korean: 222000000,
                nlc: 600000000,
                excavation: 990000000,
                PianusCave: 230040420,
                Htc: 240060200,
                Mushmom: 100000005,
                Griffey: 240020101,
                Manon: 240020401,
                Headless: 682000001,
                JrBalrog: 105090900,
                Zakum: 280030000,
                Papulatus: 220080001,
                showa: 801000000,
                Guild: 200000301,
                Shrine: 800000000,
                fme: 910000000,
                Skelegon: 240040511,
                PVP: 109020001,
            };

            const MapleMap = getMap(client.character.mapId);
            let map = parseInt(args[0], 10) || args[0];
            let mapid = 0;
            switch (typeof map) {
                case 'number':
                        if(MapleMap.isMapExist(map)){
                            mapid = map;
                        }else{
                            client.getPlayer().dropMessage(client, `Map id ${map} does not exsits!`);
                            return;
                        }
                    break;
                case 'string':
                    for (const [mName, mId] of Object.entries(gotomapid)) {
                        if (map.toLowerCase() !== mName.toLowerCase()) continue;
                        mapid = mId;
                    }
                    break;
            }
            map = mapid
            if (map === -1) return;
            MapleMap.changeMap(client, map);
        });
    }
};