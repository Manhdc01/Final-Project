const mongoose = require('mongoose');

// Define the Cinema schema
const cinemaSchema = new mongoose.Schema({
    cinemaID: {
        type: String, // or Number depending on your needs
        required: true
    },
    cinemaName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    }
});

// Create a model from the schema
const Cinema = mongoose.model('cinema', cinemaSchema);

module.exports = Cinema;