const mongoose = require("mongoose")
//định dạng hình thù database thông qua Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 255,
    },
    image: {
        type: String
    },
    phone: {
        type: String,
        maxLength: 10
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxLength: 255,
        validate: {
            validator: function (value) {
                // Check for valid email format
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: function () { return !this.googleId; }, // Required unless Google ID is present
        minlength: 6
    },
    dateOfBirth: {
        type: Date,
    },
    gender: {
        type: String,
    },
    role: {
        type: String,
    },
    googleId: {  // Storing Google ID for users logging in through Google
        type: String,
        unique: true,
        sparse: true // Sparse is true because not all users will have a Google ID
    },
    accessToken: {
        type: String,
    },
    resetToken: {
        type: String,
    },
    resetTokenExpiresAt: {
        type: Date,
    }
}, {
    timestamps: true
});

//Override all methods

const User = mongoose.model('user', userSchema);


module.exports = User