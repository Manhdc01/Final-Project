const mongoose = require('mongoose');

// Define the SeatPrice schema
const seatPriceSchema = new mongoose.Schema({
    seatType: { type: String, enum: ['Normal', 'VIP'], required: true }, 
    price: { type: Number, required: true }, 
},
    {
        timestamps: true 
    });

// Tạo mô hình từ schema
const SeatPrice = mongoose.model('seatprice', seatPriceSchema);

module.exports = SeatPrice;