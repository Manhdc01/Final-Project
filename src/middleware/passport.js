// import all the things we need  
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/user')
require('dotenv').config()

const handleGoogleStrategy = (passport) => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_REDIRECT_LOGIN,
            },
            async (accessToken, refreshToken, profile, done) => {
                const newUser = {
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    name: profile.displayName,
                    image: profile.photos[0].value,
                    role: "customer",
                    accessToken: accessToken
                }
                try {
                    let user = await User.findOne({ googleId: profile.id })
                    if (user) {
                        done(null, user)
                    } else {
                        user = await User.create(newUser)
                        done(null, user)
                    }
                } catch (err) {
                    console.error(err)
                }
            }
        )
    );
};
const serializeUser = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
};
const deserializeUser = (passport) => {
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
};
module.exports = (passport) => {
    handleGoogleStrategy(passport)
    serializeUser(passport)
    deserializeUser(passport)
} 