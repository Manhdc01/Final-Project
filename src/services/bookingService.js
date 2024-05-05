const Booking = require("../models/booking");

const postCreateBookingServcie = async (dataBooking) => {
    const result = await Booking.create(dataBooking);
    return result;
}

const getBookingByUserService = async (userId) => {
    try {
        // Thực hiện truy vấn trong cơ sở dữ liệu để lấy thông tin booking của người dùng có userId tương ứng
        const bookings = await Booking.find({ user: userId }).populate({
            path: 'showtime',
            populate: [
                { path: 'movie' }, // Populate thông tin của movie từ showtime
                { path: 'room' },
                { path: 'cinema' } // Populate thông tin của room từ showtime
            ]
        }); // Giả sử Booking là một model và showtime là một trường reference

        return bookings;
    } catch (error) {
        console.error('Error getting bookings by user:', error);
        throw new Error('An error occurred while getting the bookings by user');
    }
};

module.exports = {
    postCreateBookingServcie, getBookingByUserService
}