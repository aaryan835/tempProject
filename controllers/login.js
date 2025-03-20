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
            if(rememberMe)
            {
                let accessToken = jwt.sign({id : UserRes.dataValues.id, email : UserRes.dataValues.email,rememberMe : true},JWT_SECRET_KEY,{expiresIn : "1h"})
                console.log(accessToken)
                let encryptedToken = encryptToken(accessToken)
                console.log(encryptedToken)

                console.log('implementing remember me refresh token : ')
                let refreshToken = jwt.sign({id : req.reqUser.id, email : req.reqUser.email,rememberMe : true},JWT_SECRET_KEY,{expiresIn : "30d"})
                console.log(refreshToken)
                let encryptedRefreshToken = encryptToken(accessToken)
                console.log(encryptedRefreshToken)
                return res.status(HTTP_STATUS_CODES.OK).json({message : 'User Created',accessToken : encryptedToken,refreshToken : encryptedRefreshToken})
            }
            else
            {
                let accessToken = jwt.sign({id : UserRes.dataValues.id, email : UserRes.dataValues.email,rememberMe : false},JWT_SECRET_KEY,{expiresIn : "1h"})
                console.log(accessToken)
                let encryptedToken = encryptToken(accessToken)
                console.log(encryptedToken)

                console.log('implementing refresh token when remember me is false : ')
                let refreshToken = jwt.sign({id : req.reqUser.id, email : req.reqUser.email,rememberMe : false},JWT_SECRET_KEY,{expiresIn : "7d"})
                console.log(refreshToken)
                let encryptedRefreshToken = encryptToken(accessToken)
                console.log(encryptedRefreshToken)
                return res.status(HTTP_STATUS_CODES.OK).json({message : 'User Created',accessToken : encryptedToken,refreshToken : encryptedRefreshToken})
            }
            
            
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
            if(rememberMe)
            {
                let accessToken = jwt.sign({id : req.reqUser.id, email : req.reqUser.email,rememberMe : true},JWT_SECRET_KEY,{expiresIn : "1h"})
                console.log(accessToken)
                let encryptedToken = encryptToken(accessToken)
                console.log(encryptedToken)

                console.log('implementing remember me refresh token : ')
                let refreshToken = jwt.sign({id : req.reqUser.id, email : req.reqUser.email,rememberMe : true},JWT_SECRET_KEY,{expiresIn : "30d"})
                console.log(refreshToken)
                let encryptedRefreshToken = encryptToken(accessToken)
                console.log(encryptedRefreshToken)
                return res.status(HTTP_STATUS_CODES.OK).json({message : 'Login Successfull',accessToken : encryptedToken,refreshToken : encryptedRefreshToken})
            }
            else
            {
                let accessToken = jwt.sign({id : req.reqUser.id, email : req.reqUser.email,rememberMe : false},JWT_SECRET_KEY,{expiresIn : "1h"})
                console.log(accessToken)
                let encryptedToken = encryptToken(accessToken)
                console.log(encryptedToken)

                console.log('implementing refresh token when remember me is false : ')
                let refreshToken = jwt.sign({id : req.reqUser.id, email : req.reqUser.email,rememberMe : false},JWT_SECRET_KEY,{expiresIn : "7d"})
                console.log(refreshToken)
                let encryptedRefreshToken = encryptToken(accessToken)
                console.log(encryptedRefreshToken)
                return res.status(HTTP_STATUS_CODES.OK).json({message : 'User Created',accessToken : encryptedToken,refreshToken : encryptedRefreshToken})
            }
            
           
        } catch (err) {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({message : 'internal server error',error : err})
        }
    },
    refreshAccessToken : async (req,res) => {
        try
        {
            console.log('inside refresh access token')
            console.log(req.user)
            if(req.user.rememberMe)
            {
                console.log('remember me is true')
                let accessToken = jwt.sign({id : req.user.id,email : req.user.email,rememberMe : true},JWT_SECRET_KEY,{expiresIn : '1h'})
                let refreshToken = jwt.sign({id : req.user.id,email : req.user.email,rememberMe : true},JWT_SECRET_KEY,{expiresIn : "30d"})
                let encryptedToken = encryptToken(accessToken)
                let encryptedRefreshToken = encryptToken(accessToken)
                // console.log(encryptedToken)
                return res.status(HTTP_STATUS_CODES.OK).json({message : 'new access token generated',accessToken : encryptedToken,refreshToken : encryptedRefreshToken})
            }
            else
            {
                console.log('remember me is false')
                let accessToken = jwt.sign({id : req.user.id,email : req.user.email,rememberMe : true},JWT_SECRET_KEY,{expiresIn : '1h'})
                let refreshToken = jwt.sign({id : req.user.id,email : req.user.email,rememberMe : true},JWT_SECRET_KEY,{expiresIn : "7d"})
                let encryptedToken = encryptToken(accessToken)
                let encryptedRefreshToken = encryptToken(refreshToken)
                // console.log(encryptedToken)
                return res.status(HTTP_STATUS_CODES.OK).json({message : 'new access token generated',accessToken : encryptedToken,refreshToken : encryptedRefreshToken})
            }
            
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