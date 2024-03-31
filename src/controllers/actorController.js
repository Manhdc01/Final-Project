const { getAllActorService, postCreateActorService, putUpdateActorService, deleteActorService } = require('../services/actorService')

const getAllActor = async (req, res) => {
    let actor = await getAllActorService()
    return res.status(200).json({
        errorCode: 0,
        data: actor
    })
}
const postCreateActor = async (req, res) => {
    let { name, nationality } = req.body
    let actorData = {
        name,
        nationality
    }
    let actor = await postCreateActorService(actorData)
    return res.status(200).json({
        errorCode: 0,
        data: actor
    })
}
const putUpdateActor = async (req, res) => {
    let { id, name, nationality } = req.body
    let actor = await putUpdateActorService(id, name, nationality)
    return res.status(200).json({
        errorCode: 0,
        data: actor
    })
}
const deleteActor = async (req, res) => {
    let id = req.body.id
    let actor = await deleteActorService(id)
    return res.status(200).json({
        errorCode: 0,
        data: actor
    })
}

module.exports = {
    getAllActor, postCreateActor, putUpdateActor, deleteActor
}