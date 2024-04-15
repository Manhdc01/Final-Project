const { model } = require("mongoose")
const Movie = require("../models/movie")

const postCreateMovieService = async (movieData) => {
    try {
        let result = await Movie.create(movieData)
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

const putUpdateMovieService = async (id, name, poster, director, performer, category, premiere, time, language, trailerUrl, status) => {
    try {
        let result = await Movie.updateOne({ _id: id }, { name, poster, director, performer, category, premiere, time, language, trailerUrl, status })
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}

const deleteMovieService = async (id) => {
    try {
        let result = await Movie.deleteOne({ _id: id })
        return result
    } catch (error) {
        console.log(error)
        return null
    }


}

const getMovieNowShowingService = async () => {
    try {
        let result = await Movie.find({ status: "Now Showing" })
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}

const getMovieUpcomingService = async () => {
    try {
        let result = await Movie.find({ status: "Upcoming" })
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}

module.exports = {
    postCreateMovieService, getAllMovieService, putUpdateMovieService, deleteMovieService, getMovieNowShowingService,
    getMovieUpcomingService
}