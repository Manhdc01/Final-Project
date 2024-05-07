const Cinema = require('../models/cinema');
const Movie = require('../models/movie');
const Room = require('../models/room');
const User = require('../models/user');
const { postCreateCinemaService, getAllCinemaService, putUpdateCinemaService, deleteCinemaService } = require('../services/cinemaService')

const getAllCinema = async (req, res) => {
    try {
        const all = req.query.all; // Kiểm tra xem có yêu cầu trả về tất cả bộ phim không

        if (all === 'true') {
            // Nếu yêu cầu trả về tất cả bộ phim, bỏ qua phân trang
            const cinemaList = await Cinema.find()
            return res.status(200).json({ errorCode: 0, data: cinemaList });
        } else {
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
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errorCode: 1, message: "Internal server error" });
    }
}

const postCreateCinema = async (req, res) => {
    const { name, province, district, commune, address } = req.body;

    const existingCinema = await Cinema.findOne({ name });
    if (existingCinema) {
        return { success: false, message: 'The cinema name already exists' };
    }

    try {
        const cinemaData = { name, province, district, commune, address };
        const cinema = await postCreateCinemaService(cinemaData);

        if (!cinema.success) {
            return res.status(400).json({ errorCode: 1, message: cinema.message });
        }
        // Gọi hàm để tự động thêm các phòng chiếu cho rạp
        await addRoomsForCinema(cinema.data._id);

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

const getProvincesCinema = async (req, res) => {
    const cinemas = await Cinema.find();
    const provincesSet = new Set(cinemas.map(cinema => cinema.province));
    const provinces = Array.from(provincesSet);
    return res.status(200).json({
        errorCode: 0,
        data: provinces
    });
}

const getCinemaByProvince = async (req, res) => {
    const province = req.query.province;

    if (!province) {
        return res.status(400).json({ message: "Province or city is required" });
    }

    try {
        const cinemas = await Cinema.find({ province: province });
        res.json({ data: cinemas });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const addRoomsForCinema = async (cinemaId) => {
    try {
        // Tạo tự động các phòng chiếu cho rạp
        const roomsData = [
            { cinema: cinemaId, name: 'A1', totalSeats: 72 },
            { cinema: cinemaId, name: 'A2', totalSeats: 72 },
            { cinema: cinemaId, name: 'A3', totalSeats: 72 },
            { cinema: cinemaId, name: 'A4', totalSeats: 72 }
        ];
        await Room.insertMany(roomsData);
    } catch (error) {
        console.error('Error adding rooms for cinema:', error);
        throw error; // Ném lỗi để xử lý bên ngoài nếu cần
    }
}

const totalCinema = async (req, res) => {
    const totalCinema = await Cinema.countDocuments();
    return res.status(200).json({ errorCode: 0, data: totalCinema });
}
module.exports = {
    getAllCinema, postCreateCinema, putUpdateCinema, deleteCinema, getProvincesCinema, getCinemaByProvince,totalCinema
}