const mongoose = require('mongoose');

// Define the Cinema schema
const cinemaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    commune: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
},
    {
        timestamps: true, ///reatedAT, updatedAt
    }
);

// Create a model from the schema
const Cinema = mongoose.model('cinema', cinemaSchema);

module.exports = Cinema;