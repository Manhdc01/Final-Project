const mongoose = require('mongoose');

const movieCinemaSchema = new mongoose.Schema({
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'movie',
        required: true
    },
    cinema: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cinema',
        required: true
    }
});

const MovieCinema = mongoose.model('movieCinema', movieCinemaSchema);

module.exports = MovieCinema;