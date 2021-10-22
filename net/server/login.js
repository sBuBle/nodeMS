const server = require('../server');
const PacketHandler = require('../../handler/packetHandler');
const PacketWriter = require('../MapleWriter');
const PacketReader = require('../MapleReader');
const config = require('../../constant.json');
const mysql = require('mysql');
const nx = require('../../provider/nx');
const localServer = class orginizeMapleLogin {
    constructor() {
        this.clients = new Map();
        this.server = new server('login', 8484, this.clients);
        this.avaibleWorlds = new Map();
        this.dbConnInfo = {
            host: config.HOST || 'localhost',
            user: config.DB_USER || 'root',
            password: config.DB_PASS || '',
            database: config.DB_SELECT || 'nodems'
        };
    }

    pinger() {
        packetHandler.setHandler(0x0018, client => { /// PONG
            client.responseTime = new Date().getTime()
            client.ponged = true;
        });
        return setInterval(() => { // PING
            const clients = (this.server.clients || this.clients);
            if (clients.size <= 0) return;
            for (const [socket, client] of clients) {
                const now = new Date().getTime();
                const resSecTimeLimit = 150; // 2.5 min to response
                const packet = new PacketWriter(0x0011);
                if (typeof client.responseTime === 'number') { // Disconnect slow connection players.
                    if ((now - client.responseTime) >= (resSecTimeLimit * 1000)) {
                        client.disconnect('Ping timeout');
                        this.server.clients.delete(socket);
                    }
                } else {
                    client.responseTime = now;
                }
                if (client.ponged !== 'undefined') { // Disconnect crashed players.
                    if (client.ponged === false) {
                        client.disconnect('Ping timeout');
                        this.server.clients.delete(socket);
                    }
                }
                client.ponged = false;
                socket.sendPacket(packet);
            }
        }, 15000); // Check every 15 sec if player response.
    }

    initialize() {
        global.DataFiles = {
            character: new nx.file(`${__dirname}/../../provider/nx/Character.nx`),
            item: new nx.file(`${__dirname}/../../provider/nx/Item.nx`),
            string: new nx.file(`${__dirname}/../../provider/nx/String.nx`),
            etc: new nx.file(`${__dirname}/../../provider/nx/Etc.nx`),
        };
        global.config = require('../../constant.json');
        global.PacketWriter = PacketWriter;
        global.packetReader = PacketReader;
        global.packetHandler = new PacketHandler();
        global.avaibleWorlds = this.avaibleWorlds;
        global.sqlConn = this.connSQL();
        packetHandler.forAllFiles(`${process.cwd()}/handler/login`, '*.js', fileName => require(fileName));
    }

    connSQL() {
        const conn = mysql.createConnection(this.dbConnInfo);
        conn.connect(err => {
            if (err) throw err;
            console.log(`Successfully connected to database server!`);
        });
        return conn;
    }

    loadAvaibleWorlds() {
        const args = process.argv[2].split(',').filter(value => value !== '');
        if ((args.length % 3) !== 0) throw `[Error] World args size incorrect.`;

        for (let i = 0; i < args.length; i += 3) {
            const [name, port, pid] = args.slice(i, i + 3);
            if (!config.WORLD_NAMES.includes(name)) {
                process.kill(pid);
                continue;
            }

            this.avaibleWorlds.set(pid, {
                worldId: config.WORLD_NAMES.indexOf(name),
                worldName: name,
                port: port
            });
        }
    }
}

const local = new localServer();
local.loadAvaibleWorlds();
local.initialize();
local.pinger();

// Test Section of nx Provider
/*
    DataFiles.etc.Child('ForbiddenName.img').ForEach(element => {
        console.log(element.GetData());
    });
*/