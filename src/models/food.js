// Import Mongoose
const mongoose = require('mongoose');

// Định nghĩa schema cho mục đồ ăn/nước uống
const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

// Tạo model từ schema
const Food = mongoose.model('food', foodSchema);

module.exports = Food