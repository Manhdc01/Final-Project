const MovieCinema = require("../models/managemovie");
const User = require("../models/user");
const Category = require("../models/category");

// Controller để thêm phim vào rạp và bảng movieCinema
const addMovieToCinema = async (req, res) => {
    try {
        const { adminId, movieId } = req.body;

        // Lấy thông tin của admin từ cơ sở dữ liệu
        const admin = await User.findById(adminId);
        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }

        // Kiểm tra xem admin có vai trò là "admin cinema" không
        if (admin.role !== "admin cinema") {
            return res.status(403).json({ success: false, message: 'User is not an admin cinema' });
        }

        // Lấy thông tin rạp phim mà admin đang quản lý
        const cinema = admin.cinema;
        if (!cinema) {
            return res.status(404).json({ success: false, message: 'No cinema is managed by this admin' });
        }

        // Kiểm tra xem bộ phim đã được thêm vào rạp này chưa
        const existingRecord = await MovieCinema.findOne({ movieId, cinemaId: cinema });
        if (existingRecord) {
            return res.status(400).json({ success: false, message: 'Movie is already added to this cinema' });
        }

        // Tạo một bản ghi mới trong bảng MovieCinema và lưu vào cơ sở dữ liệu
        const movieCinema = await MovieCinema.create({ movie: movieId, cinema: cinema });

        // Trả về thông báo thành công
        return res.status(200).json({ success: true, data: movieCinema });
    } catch (error) {
        // Nếu có lỗi, trả về thông báo lỗi
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getAllMovieAdminCinema = async (req, res) => {
    try {
        const page = req.query.page || 1; // Trang mặc định là 1 nếu không có trang được chỉ định
        const limit = 5; // Số lượng phim trên mỗi trang

        const skip = (page - 1) * limit; // Số lượng bản ghi cần bỏ qua

        // Lấy tổng số phim
        const totalMovies = await MovieCinema.countDocuments();

        // Lấy danh sách phim theo trang và giới hạn
        const movieList = await MovieCinema.find().populate({
            path: 'movie',
            populate: { path: 'category' }
        }).populate('cinema').skip(skip).limit(limit);

        // Tính tổng số trang
        const totalPages = Math.ceil(totalMovies / limit);

        return res.status(200).json({ errorCode: 0, data: movieList, totalPages, currentPage: page });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errorCode: 1, message: "Internal server error" });
    }
}

module.exports = {
    addMovieToCinema,
    getAllMovieAdminCinema
}
