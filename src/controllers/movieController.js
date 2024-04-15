const { postCreateMovieService, getAllMovieService, putUpdateMovieService, deleteMovieService, getMovieNowShowingService, getMovieUpcomingService } = require('../services/movieService')
const { uploadSingleFile } = require('../services/fileService')

const getAllMovie = async (req, res) => {
    let movie = await getAllMovieService()
    return res.status(200).json({
        errorCode: 0,
        data: movie
    })
}
const postCreateMovie = async (req, res) => {
    let { name, director, performer, category, premiere, time, language, trailerUrl, status } = req.body;

    if (!req.files || !req.files.poster) {
        console.log("No file uploaded");
    } else {
        // Lưu file ảnh đến local
        let poster = req.files.poster;
        console.log(poster)
        let fileUploadResult = await uploadSingleFile(poster);
        let file_addr = fileUploadResult.path;
        console.log("Url image:", file_addr);

        // Sử dụng đường dẫn của file ảnh trong movieData
        let movieData = {
            name, poster: file_addr, director, performer, category, premiere, time, language, trailerUrl, status
        };

        let movie = await postCreateMovieService(movieData);
        return res.status(200).json({
            errorCode: 0,
            data: movie
        });
    }
}

const putupdateMovie = async (req, res) => {
    let { id, name, poster, director, performer, category, premiere, time, language, trailerUrl, status } = req.body

    let movieUpdate = await putUpdateMovieService(id, name, poster, director, performer, category, premiere, time, language, trailerUrl, status)
    return res.status(200).json({
        errorCode: 0,
        data: movieUpdate
    })
}

const deleteMovie = async (req, res) => {
    let id = req.params.id
    const deleteMovie = await deleteMovieService(id);
    return res.status(200).json({
        errorCode: 0,
        data: deleteMovie
    })
}

//get movie is now showing
const getMovieNowShowing = async (req, res) => {
    let movie = await getMovieNowShowingService()
    return res.status(200).json({
        errorCode: 0,
        data: movie
    })
}

//get movie is upcoming
const getMovieUpcoming = async (req, res) => {
    let movie = await getMovieUpcomingService()
    return res.status(200).json({
        errorCode: 0,
        data: movie
    })
}
module.exports = {
    getAllMovie, postCreateMovie, putupdateMovie, deleteMovie, getMovieNowShowing, getMovieUpcoming
}