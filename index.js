const express = require('express')
const dotenv = require('dotenv')
const stage = process.env.NODE_ENV || 'dev'
const envPath = `.env.${stage}`
console.log(envPath)
dotenv.config({path : envPath})

let cookieParser = require('cookie-parser')
const { PORT } = require('./utils/constant')
const db = require('./models/index')
const apiRoutes = require('./router/auth')
let app = express()

// middleware to parse json and cookies
app.use(express.json())
app.use(cookieParser())

app.use('/auth',apiRoutes)

let startServer = async() => {
    await db.sequelize.authenticate()
    console.log('database connected')

    app.listen(`${PORT}`,(req,res) => {
        console.log(`server is running on port ${PORT}`)
    })
}
startServer()