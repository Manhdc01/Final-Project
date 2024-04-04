const mongoose = require("mongoose")
//định dạng hình thù database thông qua Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 255,
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
        required: true,
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