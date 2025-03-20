const cryptoJS = require('crypto-js')
const {AES_SECRET_KEY,HTTP_STATUS_CODES,JWT_SECRET_KEY} = require('../utils/constant')
const jwt = require('jsonwebtoken')
const validateRefreshToken = (req,res,next) => {
    let refreshToken = req.cookies.refreshToken
    if(!refreshToken)
    {
        return res.status(HTTP_STATUS_CODES.UNPROCESSABLE_CONTENT).json({message : 'refresh token not provided'})
    }
    // console.log(refreshToken)
    let jwtRefreshToken = cryptoJS.AES.decrypt(refreshToken,AES_SECRET_KEY).toString(cryptoJS.enc.Utf8)
    // console.log('nc')
    // console.log(jwtRefreshToken)

    if(!jwtRefreshToken)
    {
        return res.status(HTTP_STATUS_CODES.UNPROCESSABLE_CONTENT).json({message : 'refresh token not decoded properly'})
    }

    jwt.verify(jwtRefreshToken,JWT_SECRET_KEY,(err,user) => {
        if(err)
        {
            return res.status(HTTP_STATUS_CODES.FORBIDDEN).json({message : `refresh token has expired`})
        }
        req.user = user
        next()
    })
}

module.exports = validateRefreshToken