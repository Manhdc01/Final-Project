const mongoose = require('mongoose');

const historyTicketSchema = new mongoose.Schema({
    seatsCode: {
        type: String,
        required: true
    },
    historyBooking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'historyBooking', // Tham chiếu tới mô hình HistoryBooking
        required: true
    }
});

const HistoryTicket = mongoose.model('historyTicket', historyTicketSchema);

module.exports = HistoryTicket;