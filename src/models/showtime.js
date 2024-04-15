const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'movie', required: true }, // Tham chiếu đến bảng phim
    cinema: { type: mongoose.Schema.Types.ObjectId, ref: 'cinema', required: true },
    startDate: { type: Date, required: true }, // Thời gian bắt đầu suất chiếu
    endDate: { type: Date, required: true }, // Thời gian kết thúc suất chiếu
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'room', required: true },
    status: { type: String, enum: ['Active', 'Stopped'], default: 'Active' } // Trạng thái suất chiếu: hoạt động hoặc đã dừng
}, { timestamps: true });

const ShowTime = mongoose.model('showtime', showtimeSchema);

module.exports = ShowTime;