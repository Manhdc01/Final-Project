const mongoose = require('mongoose');

// Define the Cinema schema
const cinemaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
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