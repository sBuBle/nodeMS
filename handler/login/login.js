packetHandler.setHandler(0x0001, async (client, reader) => { // LOGIN_PASSWORD
    const username = reader.readString();
    const password = reader.readString();
    const loginOk = await client.getUserFromDB(username, password, config.AUTO_REGISTER);

    const packet = new PacketWriter(0x0000);
    if (loginOk !== 0) {
        getLoginFailed(packet, loginOk);
    } else {
        getAuthSuccess(packet, client.info);
    }

    client.getSocket().sendPacket(packet);
});

function getAuthSuccess(packet, account) {
    packet.writeUInt16(0); // status OK
    packet.writeUInt32(0);

    const numToHex = parseInt(String(account.id).substr(0, 8), 16); // max length 8, parse to base 16.
    packet.writeUInt32(numToHex);
    packet.writeUInt8(0);
    packet.writeUInt8(account.gm > 0 ? 0x40 : 0); // Admin flag
    packet.writeUInt8(0);
    packet.writeUInt8(0);
    packet.writeString(account.username);
    packet.writeUInt8(0);
    packet.writeUInt8(0); // muteReason
    packet.writeUInt64(0); // muteResetDate
    packet.writeDate(account.createdat); // creationDate
    packet.writeUInt32(0);
    // PIC info
    packet.writeUInt16(true);
}

function getLoginFailed(packet, reason) {
    /**
     * reason:
     *  0: Correct data, getAuthSuccess
     *  3: ID deleted or blocked
     *  4: Incorrect password
     *  5: Not a registered id
     *  6, 8, 9: System error
     *  7: Already logged in
     *  10: Cannot process so many connections
     *  11: Only users older than 20 can use this channel
     *  13: Unable to log on as master at this ip
     *  14, 17: Wrong gateway or personal info and weird korean button
     *  16, 21: Please verify your account through email...
     *  23: License agreement
     */
    packet.writeUInt16(reason); // 4 invaild password || 7 already loggedin
    packet.writeUInt32(0);
}

function getPermBan(packet, reason) {
    packet.writeUInt16(2); // is banned
    packet.writeUInt32(0);
    packet.writeUInt8(reason); // without reason.
    packet.writeDate(0); // infinity
}

function getTempBan(packet, timestampTill, reason) {
    packet.writeUInt16(2); // is banned
    packet.writeUInt32(0);
    packet.writeUInt8(reason);
    packet.writeDate(timestampTill);
}