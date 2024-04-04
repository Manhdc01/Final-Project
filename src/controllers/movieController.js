const { postCreateMovieService, getAllMovieService, putUpdateMovieService,deleteMovieService } = require('../services/movieService')

const getAllMovie = async (req, res) => {
    let movie = await getAllMovieService()
    return res.status(200).json({
        errorCode: 0,
        data: movie
    })
}
const postCreateMovie = async (req, res) => {
    let { name, poster, director, performer, category, premiere, time, language, trailerUrl } = req.body
    let movieData = {
        name, poster, director, performer, category, premiere, time, language, trailerUrl
    }
    let movie = await postCreateMovieService(movieData)

    return res.status(200).json({
        errorCode: 0,
        data: movie
    })
}

const putupdateMovie = async (req, res) => {
    let { id, name, poster, director, performer, category, premiere, time, language, trailerUrl } = req.body

    let movieUpdate = await putUpdateMovieService(id, name, poster, director, performer, category, premiere, time, language, trailerUrl)
    return res.status(200).json({
        errorCode:0,
        data: movieUpdate
    })
}

const deleteMovie = async(req, res) => {
    let id = req.params.id
    const deleteMovie = await movieService.deleteMovieService(id);
    return res.status(200).json({
        errorCode:0,
        data: deleteMovie
    })
}
module.exports = {
    getAllMovie, postCreateMovie, putupdateMovie, deleteMovie
}