const mongoose = require("mongoose")
//định dạng hình thù database thông qua Schema
const customerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    dateOfBirth: String,
    hometown: String,
    phone: String,
    gender: String
},
    {
        timestamps: true, ///reatedAT, updatedAt
    }
);

const Customer = mongoose.model('customer', customerSchema);

module.exports = Customer