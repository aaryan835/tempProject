const cryptoJs = require('crypto-js')
const {AES_SECRET_KEY} = require('./constant')
const encryptToken = (token) => {

    return cryptoJs.AES.encrypt(token,AES_SECRET_KEY).toString()
    
}
const decryptToken = (token) => {
    return cryptoJs.AES.decrypt(token,AES_SECRET_KEY).toString(cryptoJs.enc.Utf8)
}
module.exports = {
    encryptToken,
    decryptToken
}