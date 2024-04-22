require('dotenv').config()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const { generateAccessToken } = require('../services/authService')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const axios = require('axios')

const loginWithGoogle = () => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_REDIRECT_LOGIN,
    },
        async function (accessToken, refreshToken, profile, cb) {
            try {
                const existingUser = await User.findOne({ googleId: profile.id });
                if (existingUser) {
                    return cb(null, existingUser);
                }
                const newUser = new User({
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    name: profile.displayName,
                    image: profile.photos[0].value,
                    role: 'customer',  // Default role
                    accessToken: accessToken // Optionally store the token if needed for further Google API calls
                });
                await newUser.save();
                return cb(null, newUser);
            } catch (error) {
                return cb(error, null);
            }
        }));
}

module.exports = {
    loginWithGoogle
}
