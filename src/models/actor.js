const mongoose = require('mongoose');

// Define the Cinema schema
const actorSchema = new mongoose.Schema({
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
const Actor = mongoose.model('actor', actorSchema);

module.exports = Actor;