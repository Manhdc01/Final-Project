const mongoose = require('mongoose');

// Define the Cinema schema
const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    director: {
        type: String
    },
    performer: {
        type: String
    },
    category: {
        type: String
    },
    premiere: {
        type: Date
    },
    time: {
        type: Number
    },
    language: {
        type: String
    }
},
    {
        timestamps: true, ///reatedAT, updatedAt
    }
);

// Create a model from the schema
const Movie = mongoose.model('movie', movieSchema);

module.exports = Movie;