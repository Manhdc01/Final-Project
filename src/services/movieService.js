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

const putUpdateMovieService = async(id, name, poster, director, performer, category, premiere, time, language, trailerUrl)=> {
    try {
        let result = await Movie.updateOne({_id:id}, {name, poster, director, performer, category, premiere, time, language, trailerUrl})
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}

const deleteMovieService = async(id) => {
    try {
        let result = await Movie.deleteOne({_id:id})
        return result
    } catch (error) {
        console.log(error)
        return null
    }
    

}
module.exports = {
    postCreateMovieService, getAllMovieService, putUpdateMovieService, deleteMovieService
}