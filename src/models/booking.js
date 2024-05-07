const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    showtime: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'showtime',
        required: true
    },
    timeOfBooking: {
        type: Date,
        required: true
    },
    seats: {
        type: String,
    },
    time: {
        type: String,
    },
    totalPrice: {
        type: Number,
        required: true
    }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;