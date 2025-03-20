const router = require('express').Router()
const userControllers = require('../controllers/login.js')
const {registerationValidators,loginValidators} = require('../validators/user-validators.js')
const validateRefreshToken = require('./middleware.js')

router.post('/registerUser',registerationValidators,userControllers.registerUser)
router.post('/loginUser',loginValidators,userControllers.loginUser)
router.post('/refreshToken',validateRefreshToken,userControllers.refreshAccessToken)
module.exports = router