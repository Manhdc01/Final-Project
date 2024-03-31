const mongoose = require('mongoose');

// Define the Cinema schema
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
},
    {
        timestamps: true, ///reatedAT, updatedAt
    }
);

// Create a model from the schema
const Category = mongoose.model('category', categorySchema);

module.exports = Category;