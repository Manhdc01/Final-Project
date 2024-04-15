const { postCreateMovieService, getAllMovieService, putUpdateMovieService, deleteMovieService, getMovieNowShowingService, getMovieUpcomingService,
    uploadImage, getMovieTrailerService } = require('../services/movieService')
const { uploadSingleFile } = require('../services/fileService')
const fs = require('fs')

const getAllMovie = async (req, res) => {
    let movie = await getAllMovieService()
    return res.status(200).json({
        errorCode: 0,
        data: movie
    })
}
const postCreateMovie = async (req, res) => {
    let { name, director, performer, category, premiere, time, language, trailerUrl, status } = req.body;
    let dataMovie = { name, director, performer, category, premiere, time, language, trailerUrl, status }
    let imageUploadResult = {}
    if (!req.files || !req.files.poster) {
        console.log("No file uploaded");
    } else {
        // Lưu file ảnh đến local
        let poster = req.files.poster;
        // console.log(poster)
        let fileUploadResult = await uploadSingleFile(poster);
        let file_addr = fileUploadResult.path;
        // console.log("Url image:", file_addr);
        // upload to imgur
        imageUploadResult = await uploadImage(file_addr);
        // console.log(">>>>check", imageUploadResult)
        dataMovie.poster = imageUploadResult.imageUrl
        // console.log(dataMovie.poster)
        // remove file from local
        try {
            fs.unlinkSync(file_addr);
        }
        catch (err) {
            console.log(err)
        }

        let movie = await postCreateMovieService(dataMovie);
        return res.status(200).json({
            errorCode: 0,
            data: movie
        });
    }
}

const putupdateMovie = async (req, res) => {
    let { id, name, director, performer, category, premiere, time, language, trailerUrl, status } = req.body
    let dataMovie = { name, director, performer, category, premiere, time, language, trailerUrl, status }
    let imageUploadResult = {}
    if (!req.files || !req.files.poster) {
        console.log("No file uploaded");
    } else {
        // Lưu file ảnh đến local
        let poster = req.files.poster;
        // console.log(poster)
        let fileUploadResult = await uploadSingleFile(poster);
        let file_addr = fileUploadResult.path;
        // console.log("Url image:", file_addr);
        // upload to imgur
        imageUploadResult = await uploadImage(file_addr);
        // console.log(">>>>check", imageUploadResult)
        dataMovie.poster = imageUploadResult.imageUrl
        // console.log(dataMovie.poster)
        // remove file from local
        try {
            fs.unlinkSync(file_addr);
        }
        catch (err) {
            console.log(err)
        }

        let movie = await putUpdateMovieService(id, dataMovie);
        return res.status(200).json({
            errorCode: 0,
            data: movie
        });
    }
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

//get movie trailer
const getMovieTrailer = async (req, res) => {
    let movieId = req.params.movieId
    try {
        const trailerUrl = await getMovieTrailerService(movieId)
        return res.status(200).json({
            errorCode: 0,
            data: trailerUrl
        });
    } catch (error) {
        return res.status(500).json({
            errorCode: 1,
            message: 'Error retrieving movie trailer'
        });
    }
}
module.exports = {
    getAllMovie, postCreateMovie, putupdateMovie, deleteMovie, getMovieNowShowing, getMovieUpcoming, getMovieTrailer
}