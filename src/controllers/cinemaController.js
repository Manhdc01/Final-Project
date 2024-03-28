const { postCreateCinemaService, getAllCinemaService, putUpdateCinemaService, deleteCinemaService } = require('../services/cinemaService')


const getAllCinema = async (req, res) => {
    let cinema = await getAllCinemaService()
    return res.status(200).json({
        errorCode: 0,
        data: cinema
    })
}

const postCreateCinema = async (req, res) => {
    let { name, location } = req.body
    let cinemaData = {
        name,
        location
    }
    let cinema = await postCreateCinemaService(cinemaData)

    return res.status(200).json({
        errorCode: 0,
        data: cinema
    })
}

const putUpdateCinema = async (req, res) => {
    let { id, name, location } = req.body
    let cinema = await putUpdateCinemaService(id, name, location)
    return res.status(200).json({
        errorCode: 0,
        data: cinema
    })
}

const deleteCinema = async (req, res) => {
    let id = req.body.id
    let cinema = await deleteCinemaService(id)
    return res.status(200).json({
        errorCode: 0,
        data: cinema
    })
}

module.exports = {
    getAllCinema, postCreateCinema, putUpdateCinema, deleteCinema
}