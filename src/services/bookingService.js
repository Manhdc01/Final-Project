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

const getSalesDataByDayService = async () => {
    try {
        const result = await Booking.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$timeOfBooking" },
                        month: { $month: "$timeOfBooking" },
                        day: { $dayOfMonth: "$timeOfBooking" }
                    },
                    totalSales: { $sum: "$totalPrice" },
                    totalTickets: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
            }
        ]);

        return result.map(item => ({
            date: new Date(item._id.year, item._id.month - 1, item._id.day),
            totalSales: item.totalSales,
            totalTickets: item.totalTickets
        }));
    } catch (error) {
        console.error("Error in getting sales data by day:", error);
        throw error;
    }
};

module.exports = {
    postCreateBookingServcie, getBookingByUserService, getSalesDataByDayService
}