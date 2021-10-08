const net = require('net');
const MapleClient = require('../client/MapleClient');
const MaplePacket = require('./MaplePacket');
const MapleCrypto = require('./crypto/main');
const crypto = require('crypto');
const PacketReader = require('./MapleReader');
module.exports = class Server {
    constructor(name, port = 8484, clients) {
        this.instance = name;
        this.clients = clients;
        this.tcpServer = this.tcp().listen(port);
    }

    startServer(err) {
        console.log('test');
    }

    tcp() {
        const server = net.createServer(socket => {
            console.log(`[${this.instance}] Got new Connection!`);

            // Setup server side client data.
            if (this.clients.has(socket)) return;
            const client = new MapleClient(socket, crypto.randomBytes(4), crypto.randomBytes(4));
            client.getSocket().buffer = new MaplePacket();
            client.getSocket().sendPacket = (packet) => {
                let buffer = Buffer.alloc(4);
                const socket = client.getSocket();
                MapleCrypto.generateHeader(buffer, client.getServerSequence(), packet.writtenData, -(config.VERSION + 1));
                socket.write(buffer);
                buffer = packet.getBufferCopy();
                MapleCrypto.encrypt(buffer, client.getServerSequence());
                client.setServerSequence(MapleCrypto.morphSequence(client.getServerSequence()));
                socket.write(buffer);
            }
            this.clients.set(socket, client);


            // Client server communication
            Object.entries({
                data: this.onData,
                close: this.onClose,
                error: this.onError,
                end: this.onEnd
            }).forEach(([key, handleFunction]) => socket.on(key, handleFunction.bind(this, client)));
        });
        server.on('connection', this.handshake.bind(this));
        return server;
    }

    handshake(socket, version = config.VERSION, subversion = config.SUB_VERSION, locale = 8) {
        const client = this.clients.get(socket);
        const packet = new PacketWriter(String(subversion).length + 13); // (Hex)0x0E == (decimal)14
        packet.writeUInt16(version);
        packet.writeString(String(subversion));
        packet.writeBytes(client.getClientSequence());
        packet.writeBytes(client.getServerSequence());
        packet.writeUInt8(locale);
        client.getSocket().write(packet.getBufferCopy());
    }

    async onData(client, receivedData) {
        const currentSocket = client.getSocket();
        const MaplePacket = currentSocket.buffer;
        currentSocket.pause();

        MaplePacket.push(receivedData);
        while (MaplePacket.isVaildHeader()) {
            const packet = await MaplePacket.getPacket();
            if (!MaplePacket.isHeader()) {
                //console.log(packet);
                continue;
            }
            MapleCrypto.decrypt(packet, client.getClientSequence());
            client.setClientSequence(MapleCrypto.morphSequence(client.getClientSequence()));

            const reader = new PacketReader(packet);
            const handler = packetHandler.getHandler(reader.readInt16());
            try {
                await handler(client, reader);
            } catch (exception) {
                console.error('[%s] %s', exception.code, exception.stack);
            }
        }

        currentSocket.resume();
    }
    onClose(client) {
        console.log(`Connection closed.`);
        client.disconnect('Socket Operation');
        this.clients.delete(client.getSocket());
    }
    onError(client, error) {
        client.disconnect('Socket Operation');
        this.clients.delete(client.getSocket());
        console.log(`[ERROR]`, error);
    }

    onEnd(client) {
        //console.log(`[CLIENT SIGNALS TO END CONNECTION!]`);
    }

};