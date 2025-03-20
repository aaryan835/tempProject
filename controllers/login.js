const {HTTP_STATUS_CODES,SALT_ROUNDS,JWT_SECRET_KEY,AES_SECRET_KEY} = require('../utils/constant.js')
const {User} = require('../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const cryptoJs = require('crypto-js')
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
            let accessToken = jwt.sign({id : UserRes.dataValues.id, email : UserRes.dataValues.email},JWT_SECRET_KEY,{expiresIn : "1h"})
            console.log(accessToken)
            let encryptedToken = cryptoJs.AES.encrypt(accessToken,AES_SECRET_KEY).toString()
            // console.log(encryptedToken)
            if(rememberMe)
            {
                console.log('refresh token : ')
                let refreshToken = jwt.sign({id : req.reqUser.id, email : req.reqUser.email},JWT_SECRET_KEY,{expiresIn : "24h"})
                // console.log(refreshToken)
                let encryptedRefreshToken = cryptoJs.AES.encrypt(refreshToken,AES_SECRET_KEY).toString()
                // console.log(encryptedRefreshToken)
                res.cookie('refreshToken',encryptedRefreshToken,{maxAge : 24*60*60*1000})
            }
            return res.status(HTTP_STATUS_CODES.OK).json({message : 'User Created',token : encryptedToken})
        } catch (err) {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({message : 'internal server error',error : err})
        }
        
    },
    
    loginUser : async(req,res) => {
        try {
            console.log('inside login user function')
            let {email,password,rememberMe} = req.body
            console.log(req.reqUser)
            const isMatch = await bcrypt.compare(password,req.reqUser.password)
            if(!isMatch)
            {
                return res.status(HTTP_STATUS_CODES.UNAUTHORISED).json({message : 'invalid username or password'})
            }
            console.log(req.reqUser.id)
            console.log(req.reqUser.email)
            let accessToken = jwt.sign({id : req.reqUser.id, email : req.reqUser.email},JWT_SECRET_KEY,{expiresIn : "1h"})
            // console.log(accessToken)
            let encryptedToken = cryptoJs.AES.encrypt(accessToken,AES_SECRET_KEY).toString()
            // console.log(encryptedToken)

            if(rememberMe)
            {
                console.log('refresh token : ')
                let refreshToken = jwt.sign({id : req.reqUser.id, email : req.reqUser.email},JWT_SECRET_KEY,{expiresIn : "24h"})
                // console.log(refreshToken)
                let encryptedRefreshToken = cryptoJs.AES.encrypt(refreshToken,AES_SECRET_KEY).toString()
                // console.log(encryptedRefreshToken)
                res.cookie('refreshToken',encryptedRefreshToken,{maxAge : 24*60*60*1000})
            }
            // console.log(encryptedToken)
            return res.status(HTTP_STATUS_CODES.OK).json({message : 'LOGIN SUCCESSFULL',accessToken : encryptedToken})
        } catch (err) {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({message : 'internal server error',error : err})
        }
    },
    refreshAccessToken : async (req,res) => {
        try
        {
            console.log('inside refresh access token')
            console.log(req.user)
            const accessToken = jwt.sign({id : req.user.id,email : req.user.email},JWT_SECRET_KEY,{expiresIn : '1h'})
            let encryptedToken = cryptoJs.AES.encrypt(accessToken,AES_SECRET_KEY).toString()
            // console.log(encryptedToken)
            return res.status(HTTP_STATUS_CODES.OK).json({message : 'new access token generated',token : encryptedToken})
        }catch(err)
        {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({message : 'internal server error in refresh access token function',error : err})
        }
        
    }
}