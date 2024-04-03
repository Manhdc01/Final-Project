const { postCreateMovieService } = require('../services/movieService')

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

module.exports = {
    getAllMovie, postCreateMovie
}