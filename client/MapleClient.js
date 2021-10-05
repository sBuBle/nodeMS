 module.exports = class MapleClient {
     constructor(socket, clientIV, serverIV) {
         this._serverIV = serverIV;
         this._clientIV = clientIV;
         this._socket = socket;
     }
     
     disconnect(reason = ''){
        console.log(`Disconnecting client.`, reason.length !== 0 ? `$Reason: {reason}` : `not specified reason`);
        if(typeof this.character !== "undefined" && typeof getMap !== 'undefined'){
            getMap(this.character.getCurrentMapID()).removePlayer(this);
        }
        this._socket.end();
        this._socket.destroy();
     }
     getPlayer(){
         return this.character;
     }
     setWorld(id) {
         this.worldid = id;
     }
     setChannel(id) {
         this.channelid = id;
     }
     getWorld() {
         return this.worldid;
     }
     getChannel() {
         return this.channelid;
     }
     getServerSequence() {
         return this._serverIV;
     }

     getClientSequence() {
         return this._clientIV;
     }
     getSocket() {
         return this._socket;
     }
     setClientSequence(clientIV) {
         this._clientIV = clientIV;
     }
     setServerSequence(serverIV) {
         this._serverIV = serverIV;
     }

     getSingleCharacterFromDB(){
        return new Promise((resolve, reject) => {
            let sql = `SELECT * FROM characters WHERE id=${this.info.char_id} LIMIT 1`;
            sqlConn.query(sql, (error, results) => {
                if (error) return reject(error);
                results = results[0];
                const MapleCharacter = new (require('./MapleCharacter'));
                MapleCharacter.id = results.id;
                MapleCharacter.accountid = results.accountid;
                MapleCharacter.name = results.name;
                MapleCharacter.gender = results.gender;
                MapleCharacter.skin = results.skin || 0;
                MapleCharacter.eyes = results.eyes ?? 20000;
                MapleCharacter.hair = results.hair ?? 30020;
                MapleCharacter.stats.level = results.level;
                MapleCharacter.stats.job = results.job;
                MapleCharacter.stats.str = results.str;
                MapleCharacter.stats.dex = results.dex;
                MapleCharacter.stats.int = results.int;
                MapleCharacter.stats.luk = results.luk;
                MapleCharacter.stats.hp = results.maxhp >= 30000 ? 30000 : results.maxhp;
                MapleCharacter.stats.mhp.type = results.maxhp >= 30000 ? 30000 : results.maxhp;
                MapleCharacter.stats.mp = results.maxmp <= results.mp ? results.maxmp : results.mp;
                MapleCharacter.stats.mmp.type = results.maxmp;
                MapleCharacter.stats.ap = results.ap;
                MapleCharacter.stats.sp = results.sp;
                MapleCharacter.stats.exp = results.exp;
                MapleCharacter.stats.fame = results.fame;
                MapleCharacter.meso = results.meso;
                MapleCharacter.mapId = results.map === 0 ? 10000 : results.map;
                //MapleCharacter.mapPos = results.spawnpoint;

                resolve(MapleCharacter);
            });
        });
     }

     getCharactersFromDB() {
         return new Promise((resolve, reject) => {
             let sql = `SELECT * FROM characters WHERE accountid=${this.info.id} AND world=${sqlConn.escape(this.getWorld())}`;
             sqlConn.query(sql, (error, results) => {
                 if (error) return reject(error);
                 const MapleCharacter = require('./MapleCharacter');
                 let charList = [];
                 for (const character of results) {
                     const objCharacter = new MapleCharacter();
                     objCharacter.id = character.id;
                     objCharacter.accountid = character.accountid;
                     objCharacter.name = character.name;
                     objCharacter.gender = character.gender;
                     objCharacter.skin = character.skin || 0;
                     objCharacter.eyes = character.eyes ?? 20000;
                     objCharacter.hair = character.hair ?? 30020;
                     objCharacter.stats.level = character.level;
                     objCharacter.stats.job = character.job;
                     objCharacter.stats.str = character.str;
                     objCharacter.stats.dex = character.dex;
                     objCharacter.stats.int = character.int;
                     objCharacter.stats.luk = character.luk;
                     objCharacter.stats.hp = character.maxhp >= 30000 ? 30000 : character.maxhp;
                     objCharacter.stats.mhp.type = character.maxhp >= 30000 ? 30000 : character.maxhp;
                     objCharacter.stats.mp = character.maxmp <= character.mp ? character.maxmp : character.mp;
                     objCharacter.stats.mmp.type = character.maxmp;
                     objCharacter.stats.ap = character.ap;
                     objCharacter.stats.sp = character.sp;
                     objCharacter.stats.exp = character.exp;
                     objCharacter.stats.fame = character.fame;
                     objCharacter.meso = character.meso;
                     objCharacter.mapId = character.map === 0 ? 10000 : character.map;
                     //objCharacter.mapPos = character.spawnpoint;

                     charList.push(objCharacter);
                 }
                 resolve(charList);
             });
         });
     }

     getUserFromDB(username, password, autoRegister = true) {
         return new Promise((resolve, reject) => {
             sqlConn.query(`SELECT * FROM accounts WHERE username = ${sqlConn.escape(username)}`, async (error, results) => {
                 if (error) return reject(error);
                 const bcrypt = require('bcrypt');
                 if (autoRegister === true && results.length === 0) {
                     const hash = await bcrypt.hash(password, 10);
                     await sqlConn.query(`INSERT INTO accounts (username, password) VALUES (${sqlConn.escape(username)}, '${hash}')`);
                     return resolve(5);
                 } else {
                     const isVaildPass = await bcrypt.compare(password, results[0].password);
                     if (!isVaildPass) return resolve(4);
                     this.info = results[0];
                     return resolve(0);
                 }
             });
         });
     }

     saveCharacters(character) {
         return new Promise((resolve, reject) => {
             const insertValue = `${Number(this.info.id)}, ${Number(this.getWorld())}, ${sqlConn.escape(character.name)}, ${character.hair}, ${character.eyes}, ${character.gender}, ${character.stats.job}, ${character.mapId}`;
             sqlConn.query(`INSERT INTO characters (accountid, world, name, hair, face, gender, job, map) VALUES (${insertValue})`, (error, results) => {
                 if (error) return reject(error);
                 resolve(true);
             });
         });
     }

     deleteCharacter(characterId) {
         return new Promise((resolve, reject) => {
             sqlConn.query(`DELETE FROM characters WHERE accountid=${this.info.id} AND id=${characterId} AND world=${this.getWorld()}`, async (error, results) => {
                 if (error) return reject(error);
                 return resolve(true);
             });
         });
     }
 };