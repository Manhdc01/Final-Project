require('dotenv').config()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const { generateAccessToken } = require('../services/authService')
const jwt = require('jsonwebtoken')

const loginWithGoogle = () => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_REDIRECT_LOGIN
    },
        function (accessToken, refreshToken, profile, cb) {
            const user = {
                email: profile.emails[0].value,
                name: profile.displayName,
                image: profile.photos[0].value,
                accessToken // You might want to securely send this or use it server-side
            };
            return cb(null, user);
        }
    ));
}

module.exports = {
    loginWithGoogle
}
