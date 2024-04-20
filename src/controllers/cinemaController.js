const Cinema = require('../models/cinema');
const { postCreateCinemaService, getAllCinemaService, putUpdateCinemaService, deleteCinemaService } = require('../services/cinemaService')

const getAllCinema = async (req, res) => {
    try {
        const page = req.query.page || 1; // Trang mặc định là 1 nếu không có trang được chỉ định
        const limit = 5; // Số lượng người dùng trên mỗi trang

        const skip = (page - 1) * limit; // Số lượng bản ghi cần bỏ qua

        // Lấy tổng số người dùng
        const totalCinemas = await Cinema.countDocuments();

        // Lấy danh sách người dùng theo trang và giới hạn
        const cinemaList = await Cinema.find().skip(skip).limit(limit);

        // Tính tổng số trang
        const totalPages = Math.ceil(totalCinemas / limit);

        return res.status(200).json({ errorCode: 0, data: cinemaList, totalPages, currentPage: page });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errorCode: 1, message: "Internal server error" });
    }
}

const postCreateCinema = async (req, res) => {
    const { name, province, district, commune, address } = req.body;

    try {
        const cinemaData = { name, province, district, commune, address };
        const cinema = await postCreateCinemaService(cinemaData);

        if (!cinema.success) {
            return res.status(400).json({ errorCode: 1, message: cinema.message });
        }

        return res.status(200).json({ errorCode: 0, data: cinema.data });
    } catch (error) {
        console.error('Error creating cinema:', error);
        res.status(500).json({ errorCode: 1, message: 'Failed to create cinema' });
    }
}

const putUpdateCinema = async (req, res) => {
    try {
        const { id, name, province, district, commune, address } = req.body;
        // Gọi service để cập nhật thông tin của rạp chiếu phim
        const cinema = await putUpdateCinemaService(id, { name, province, district, commune, address });

        return res.status(200).json({ errorCode: 0, data: cinema });
    } catch (error) {
        console.error('Error in putUpdateCinema:', error);
        return res.status(500).json({ errorCode: 3, message: 'An error occurred during cinema update.' });
    }
}

const deleteCinema = async (req, res) => {
    let id = req.params.id
    let cinema = await deleteCinemaService(id)
    return res.status(200).json({
        errorCode: 0,
        data: cinema
    })
}

module.exports = {
    getAllCinema, postCreateCinema, putUpdateCinema, deleteCinema
}