const Booking = require("../models/booking");
const Room = require("../models/room");
const ShowTime = require("../models/showtime");
const User = require("../models/user");
const { postCreateBookingServcie } = require("../services/bookingService");

const postCreateBooking = async (req, res) => {
    try {
        const { user, showtime, timeOfBooking, totalPrice } = req.body;
        const dataBooking = {
            user,
            showtime,
            timeOfBooking,
            totalPrice
        };
        const booking = await postCreateBookingServcie(dataBooking);

        // Trả về kết quả thành công
        return res.status(200).json({ success: true, data: { booking } });
    } catch (error) {
        // Xử lý lỗi
        console.error('Error saving booking:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while saving the booking' });
    }
}

const saveUserBooking = async (req, res) => {
    try {
        const { user, showtime, timeOfBooking, totalPrice } = req.body;

        const foundUser = await User.findById(user);
        if (!foundUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const foundShowTime = await ShowTime.findById(showtime);
        if (!foundShowTime) {
            return res.status(404).json({ success: false, message: 'Show time not found' });
        }

        const room = await Room.findById(foundShowTime.room);
        if (!room) {
            return res.status(404).json({ success: false, message: 'Room not found' });
        }

        const calculatedTotalPrice = foundShowTime.price;

        const booking = await Booking.create({
            user,
            showtime,
            timeOfBooking,
            totalPrice: calculatedTotalPrice
        });

        // Trả về kết quả thành công
        return res.status(200).json({ success: true, data: { booking } });
    } catch (error) {
        // Xử lý lỗi
        console.error('Error saving booking:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while saving the booking' });
    }
}

module.exports = {
    saveUserBooking, postCreateBooking
};
