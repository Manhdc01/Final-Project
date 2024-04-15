const mongoose = require('mongoose');

// Define the SeatPrice schema
const seatPriceSchema = new mongoose.Schema({
    seatType: { type: String, enum: ['Normal', 'VIP'], required: true }, // Loại ghế: Thường hoặc VIP
    price: { type: Number, required: true }, // Giá vé
},
    {
        timestamps: true // Thêm trường createdAt và updatedAt
    });

// Tạo mô hình từ schema
const SeatPrice = mongoose.model('seatprice', seatPriceSchema);

module.exports = SeatPrice;