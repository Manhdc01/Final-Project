const { getAllDirectorService, postCreateADirectorService, putUpdateADirectorService, deleteADirectorService } = require('../services/directorService')

const getAllDirector = async (req, res) => {
    let director = await getAllDirectorService()
    return res.status(200).json({
        errorCode: 0,
        data: director
    })
}
const postCreateADirector = async (req, res) => {
    let { name, nationality } = req.body
    let directorData = {
        name,
        nationality
    }
    let director = await postCreateADirectorService(directorData)
    return res.status(200).json({
        errorCode: 0,
        data: director
    })

}
const putUpdateADirector = async (req, res) => {
    let { id, name, nationality } = req.body
    let director = await putUpdateADirectorService(id, name, nationality)
    return res.status(200).json({
        errorCode: 0,
        data: director
    })
}
const deleteADirector = async (req, res) => {
    let id = req.body.id
    let director = await deleteADirectorService(id)
    return res.status(200).json({
        errorCode: 0,
        data: director
    })
}
module.exports = {
    getAllDirector, postCreateADirector, putUpdateADirector, deleteADirector
}