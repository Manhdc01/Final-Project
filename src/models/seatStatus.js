const mongoose = require('mongoose');
const seatStatusSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'user'
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
    time: {
        type: String,
    },
    seatHold: { type: String },
    isHold: { type: Boolean, default: false },
    holdExpires: { type: Date }
},
    {
        timestamps: true
    });
const SeatStatus = mongoose.model('seatstatus', seatStatusSchema);
module.exports = SeatStatus;