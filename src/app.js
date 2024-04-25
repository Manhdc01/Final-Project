require('dotenv').config()
const express = require('express')
const cors = require('cors')
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const webRoutes = require('./routes/web')
const path = require('path')
const MongoStore = require('connect-mongo');
const configViewEngine = require('./config/viewEngine')
const connection = require('./config/database')
const fileUpload = require('express-fileupload');
const handlePassport = require('./middleware/passport')(passport);
const paypal = require('paypal-rest-sdk');
const axios = require('axios');

const app = express()
const port = process.env.PORT || 8888//port
const hostname = process.env.HOST_NAME

app.use(cors("*"));
//config req.body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(fileUpload());

//config template engine
configViewEngine(app)
// Khởi tạo MongoStore với session
const store = MongoStore.create({
    mongoUrl: 'mongodb+srv://manhdc01:Manh2001@finalproject.xkp0shg.mongodb.net/final', // Thay đổi đường dẫn kết nối MongoDB nếu cần
    ttl: 14 * 24 * 60 * 60, // Thời gian sống của session trong giây (ở đây là 14 ngày)
});
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        store: store
    })
)
paypal.configure({
    'mode': 'sandbox', // hoặc 'live' nếu bạn muốn triển khai trong môi trường sản phẩm
    'client_id': 'ARJRbC7-R6guvxhINoQkkJzriCZ-OfmLAJ-RSYyqVmQ6IWG0K8l-VtVeFa9H6Z9j1QreCfyBxBXRqwJg',
    'client_secret': 'EGKFytFEyflJKpF-Y7piQXLPDE9r_o9YNCoKDTg6eVYZs9E4YTCeX9Wf92EkoEQHcMq6_yap1VcFPdeY'
});

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Sử dụng Passport
handlePassport;

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