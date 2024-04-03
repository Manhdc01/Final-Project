require('dotenv').config()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const { upsertUserSocialMedia, generateAccessToken } = require('../services/authService')
const jwt = require('jsonwebtoken')

const loginWithGoogle = () => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_REDIRECT_LOGIN
    },
        async function (accessToken, refreshToken, profile, cb) {
            try {
                const token = ""
                const typeAccount = 'Google';
                console.log(">>>>>>>token", accessToken);
                const newAccessToken = generateAccessToken(profile.id);
                let dataRaw = {
                    // token: accessToken.token,
                    name: profile.displayName,
                    email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : "",
                    googleId: profile.id
                };
                let user = await upsertUserSocialMedia(typeAccount, dataRaw);
                cb(null, { user, accessToken: newAccessToken });
            } catch (error) {
                cb(error, null);
            }
        }));
}

module.exports = {
    loginWithGoogle
}
