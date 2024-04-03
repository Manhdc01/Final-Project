const mongoose = require('mongoose');

// Define the Cinema schema
const movieSchema = new mongoose.Schema({
    name: { type: String, required: true },
    poster: {
        type: String
    },
    director: { type: String },
    performer: { type: String },
    category: { type: String },
    premiere: { type: Date },
    time: { type: Number },
    language: { type: String },
    trailerUrl: {
        type: String,
        validate: {
            validator: function (value) {
                const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
                return urlRegex.test(value);
            },
            message: props => `${props.value} is not a valid URL for trailer`
        }
    },

},
    {
        timestamps: true, ///reatedAT, updatedAt
    }
);

// Create a model from the schema
const Movie = mongoose.model('movie', movieSchema);

module.exports = Movie;