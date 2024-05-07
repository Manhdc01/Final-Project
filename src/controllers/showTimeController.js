const ShowTime = require('../models/showtime')
const { postCreateShowTimeService, getAllShowTimeService, updateShowTimeService, deleteShowTimeService,
    getAllShowTimesForAdminCinemaService, postCreateShowTimeForAdminService,putUpdateShowTimeForAdminService
} = require('../services/showTimeService')
//create showTime
const postCreateShowTime = async (req, res) => {
    let { cinema, movie, room, startDate, endDate, times } = req.body
    console.log('Received room data:', room);
    let showTimeData = {
        cinema,
        movie,
        room,
        startDate,
        endDate,
        times
    }
    let showTime = await postCreateShowTimeService(showTimeData)
    res.status(200).json({
        success: true,
        data: showTime
    })
}

const getAllShowTime = async (req, res) => {
    try {
        const page = req.query.page || 1; // Trang mặc định là 1 nếu không có trang được chỉ định
        const limit = 5; // Số lượng người dùng trên mỗi trang

        const skip = (page - 1) * limit; // Số lượng bản ghi cần bỏ qua

        // Lấy tổng số người dùng
        const totalShowTime = await ShowTime.countDocuments();

        // Lấy danh sách người dùng theo trang và giới hạn
        const showTimeList = await ShowTime.find().populate('movie').populate('cinema').populate('room').skip(skip).limit(limit);

        // Tính tổng số trang
        const totalPages = Math.ceil(totalShowTime / limit);

        return res.status(200).json({ errorCode: 0, data: showTimeList, totalPages, currentPage: page });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errorCode: 1, message: "Internal server error" });
    }
}

const updateShowTime = async (req, res) => {
    let { id, cinema, movie, room, startDate, endDate, times } = req.body
    let showTimeData = {
        cinema,
        movie,
        room,
        startDate,
        endDate,
        times
    }
    let showTime = await updateShowTimeService(id, showTimeData)
    res.status(200).json({
        success: true,
        data: showTime
    })
}

const deleteShowTime = async (req, res) => {
    let id = req.params.id
    let showTime = await deleteShowTimeService(id)
    res.status(200).json({
        success: true,
        data: showTime
    })
}
const showTimeByDate = async (req, res) => {
    try {
        const showTimes = await ShowTime.find()
            .populate('movie')
            .populate('room')
            .populate('cinema');

        const dailyShowTimes = {};

        showTimes.forEach(showTime => {
            const startDate = new Date(showTime.startDate);
            const endDate = new Date(showTime.endDate);

            // Tạo một danh sách các ngày từ startDate đến endDate
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                const dateKey = d.toISOString().split('T')[0];
                if (!dailyShowTimes[dateKey]) {
                    dailyShowTimes[dateKey] = [];
                }

                // Thêm suất chiếu vào mỗi ngày phù hợp
                dailyShowTimes[dateKey].push({
                    id: showTime._id,
                    times: showTime.times,
                    movie: showTime.movie.name, // Trả về tên phim
                    room: showTime.room.name, // Trả về tên phòng chiếu
                    cinema: showTime.cinema.name // Trả về tên rạp
                });
            }
        });

        res.json({ data: dailyShowTimes });
    } catch (error) {
        console.error('Error fetching showtimes for all dates:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
const showTimeByMovieId = async (req, res) => {
    try {
        console.log("Received movieId:", req.params.movieId);
        const movieId = req.params.movieId; // Get the movieId from the request parameters

        // Find showtimes for the specific movie
        const showTimes = await ShowTime.find({ movie: movieId })
            .populate('movie')
            .populate('room')
            .populate('cinema');
        const dailyShowTimes = {};

        showTimes.forEach(showTime => {
            const startDate = new Date(showTime.startDate);
            const endDate = new Date(showTime.endDate);

            // Tạo một danh sách các ngày từ startDate đến endDate
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                const dateKey = d.toISOString().split('T')[0];
                if (!dailyShowTimes[dateKey]) {
                    dailyShowTimes[dateKey] = [];
                }

                // Thêm suất chiếu vào mỗi ngày phù hợp
                dailyShowTimes[dateKey].push({
                    id: showTime._id,
                    times: showTime.times,
                    movie: showTime.movie.name, // Trả về tên phim
                    room: showTime.room.name, // Trả về tên phòng chiếu
                    cinema: showTime.cinema.name // Trả về tên rạp
                });
            }
        });

        res.json({ data: dailyShowTimes });
    } catch (error) {
        console.error('Error fetching showtimes for all dates:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const checkForOverlap = async (req, res) => {
    const { cinema, room, startDate, endDate } = req.query;

    try {
        const showTimes = await ShowTime.find({
            cinema: cinema,
            room: room,
            startDate: { $lte: new Date(endDate) },
            endDate: { $gte: new Date(startDate) },
        })

        res.status(200).json({ data: showTimes });
    } catch (error) {
        console.error("Error checking for overlap:", error);
        res.status(500).json({ message: "An error occurred while checking for overlap" });
    }
}
const getAllShowTimesForAdminCinema = async (req, res) => {
    const adminCinemaId = req.user.id; // Lấy ID của tài khoản admin-cinema từ thông tin đăng nhập
    console.log("Received adminCinemaId:", adminCinemaId)
    const cinemaId = req.user.cinema // Lấy ID của rạp từ URL
    console.log("Received cinemaId:", cinemaId)

    try {
        // Gọi hàm xử lý logic để lấy tất cả suất chiếu của tài khoản admin-cinema quản lý rạp cụ thể
        const showTimes = await getAllShowTimesForAdminCinemaService(cinemaId);
        // Trả về kết quả cho client
        res.status(200).json({ data: showTimes });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const postCreateShowTimeForAdminCinema = async (req, res) => {
    const { cinema, movie, room, startDate, endDate, times } = req.body;
    const showTimeData = {
        cinema,
        movie,
        room,
        startDate,
        endDate,
        times
    };
    const showTime = await postCreateShowTimeForAdminService(showTimeData);
    res.status(200).json({ data: showTime });
};
const putUpdateShowTimeForAdminCinema = async (req, res) => {
    const { id, cinema, movie, room, startDate, endDate, times } = req.body;

    const showTimeData = {
        cinema,
        movie,
        room,
        startDate,
        endDate,
        times
    };
    const showTime = await putUpdateShowTimeForAdminService(id, showTimeData);
    res.status(200).json({ data: showTime });
};

module.exports = {
    postCreateShowTime, getAllShowTime, updateShowTime, deleteShowTime, showTimeByDate, showTimeByMovieId, checkForOverlap,
    getAllShowTimesForAdminCinema, postCreateShowTimeForAdminCinema
}

