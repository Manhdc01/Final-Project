const { model } = require("mongoose")
const Cinema = require('../models/cinema')
const postCreateCinemaService = async (cinemaData) => {
    try {
        let result = await Cinema.create(
            {
                name: cinemaData.name,
                location: cinemaData.location
            }
        )
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}
const getAllCinemaService = async () => {
    try {
        let result = await Cinema.find({})
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}

const putUpdateCinemaService = async (id, name, location) => {
    try {
        let result = await Cinema.updateOne({ _id: id }, { name, location })
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}
const deleteCinemaService = async (id) => {
    try {
        let result = await Cinema.deleteOne({ _id: id })
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}

module.exports = {
    postCreateCinemaService, getAllCinemaService, putUpdateCinemaService, deleteCinemaService
}