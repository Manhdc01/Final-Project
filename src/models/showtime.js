const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
    cinema: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cinema',
        required: true
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'movie',
        required: true
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'room',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    times: {
        type: [String],
        required: true

    }
}, { timestamps: true });

const ShowTime = mongoose.model('showtime', showtimeSchema);

module.exports = ShowTime;