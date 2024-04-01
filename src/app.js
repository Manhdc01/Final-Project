require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const webRoutes = require('./routes/web')
const path = require('path')
const configViewEngine = require('./config/viewEngine')
const connection = require('./config/database')

const app = express()
const port = process.env.PORT || 8888//port
const hostname = process.env.HOST_NAME


app.use(cors({
    origin: '*'
}))
//config req.body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

//config template engine
configViewEngine(app)


app.use('/', webRoutes)

    ; (async () => {
        //test connection
        try {
            await connection()
            app.listen(port, hostname, () => {
                console.log(`Example app listening on port ${port}`)
            })
        } catch (error) {
            console.log(">>Error connection to DB", error)
        }
    })();