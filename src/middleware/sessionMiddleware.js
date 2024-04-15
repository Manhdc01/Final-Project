// sessionConfig.js
const session = require('express-session');

const sessionMiddleware = session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true, // Đảm bảo sử dụng HTTPS
        httpOnly: true, // Ngăn chặn truy cập từ mã JavaScript
        maxAge: 1000 * 60 * 60 * 24, // Thời gian sống của cookie (ở đây là 1 ngày)
        sameSite: 'strict' // Ngăn chặn các yêu cầu giữa các trang từ trang web khác
    } // Nếu bạn không sử dụng HTTPS, đặt giá trị này thành false
});

module.exports = sessionMiddleware;