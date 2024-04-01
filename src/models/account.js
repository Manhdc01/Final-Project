const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    IDStaff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff'
    },
    IDAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    IDCustomer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
    }
}, {
    timestamps: true
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;