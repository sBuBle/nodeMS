module.exports = class packetHandler {
    constructor() {
        this._handlers = new Map();
        this._skipedHandelers = new Set();
        this._handlerCount = 0;
    }

    setHandler(opCode, callback) {
        if (this._handlers.has(opCode)) return;
        this._handlers.set(opCode, callback);
        this._handlerCount++;
        console.log(`[PacketHandler] registred new handler for 0x${opCode.toString(16)}`);
    }

    getHandler(opCode) {
        if (this._skipedHandelers.has(opCode)) return (()=>{});
        if (this._handlers.has(opCode)) return this._handlers.get(opCode);
        return this.handlerNotFoundHandler;
    }

    skip(opCode) {
        if (this._skipedHandelers.has(opCode)) return;
        this._skipedHandelers.add(opCode);
        console.log(`[PacketHandler] **Skiped** handler for 0x${opCode.toString(16)}`);
    }

    getHandlerCount() {
        return this._handlerCount;
    }

    handlerNotFoundHandler(client, packet) {
        packet.offset = 0;
        console.log(`Unhandled packet: 0x${packet.readUInt16().toString(16)}`);
        console.log(packet.buffer);
    }

    forAllFiles(folder, filter, callback) {
        let filters = filter || '*';
        filters = filters.split(';');

        for (const filter in filters) {
            let tmp = filters[filter].split('*'); // For things like '*.png' and 'hurr*.txt' (['hurr', '.txt'])

            let tmp2 = [];
            // Filter empty values
            for (let i = 0; i < tmp.length; i++)
                if (tmp[i] !== '') tmp2.push(tmp[i]);

            filters[filter] = tmp2;
        }

        require('fs').readdirSync(folder).forEach((fileName) => {
            // Check if filename is okay
            if (this.checkFileFilter(fileName, filters)) {
                console.log(`[Handler-loader] Loading ${fileName}...`);
                callback(folder + '/' + fileName, fileName);
                console.log(`[Handler-loader] ${fileName} loaded...`);
            }
        });
    }

    checkFileFilter(fileName, filters) {
        for (var filter in filters) {
            var curFilter = filters[filter];
            var okay = false;
            if (curFilter.length == 1) {
                if (curFilter[0] === '') // All filter
                    return true;

                // 'hurrdurr.txt' === '.txt' ?

                if (fileName.indexOf(curFilter[0]) !== -1) return true;
            } else {
                var offset = 0;
                var found = true;

                for (var i = 0; i < curFilter.length; i++) {
                    var text = curFilter[i];
                    if (text === '') continue;
                    // text = '.'
                    var tmp = fileName.indexOf(text, offset);
                    if (tmp === -1) {
                        found = false;
                        break; // Continue with next filter
                    }
                    offset = tmp + 1;
                }

                if (found) return true;
            }
        }

        return false;
    }
};