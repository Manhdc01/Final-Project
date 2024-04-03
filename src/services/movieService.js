const { model } = require("mongoose")
const Movie = require("../models/movie")



const postCreateMovieService = async (movieData) => {
    try {
        let result = await Movie.create(
            {
                name: movieData.name,
                poster: movieData.poster,
                director: movieData.director,
                performer: movieData.performer,
                category: movieData.category,
                premiere: movieData.premiere,
                time: movieData.time,
                language: movieData.language,
                trailerUrl: movieData.trailerUrl
            }
        )
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}
const getAllMovieService = async (req, res) => {
    try {
        let result = await Movie.find({})
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}

module.exports = {
    postCreateMovieService
}