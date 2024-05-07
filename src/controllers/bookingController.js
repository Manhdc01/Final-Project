const Booking = require("../models/booking");
const Room = require("../models/room");
const ShowTime = require("../models/showtime");
const User = require("../models/user");
const { postCreateBookingServcie, getBookingByUserService } = require("../services/bookingService");

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
        const { user, showtime, seats, time, date, totalPrice } = req.body;

        const booking = await Booking.create({
            user,
            showtime,
            timeOfBooking: date,
            seats,
            time,
            totalPrice
        });
        // Trả về response
        res.status(201).json({ message: 'Booking saved successfully', booking: booking });
    } catch (error) {
        // Xử lý lỗi
        console.error('Error saving booking:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while saving the booking' });
    }
}

const getBookingByUser = async (req, res) => {
    const userId = req.params.id; // Lấy userId từ request parameters

    try {
        // Gọi service để lấy thông tin booking của người dùng
        const bookings = await getBookingByUserService(userId);

        if (!bookings) {
            return res.status(404).json({ success: false, message: 'No bookings found for this user' });
        }

        return res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        console.error('Error getting bookings by user:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while getting the bookings by user' });
    }
};

// Endpoint để lấy trạng thái ghế cho một showtime cụ thể
const seatStatus = async (req, res) => {
    try {
        const { showtimeId, selectedTime, selectedDate } = req.query;
        console.log("Received showtimeId:", showtimeId, "time:", selectedTime, "date", selectedDate);
        // Truy vấn thông tin showtime dựa trên showtimeId

        const bookings = await Booking.find({
            showtime: showtimeId,
            timeOfBooking: selectedDate,
            time: selectedTime

        }).select('seats');  // Chỉ lấy trường 'seats'

        // Trích xuất tất cả ghế từ các booking
        const allSeats = bookings.map(booking => booking.seats).flat();

        // Trả về kết quả
        res.status(200).json({ success: true, data: allSeats });
    } catch (error) {
        console.error('Error retrieving seats:', error);
        res.status(500).json({ success: false, message: 'An error occurred while retrieving the seats' });
    }
}

module.exports = {
    saveUserBooking, postCreateBooking, getBookingByUser, seatStatus
};
