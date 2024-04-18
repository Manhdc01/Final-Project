const mongoose = require('mongoose');

// Định nghĩa schema cho phòng chiếu
const roomSchema = new mongoose.Schema({
    cinema: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cinema',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    totalSeats: {
        type: Number,
        required: true
    }
}, { timestamps: true });
// Tạo model từ schema
const Room = mongoose.model('room', roomSchema);

module.exports = Room;