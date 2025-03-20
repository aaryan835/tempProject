const router = require('express').Router()
const userControllers = require('../controllers/login.js')
const {registerationValidators,loginValidators} = require('../validators/user-validators.js')
const {checkJwtToken} = require('./middleware.js')

router.post('/registerUser',registerationValidators,userControllers.registerUser)
router.post('/loginUser',loginValidators,userControllers.loginUser)
router.post('/refreshToken',checkJwtToken,userControllers.refreshAccessToken)
router.get('/getDetails',checkJwtToken,userControllers.getDetails)
module.exports = router