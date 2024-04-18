const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    idSeats: {
        type: String,
        required: true
    },
    seatType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SeatPrice'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user' // Tham chiếu đến mô hình User để lấy thông tin user, bao gồm cả trường name
    }
});
const Ticket = mongoose.model('ticket', ticketSchema);

module.exports = Ticket;
