const MovieCinema = require("../models/managemovie");
const User = require("../models/user");
const Category = require("../models/category");

// Controller để thêm phim vào rạp và bảng movieCinema
const addMovieToCinema = async (req, res) => {
    try {
        const { movieId } = req.body;
        const cinema = req.user.cinema;
        // check existing
        const existingRecord = await MovieCinema.findOne({ movieId, cinema });
        if (existingRecord) {
            return res.status(400).json({ success: false, message: 'Movie is already added to this cinema' });
        }

        const movieCinema = await MovieCinema.create({ movie: movieId, cinema });
        return res.status(200).json({ success: true, data: movieCinema });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const deleteMovieFromCinema = async (req, res) => {
    try {
        const id = req.params.id;
        await MovieCinema.deleteOne({ _id: id });
        return res.status(200).json({ success: true, message: 'Movie deleted from cinema successfully' });
    } catch (error) {
        // Nếu có lỗi, trả về thông báo lỗi
        return res.status(500).json({ success: false, message: error.message });
    }
};

const updateMovieFromCinema = async (req, res) => {
    try {
        let { id, movie } = req.body;
        const cinema = req.user.cinema;

        const data = await MovieCinema.updateOne({ _id: id }, { movie: movie, cinema: cinema});
        return res.status(200).json({ success: true, data: data });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

}

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
const totalMovieForAdminCinema = async (req, res) => {
    try {
        const totalMovies = await MovieCinema.countDocuments();
        return res.status(200).json({ success: true, data: totalMovies });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
module.exports = {
    addMovieToCinema,
    getAllMovieAdminCinema,
    deleteMovieFromCinema,
    updateMovieFromCinema,
    totalMovieForAdminCinema
}
