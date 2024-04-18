const mongoose = require('mongoose');

const historyBookingSchema = new mongoose.Schema({
    bookingTime: {
        type: Date,
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Tham chiếu tới mô hình Accounts
        required: true
    },
    showtime: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'showtime', // Tham chiếu tới mô hình MovieShowTimes
        required: true
    }
});

const HistoryBooking = mongoose.model('historyBooking', historyBookingSchema);

module.exports = HistoryBooking;