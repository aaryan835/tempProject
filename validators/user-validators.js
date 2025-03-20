const {HTTP_STATUS_CODES} = require('../utils/constant')
const {User}= require('../models')
const validateFields = (fields) => {
    let errors = {}
    for(let field of fields)
    {
        const {key,value,required,minlength,regex} = field
        if(required && !value)
        {
            errors[key] = 'required'
        }
        if(minlength && value?.trim().length < minlength)
        {
            errors[key] = `${key} value should be of ${minlength} length`
        }
        if(regex && !regex.test(value.trim()))
        {
            errors[key] = `${key} is not valid`
        }
    }
    return errors   
}
let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;

const registerationValidators = async(req,res,next) => {
    let {firstName,lastName,email,password} = req.body

    let errors = validateFields([
        {key : "firstName",value : firstName,required : true,minlength : 3},
        {key : "lastName",value : lastName,required : true},
        {key : "email",value : email,required : true,regex : emailRegex},
        {key : "password",value : password ,required : true,regex : passwordRegex}
    ])

    if(Object.keys(errors).length > 0)
    {
        return res.status(HTTP_STATUS_CODES.UNPROCESSABLE_CONTENT).json({message : 'Valdation Errors',errors : errors})
    }

    let userDbRes = await User.findOne({where : {email : email}})
    if(userDbRes)
    {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({message : 'User already exists'})
    }
    console.log('hello')
    next()
}

const loginValidators = async(req,res,next) => {
    let {email,password} = req.body

    let errors = validateFields([
        {key : "email",value : email,required : true,regex : emailRegex},
        {key : "password",value : password,required : true,regex : passwordRegex}
    ])

    if(Object.keys(errors).length > 0)
    {
        return res.status(HTTP_STATUS_CODES.UNPROCESSABLE_CONTENT).json({message : 'validation errors',errors})
    }

    let UserRes = await User.findOne({where : {email : email}})

    if(!UserRes)
    {
        return res.status(HTTP_STATUS_CODES.UNAUTHORISED).json({message : 'invalid email or password'})
    }
    // console.log(UserRes)
    req.reqUser = UserRes.dataValues
    next()
}

module.exports = {
    registerationValidators,
    loginValidators
}