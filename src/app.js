require('dotenv').config()
const express = require('express')
const cors = require('cors')
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const webRoutes = require('./routes/web')
const path = require('path')
const configViewEngine = require('./config/viewEngine')
const { loginWithGoogle } = require('./controllers/googleController')
const connection = require('./config/database')

const app = express()
const port = process.env.PORT || 8888//port
const hostname = process.env.HOST_NAME


app.use(cors({
    origin: '*'
}))
// Cấu hình session middleware
app.use(session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Nếu bạn không sử dụng HTTPS, đặt giá trị này thành false
}));
//config req.body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

//config template engine
configViewEngine(app)
loginWithGoogle()

// Cấu hình serialize và deserialize user
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

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