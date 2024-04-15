const { model } = require("mongoose")
const Movie = require("../models/movie")
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const CLIENT_ID = '45baff75e010a0d';

const postCreateMovieService = async (dataMovie) => {
    try {
        let result = await Movie.create({
            name: dataMovie.name,
            poster: dataMovie.poster,
            director: dataMovie.director,
            performer: dataMovie.performer,
            category: dataMovie.category,
            premiere: dataMovie.premiere,
            time: dataMovie.time,
            language: dataMovie.language,
            trailerUrl: dataMovie.trailerUrl,
            status: dataMovie.status
        })
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

const uploadImage = async (imagePath) => {
    try {
        const file = fs.readFileSync(imagePath);
        const formData = new FormData();
        formData.append('image', file, { filename: 'image' });

        const response = await axios.post('https://api.imgur.com/3/image', formData, {
            headers: {
                Authorization: `Client-ID ${CLIENT_ID}`,
                ...formData.getHeaders()
            }
        });

        return { imageUrl: response.data.data.link };
    } catch (error) {
        console.error(error);
        throw new Error('Upload failed');
    }
}

module.exports = {
    postCreateMovieService, getAllMovieService, putUpdateMovieService, deleteMovieService, getMovieNowShowingService,
    getMovieUpcomingService, uploadImage
}