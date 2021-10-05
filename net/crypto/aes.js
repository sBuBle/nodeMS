const aesKey = Buffer.from([
    0x13, 0x00, 0x00, 0x00,
    0x08, 0x00, 0x00, 0x00,
    0x06, 0x00, 0x00, 0x00,
    0xB4, 0x00, 0x00, 0x00,
    0x1B, 0x00, 0x00, 0x00,
    0x0F, 0x00, 0x00, 0x00,
    0x33, 0x00, 0x00, 0x00,
    0x52, 0x00, 0x00, 0x00
]);

let aes = require('crypto').createCipheriv('aes-256-ecb', aesKey, '');

function transformAES(data, sequence) {
    let length = data.length;
    let sequenceCopy = Buffer.from([
        sequence[0], sequence[1], sequence[2], sequence[3],
        sequence[0], sequence[1], sequence[2], sequence[3],
        sequence[0], sequence[1], sequence[2], sequence[3],
        sequence[0], sequence[1], sequence[2], sequence[3]
    ]);

    for (let i = 0; i < length;) {
        let block = Math.min(length - i, (i === 0 ? 1456 : 1460));
        let xorKey = sequenceCopy.slice();
        for (let j = 0; j < block; j++) {
            if ((j % 16) === 0) xorKey = aes.update(xorKey);
            data[i + j] ^= xorKey[j % 16];
        }
        i += block;
    }
}

module.exports = {transformAES};