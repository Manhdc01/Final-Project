const mongoose = require("mongoose")
//định dạng hình thù database thông qua Schema
const adminSchema = new mongoose.Schema({
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

//Override all methods

const Admin = mongoose.model('admin', adminSchema);


module.exports = Admin