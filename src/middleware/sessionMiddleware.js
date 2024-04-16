// // sessionConfig.js
// const session = require('express-session');

// const sessionMiddleware = () => {
//     return session({
//         secret: process.env.SECRET_SESSION,
//         resave: false,
//         saveUninitialized: true,
//         cookie: {
//             secure: true,
//             httpOnly: true,
//             maxAge: 1000 * 60 * 60 * 24,
//             sameSite: 'strict'
//         }
//     });
// };

// module.exports = sessionMiddleware;