const mongoose = require('mongoose');
const seatStatusSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'user'
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