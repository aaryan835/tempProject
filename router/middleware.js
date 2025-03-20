const cryptoJS = require('crypto-js')
const {HTTP_STATUS_CODES,JWT_SECRET_KEY} = require('../utils/constant')
const jwt = require('jsonwebtoken')
const {decryptToken} = require('../utils/helper')

const checkJwtToken = (req,res,next) => {
    console.log(req.headers)
    let token = req.headers['authorization'].split(' ')[1]
    console.log(token)
    if(!token)
    {
        return res.status(HTTP_STATUS_CODES.UNAUTHORISED).json({message : 'token not provided'})
    }
    
    let jwtToken = decryptToken(token)
    if(!jwtToken)
    {
        return res.status(HTTP_STATUS_CODES.UNAUTHORISED).json({message : 'refresh token not decoded properly'})
    }
    
    jwt.verify(jwtToken,JWT_SECRET_KEY,(err,user) => {
        if(err)
        {
            return res.status(HTTP_STATUS_CODES.FORBIDDEN).json({message : `refresh token has expired`})
        }
        req.user = user
        next()
    })
}

module.exports = {
    checkJwtToken
}