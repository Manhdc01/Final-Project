const mongoose = require('mongoose');
const Room = require('./room');

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
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'movie'
    }
},
    {
        timestamps: true, ///reatedAT, updatedAt
    }
);

// Create a model from the schema
const Cinema = mongoose.model('cinema', cinemaSchema);

module.exports = Cinema;