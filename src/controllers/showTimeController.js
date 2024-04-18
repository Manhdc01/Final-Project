const ShowTime = require('../models/showtime')
const { postCreateShowTimeService, getAllShowTimeService, updateShowTimeService, deleteShowTimeService } = require('../services/showTimeService')
//create showTime
const postCreateShowTime = async (req, res) => {
    let { cinema, movie, room, startDate, endDate, times } = req.body
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
    let id = req.body.id
    let showTime = await deleteShowTimeService(id)
    res.status(200).json({
        success: true,
        data: showTime
    })
}

module.exports = {
    postCreateShowTime, getAllShowTime, updateShowTime, deleteShowTime
}

