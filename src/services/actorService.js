const { model } = require("mongoose")
const Actor = require('../models/actor')

const getAllActorService = async () => {
    try {
        let result = await Actor.find({})
        return result
    } catch (error) {
        console.log(error)
        return null
    }

}
const postCreateActorService = async (actorData) => {
    try {
        let result = await Actor.create({
            name: actorData.name,
            nationality: actorData.nationality
        })
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}
const putUpdateActorService = async (id, name, nationality) => {
    try {
        let result = await Actor.updateOne({ _id: id }, { name, nationality })
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}
const deleteActorService = async (id) => {
    try {
        let result = await Actor.deleteOne({ _id: id })
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}

module.exports = {
    getAllActorService, postCreateActorService, putUpdateActorService, deleteActorService
}