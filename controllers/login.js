const {HTTP_STATUS_CODES,SALT_ROUNDS,JWT_SECRET_KEY,AES_SECRET_KEY} = require('../utils/constant.js')
const {User} = require('../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const cryptoJs = require('crypto-js')
const {encryptToken} = require('../utils/helper.js')
module.exports = {
    registerUser : async(req,res) => {
        try {
            console.log('inside register user function')
            let {email,password,firstName,lastName,rememberMe} = req.body
            
            // console.log(SALT_ROUNDS)
            let hashedPass = await bcrypt.hash(password,parseInt(SALT_ROUNDS))
            console.log('after password hashing')
            let fullName = `${firstName?.trim()} ${lastName?.trim()}`

            let userName = `${firstName?.trim()}_${lastName?.trim()}`
            let user = await User.findOne({ where : {user_name : userName}})
            while(user)
            {
                let num = 1
                userName = `${firstName?.trim()}_${lastName?.trim()}${num}`
                user = await User.findOne({where : {user_name : userName}})
                num = num + 1
            }
            const UserRes = await User.create({
                first_name : firstName?.trim(),
                last_name : lastName?.trim(),
                email : email,
                password : hashedPass,
                full_name : fullName,
                user_name : userName
            })
            console.log(UserRes)
            let payloads = {id : UserRes.dataValues.id,email : User.dataValues.email,rememberMe}
            let accessToken = jwt.sign(payloads,JWT_SECRET_KEY,{expiresIn : "1h"})
            let refreshTokenExpiry = rememberMe ? "30d" : "7d"
            let refreshToken = jwt.sign(payloads,JWT_SECRET_KEY,{expiresIn : refreshTokenExpiry})
            let encryptedAccessToken = encryptToken(accessToken)
            let encryptedRefreshToken = encryptToken(refreshToken)
            return res.status(HTTP_STATUS_CODES.OK).json({message : "User Registered",accessToken : encryptedAccessToken,refreshToken : encryptedRefreshToken})
            
        } catch (err) {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({message : 'internal server error',error : err})
        }
        
    },
    
    loginUser : async(req,res) => {
        try {
            console.log('inside login user function')
            let {email,password,rememberMe} = req.body
            
            const isMatch = await bcrypt.compare(password,req.reqUser.password)
            if(!isMatch)
            {
                return res.status(HTTP_STATUS_CODES.UNAUTHORISED).json({message : 'invalid username or password'})
            }
            console.log(req.reqUser)
            

            let payloads = {id : req.reqUser.id,email : req.reqUser.email,rememberMe}
            console.log(payloads)
            let accessToken = jwt.sign(payloads,JWT_SECRET_KEY,{expiresIn : '1h'})
            let encryptedAccessToken = encryptToken(accessToken)
            let refreshtokenExpiry = rememberMe ? "30d" : "7d"
            let refreshToken = jwt.sign(payloads,JWT_SECRET_KEY,{expiresIn : refreshtokenExpiry})
            let encryptedRefreshToken = encryptToken(refreshToken)

            return res.status(HTTP_STATUS_CODES.OK).json({message : 'User logged In',accessToken : encryptedAccessToken,refreshToken : encryptedRefreshToken,name : req.reqUser.full_name,email : req.reqUser.email})
            
        } catch (err) {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({message : 'internal server error',error : err})
        }
    },
    refreshAccessToken : async (req,res) => {
        try
        {
            console.log('inside refresh access token')
            console.log(req.user)

            let payloads = {id : req.user.id,email : req.user.email,rememberMe : req.user.rememberMe}
            console.log(payloads)
            let accessToken = jwt.sign(payloads,JWT_SECRET_KEY,{expiresIn : '1h'})
            let encryptedAccessToken = encryptToken(accessToken)
            let refreshTokenExpiry = req.user.rememberMe ? "30d" : "7d"
            let refreshToken = jwt.sign(payloads,JWT_SECRET_KEY,{expiresIn : refreshTokenExpiry})
            let encryptedRefreshToken = encryptToken(refreshToken)
            return res.status(HTTP_STATUS_CODES.OK).json({message : 'new access code generated',accessToken : encryptedAccessToken,refreshToken : encryptedRefreshToken})
            
        }catch(err)
        {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({message : 'internal server error in refresh access token function',error : err})
        }
        
    },
    getDetails : async(req,res) => {
        try {
            let id = req.user.id
            let userRes = await User.findOne({where : {id} ,
                attributes : {exclude : ['password','updated_at','created_at']}
            })
            if(!userRes)
            {
                return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({message : 'user corresponding to the acces token is not found'})
            }
            return res.status(HTTP_STATUS_CODES.OK).json({data : userRes})
        } catch (error) {
            
        }
    }
}