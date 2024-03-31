const { model } = require("mongoose");
const Director = require('../models/director')

const getAllDirectorService = async () => {
    try {
        let result = await Director.find({})
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}

const postCreateADirectorService = async (directorData) => {
    try {
        let result = await Director.create({
            name: directorData.name,
            nationality: directorData.nationality
        })
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}

const putUpdateADirectorService = async (id, name, nationality) => {
    try {
        let result = await Director.updateOne({ _id: id }, { name, nationality })
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}

const deleteADirectorService = async (id) => {
    try {
        let result = await Director.deleteOne({ _id: id })
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}

module.exports = {
    getAllDirectorService, postCreateADirectorService, putUpdateADirectorService, deleteADirectorService
}