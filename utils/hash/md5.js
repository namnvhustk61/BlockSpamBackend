const crypto = require('crypto')
const Strings = require('../../bin/Strings.js');
const md5 = text => {
    return crypto
        .createHash('md5')
        .update(text)
        .digest();
    }
    
const encrypt = (text) => {
    var secretKey = md5(Strings.KEY_HASH);
    console.log(secretKey.toString('base64'));
    secretKey = Buffer.concat([secretKey, secretKey.slice(0, 8)]); // properly expand 3DES key from 128 bit to 192 bit

    const cipher = crypto.createCipheriv('des-ede3', secretKey, '');
    const encrypted = cipher.update(text, 'utf8', 'base64');

    return encrypted + cipher.final('base64');
};
    
const decrypt = (encryptedBase64) => {
    var secretKey = md5(Strings.KEY_HASH);
    secretKey = Buffer.concat([secretKey, secretKey.slice(0, 8)]); // properly expand 3DES key from 128 bit to 192 bit
    const decipher = crypto.createDecipheriv('des-ede3', secretKey, '');
    let decrypted = decipher.update(encryptedBase64, 'base64');
    decrypted += decipher.final();
    return decrypted;
};
module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;

