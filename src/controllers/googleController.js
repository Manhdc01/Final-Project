// require('dotenv').config()
// const passport = require('passport')
// const GoogleStrategy = require('passport-google-oauth20').Strategy
// const { generateAccessToken } = require('../services/authService')
// const jwt = require('jsonwebtoken')

// const loginWithGoogle = () => {
//     passport.use(new GoogleStrategy({
//         clientID: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         callbackURL: process.env.GOOGLE_REDIRECT_LOGIN
//     },
//         async function (accessToken, refreshToken, profile, cb) {
//             try {
//                 const newAccessToken = generateAccessToken(profile.id);
//                 console.log(">>>>>>>token", profile);
//                 cb(null, { accessToken: newAccessToken });
//             } catch (error) {
//                 cb(error, null);
//             }
//         }));
// }

// module.exports = {
//     loginWithGoogle
// }
