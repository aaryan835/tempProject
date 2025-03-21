const cryptoJS = require('crypto-js')
const {HTTP_STATUS_CODES,JWT_SECRET_KEY} = require('../utils/constant')
const jwt = require('jsonwebtoken')
const {decryptToken} = require('../utils/helper')

const checkJwtToken = async(req,res,next) => {
    try {
        console.log(req.headers)
        let token = req.headers['authorization'].split(' ')[1]
        console.log(token)
        if(!token)
        {
            return res.status(HTTP_STATUS_CODES.UNAUTHORISED).json({message : 'token not provided'})
        }
        console.log("run")
        let jwtToken = decryptToken(token)
        console.log('jwtToken : ', jwtToken)
        if(!jwtToken)
        {
            return res.status(HTTP_STATUS_CODES.UNAUTHORISED).json({message : 'refresh token not decoded properly'})
        }
        
        const res = await jwt.verify(jwtToken,JWT_SECRET_KEY)
        console.log('res')
        console.log(res)
        if(!res)
        {
            return res.status(HTTP_STATUS_CODES.UNAUTHORISED).json({message : 'invalid session please login again'})
        }
        req.user = res
        next()
    } catch (error) {
        console.log("process in catch block")
        // return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({message : 'internal server error'})
        return res.status(HTTP_STATUS_CODES.UNAUTHORISED).json({message : 'invalid session please login again'})

    }
    
}

module.exports = {
    checkJwtToken
}