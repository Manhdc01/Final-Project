const mongoose = require('mongoose');

// Define the Cinema schema
const directorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    nationality: {
        type: String,
        required: true
    }
},
    {
        timestamps: true, ///reatedAT, updatedAt
    }
);

// Create a model from the schema
const Director = mongoose.model('director', directorSchema);

module.exports = Director;