const mongoose = require('mongoose');

// Định nghĩa schema cho phòng chiếu
const roomSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Tên của phòng chiếu
    cinema: { type: mongoose.Schema.Types.ObjectId, ref: 'cinema', required: true }, // Tham chiếu đến rạp chiếu
}, { timestamps: true });

// Tạo model từ schema
const Room = mongoose.model('room', roomSchema);

module.exports = Room;