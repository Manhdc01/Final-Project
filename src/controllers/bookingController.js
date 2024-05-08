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

const percentageNorAndVIPSeats = async (req, res) => {
    try {
        // Lấy tất cả các booking từ cơ sở dữ liệu
        const bookings = await Booking.find();

        // Tính tổng số ghế VIP và thường
        let totalVipSeats = 0;
        let totalNorSeats = 0;

        bookings.forEach(booking => {
            const seats = booking.seats.split(',');
            seats.forEach(seat => {
                if (seat.includes('(VIP)')) {
                    totalVipSeats++;
                } else {
                    totalNorSeats++;
                }
            });
        });

        // Tính phần trăm số ghế VIP và số ghế thường
        const totalSeats = totalVipSeats + totalNorSeats;
        const percentVipSeats = (totalVipSeats / totalSeats) * 100;
        const percentNorSeats = (totalNorSeats / totalSeats) * 100;

        // Trả về dữ liệu dưới dạng danh sách các đối tượng
        const result = [
            {
                Seat: "VIP",
                percentage: percentVipSeats
            },
            {
                Seat: "Normal",
                percentage: percentNorSeats
            }
        ];

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
const revenueByDay = async (req, res) => {
    // try {
    //     // Truy vấn tất cả các đặt vé từ cơ sở dữ liệu MongoDB
    //     const bookings = await Booking.find();

    //     // Tạo một đối tượng để lưu trữ tổng số vé và tổng doanh thu theo từng ngày
    //     const revenueByDay = {};

    //     // Lặp qua từng đặt vé và tính tổng số vé và tổng doanh thu theo từng ngày
    //     bookings.forEach(booking => {
    //         const bookingDate = new Date(booking.timeOfBooking).toISOString().split('T')[0];

    //         // Kiểm tra xem ngày này đã được thêm vào đối tượng revenueByDay chưa
    //         if (!revenueByDay[bookingDate]) {
    //             revenueByDay[bookingDate] = { totalTicketsSold: 0, totalRevenue: 0 };
    //         }

    //         // Đếm số vé bán ra và tính tổng doanh thu
    //         const seats = booking.seats.split(',').length;
    //         revenueByDay[bookingDate].totalTicketsSold += seats;
    //         revenueByDay[bookingDate].totalRevenue += booking.totalPrice;
    //     });

    //     res.status(200).json({ success: true, data: revenueByDay });
    // } catch (error) {
    //     console.error('Error calculating revenue by day:', error);
    //     res.status(500).json({ error: 'Internal server error' });
    // }
    try {
        // Truy vấn tất cả các đặt vé từ cơ sở dữ liệu MongoDB
        const bookings = await Booking.find();

        // Tạo một đối tượng để lưu trữ doanh thu vé VIP và vé thường theo từng ngày
        const revenueByDay = {};

        // Lặp qua từng đặt vé và tính doanh thu vé VIP và vé thường theo từng ngày
        bookings.forEach(booking => {
            const bookingDate = new Date(booking.timeOfBooking).toISOString().split('T')[0];

            // Tạo khóa cho đối tượng revenueByDay bằng ngày
            if (!revenueByDay[bookingDate]) {
                revenueByDay[bookingDate] = { date: bookingDate, totalVipRevenue: 0, totalNormalRevenue: 0 };
            }

            // Phân tách chuỗi ghế thành mảng nếu cần
            const seats = booking.seats.split(',');

            // Đếm số vé và tính doanh thu cho vé VIP và vé thường
            seats.forEach(seatInfo => {
                const [seatType, seatPrice] = seatInfo.split(':');  // Giả sử mỗi seatInfo có dạng 'VIP:120'
                if (seatType.includes('VIP')) {
                    revenueByDay[bookingDate].totalVipRevenue += 70000;
                } else {
                    revenueByDay[bookingDate].totalNormalRevenue += 50000;
                }
            });
        });

        // Chuyển đổi đối tượng thành mảng các giá trị
        const revenueByDayArray = Object.values(revenueByDay);

        res.status(200).json({ success: true, data: revenueByDayArray });
    } catch (error) {
        console.error('Error calculating VIP and Normal ticket revenue by day:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const revenueByDayForAdminCinema = async (req, res) => {
    // try {
    //     // Lấy thông tin rạp mà admin quản lý từ thông tin admin đăng nhập
    //     const cinemaId = req.user.cinema;

    //     // Truy vấn tất cả các đặt vé từ cơ sở dữ liệu MongoDB
    //     const bookings = await Booking.find();

    //     // Tạo một đối tượng để lưu trữ tổng số vé và tổng doanh thu theo từng ngày
    //     const revenueByDay = {};

    //     // Lặp qua từng đặt vé và tính tổng số vé và tổng doanh thu theo từng ngày
    //     for (const booking of bookings) {
    //         // Lấy thông tin về rạp từ bảng Showtime
    //         const showtime = await ShowTime.findById(booking.showtime);
    //         console.log('Showtime:', showtime, 'Cinema:', cinemaId)
    //         if (showtime && showtime.cinema.toString() === cinemaId.toString()) {
    //             const bookingDate = new Date(booking.timeOfBooking).toISOString().split('T')[0];

    //             // Kiểm tra xem ngày này đã được thêm vào đối tượng revenueByDay chưa
    //             if (!revenueByDay[bookingDate]) {
    //                 revenueByDay[bookingDate] = { totalTicketsSold: 0, totalRevenue: 0 };
    //             }

    //             // Đếm số vé bán ra và tính tổng doanh thu
    //             const seats = booking.seats.split(',').length;
    //             revenueByDay[bookingDate].totalTicketsSold += seats;
    //             revenueByDay[bookingDate].totalRevenue += booking.totalPrice;
    //         }
    //     }
    //     res.status(200).json({ success: true, data: revenueByDay });
    // } catch (error) {
    //     console.error('Error calculating revenue by day:', error);
    //     res.status(500).json({ error: 'Internal server error' });
    // }
    try {
        // Lấy thông tin rạp mà admin quản lý từ thông tin admin đăng nhập
        const cinemaId = req.user.cinema;

        // Truy vấn tất cả các đặt vé từ cơ sở dữ liệu MongoDB
        const bookings = await Booking.find();

        // Tạo một đối tượng để lưu trữ doanh thu vé VIP và vé thường theo từng ngày
        const revenueByDay = {};

        // Lặp qua từng đặt vé và tính doanh thu vé VIP và vé thường theo từng ngày
        for (const booking of bookings) {
            // Lấy thông tin về rạp từ bảng Showtime
            const showtime = await ShowTime.findById(booking.showtime);
            if (showtime && showtime.cinema.toString() === cinemaId.toString()) {
                const bookingDate = new Date(booking.timeOfBooking).toISOString().split('T')[0];

                // Chuyển đổi chuỗi ngày thành đối tượng Date
                const dateObj = new Date(bookingDate);
                const formattedDate = dateObj.toISOString().split('T')[0];

                // Kiểm tra xem ngày này đã được thêm vào đối tượng revenueByDay chưa
                if (!revenueByDay[formattedDate]) {
                    revenueByDay[formattedDate] = { date: formattedDate, totalVipRevenue: 0, totalNormalRevenue: 0 };
                }

                // Đếm số vé và tính doanh thu cho vé VIP và vé thường
                const seats = booking.seats.split(',');
                seats.forEach(seatInfo => {
                    const [seatType, seatPrice] = seatInfo.split(':');  // Giả sử mỗi seatInfo có dạng 'VIP:120'
                    if (seatType.includes('VIP')) {
                        revenueByDay[formattedDate].totalVipRevenue += 70000;
                    } else {
                        revenueByDay[formattedDate].totalNormalRevenue += 50000;
                    }
                });
            }
        }

        // Chuyển đổi đối tượng thành mảng các giá trị
        const revenueByDayArray = Object.values(revenueByDay);

        res.status(200).json({ success: true, data: revenueByDayArray });
    } catch (error) {
        console.error('Error calculating revenue by day:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
const percentageNorAndVIPSeatsForAdminCinema = async (req, res) => {
    // Lấy ID của rạp mà admin đang quản lý từ thông tin admin đăng nhập
    const cinemaId = req.user.cinema;

    // Truy vấn tất cả các booking từ cơ sở dữ liệu
    const bookings = await Booking.find();

    // Tính tổng số ghế VIP và thường cho rạp đó
    let totalVipSeats = 0;
    let totalNorSeats = 0;

    for (const booking of bookings) {
        // Lấy thông tin về showtime từ booking
        const showtime = await ShowTime.findById(booking.showtime);

        // Kiểm tra xem showtime và cinemaId đều tồn tại và có giá trị phù hợp
        if (showtime && showtime.cinema && showtime.cinema.toString() === cinemaId.toString()) {
            const seats = booking.seats.split(',');
            seats.forEach(seat => {
                if (seat.includes('(VIP)')) {
                    totalVipSeats++;
                } else {
                    totalNorSeats++;
                }
            });
        }
    }

    // Tính phần trăm số ghế VIP và số ghế thường
    const totalSeats = totalVipSeats + totalNorSeats;
    const percentVipSeats = (totalVipSeats / totalSeats) * 100;
    const percentNorSeats = (totalNorSeats / totalSeats) * 100;

    // Trả về dữ liệu dưới dạng danh sách các đối tượng
    const result = [
        {
            Seat: "VIP",
            percentage: percentVipSeats
        },
        {
            Seat: "Normal",
            percentage: percentNorSeats
        }
    ];

    res.status(200).json({
        success: true,
        data: result
    });
}
const totalTicketSoldInCinema = async (req, res) => {
    try {
        // Lấy ID của rạp mà admin đang quản lý từ thông tin admin đăng nhập
        const cinemaId = req.user.cinema;

        // Truy vấn tất cả các booking từ cơ sở dữ liệu
        const bookings = await Booking.find();

        // Tính tổng số vé đã bán ra cho rạp đó
        let totalTickets = 0;

        for (const booking of bookings) {
            // Lấy thông tin về showtime từ booking
            const showtime = await ShowTime.findById(booking.showtime);

            // Kiểm tra xem showtime và cinemaId đều tồn tại và có giá trị phù hợp
            if (showtime && showtime.cinema && showtime.cinema.toString() === cinemaId.toString()) {
                const seats = booking.seats.split(',');
                totalTickets += seats.length;
            }
        }

        res.status(200).json({
            success: true,
            data: totalTickets
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
const totalRevenueInCinema = async (req, res) => {
    try {
        // Lấy ID của rạp mà admin đang quản lý từ thông tin admin đăng nhập
        const cinemaId = req.user.cinema;
        // Truy vấn tất cả các booking từ cơ sở dữ liệu
        const bookings = await Booking.find();
        // Tính tổng doanh thu cho rạp đó
        let totalRevenue = 0;
        for (const booking of bookings) {
            // Lấy thông tin về showtime từ booking
            const showtime = await ShowTime.findById(booking.showtime);

            // Kiểm tra xem showtime và cinemaId đều tồn tại và có giá trị phù hợp
            if (showtime && showtime.cinema && showtime.cinema.toString() === cinemaId.toString()) {
                totalRevenue += booking.totalPrice;
            }
        }
        res.status(200).json({
            success: true,
            data: totalRevenue
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
module.exports = {
    saveUserBooking, postCreateBooking, getBookingByUser, seatStatus, percentageNorAndVIPSeats, revenueByDay,
    revenueByDayForAdminCinema, percentageNorAndVIPSeatsForAdminCinema, totalTicketSoldInCinema, totalRevenueInCinema
};
