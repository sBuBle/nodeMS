function rollLeft(value, shift) {
    let overflow = ((value >>> 0) << (shift % 8)) >>> 0;
    const ret = ((overflow & 0xFF) | (overflow >>> 8)) & 0xFF;
    return ret;
}

function rollRight(value, shift) {
    let overflow = (((value >>> 0) << 8) >>> (shift % 8));
    const ret = ((overflow & 0xFF) | (overflow >>> 8)) & 0xFF;
    return ret;
}

function encrypt(data) {
    let length = data.length,
        j, a, c;
    for (let i = 0; i < 3; i++) {
        a = 0;
        for (j = length; j > 0; j--) {
            c = data[length - j];
            c = rollLeft(c, 3);
            c += j;
            c &= 0xFF; // Addition
            c ^= a;
            a = c;
            c = rollRight(a, j);
            c ^= 0xFF;
            c += 0x48;
            c &= 0xFF; // Addition
            data[length - j] = c;
        }
        a = 0;
        for (j = length; j > 0; j--) {
            c = data[j - 1];
            c = rollLeft(c, 4);
            c += j;
            c &= 0xFF; // Addition
            c ^= a;
            a = c;
            c ^= 0x13;
            c = rollRight(c, 3);
            data[j - 1] = c;
        }
    }
}

function decrypt(data) {
    let length = data.length,
        j, a, b, c;
    for (let i = 0; i < 3; i++) {
        a = 0;
        b = 0;
        for (j = length; j > 0; j--) {
            c = data[j - 1];
            c = rollLeft(c, 3);
            c ^= 0x13;
            a = c;
            c ^= b;
            c -= j;
            c &= 0xFF; // Addition
            c = rollRight(c, 4);
            b = a;
            data[j - 1] = c;
        }
        a = 0;
        b = 0;
        for (j = length; j > 0; j--) {
            c = data[length - j];
            c -= 0x48;
            c &= 0xFF; // Addition
            c ^= 0xFF;
            c = rollLeft(c, j);
            a = c;
            c ^= b;
            c -= j;
            c &= 0xFF; // Addition
            c = rollRight(c, 3);
            b = a;
            data[length - j] = c;
        }
    }
}

module.exports = {
    encrypt,
    decrypt
};