const mongoose = require("mongoose")
//định dạng hình thù database thông qua Schema
const staffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    dateOfBirth: String,
    hometown: String,
    phone: String,
    gender: String,
    position: String,
},
    {
        timestamps: true, ///reatedAT, updatedAt
    }
);

const Staff = mongoose.model('staff', staffSchema);

module.exports = Staff