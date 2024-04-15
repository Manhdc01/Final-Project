const { model } = require("mongoose")
const Movie = require("../models/movie")
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const Category = require("../models/category");
const CLIENT_ID = '45baff75e010a0d';

const postCreateMovieService = async (dataMovie) => {
    try {
        // Kiểm tra xem tên phim đã tồn tại trong cơ sở dữ liệu chưa
        const existingMovie = await Movie.findOne({ name: dataMovie.name });
        if (existingMovie) {
            console.log('The movie name already exists')
        }
        // Lấy thông tin category từ bảng Category
        let category = null;
        if (dataMovie.category) {
            category = await Category.findById(dataMovie.category);
            if (!category) {
                console.log(`Faculty with ID ${dataMovie.category} not found`);
            }
        }

        //create movie with ID category
        let result = await Movie.create({
            name: dataMovie.name,
            poster: dataMovie.poster,
            director: dataMovie.director,
            performer: dataMovie.performer,
            category: category ? dataMovie.category : null,
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
        let result = await Movie.find().populate('category')
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}

const putUpdateMovieService = async (id, movieData) => {
    try {
        let result = await Movie.updateOne({ _id: id }, { $set: movieData })
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
const getMovieTrailerService = async (movieId) => {
    try {
        const movie = await Movie.findOne({ _id: movieId });
        if (!movie) {
            throw new Error('Movie not found');
        }
        return movie.trailerUrl;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
module.exports = {
    postCreateMovieService, getAllMovieService, putUpdateMovieService, deleteMovieService, getMovieNowShowingService,
    getMovieUpcomingService, uploadImage, getMovieTrailerService
}