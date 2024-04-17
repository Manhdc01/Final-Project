const { postCreateShowTimeService, getAllShowTimeService, updateShowTimeService, deleteShowTimeService } = require('../services/showTimeService')
//create showTime
const postCreateShowTime = async (req, res) => {
    let { CinemaID, MovieID, RoomID, startDate, endDate, times } = req.body
    let showTimeData = {
        CinemaID,
        MovieID,
        RoomID,
        startDate,
        endDate,
        times
    }
    let showTime = await postCreateShowTimeService(showTimeData)
    res.status(200).json({
        success: true,
        data: showTime
    })
}

const getAllShowTime = async (req, res) => {
    let showTime = await getAllShowTimeService()
    res.status(200).json({
        success: true,
        data: showTime
    })
}

const updateShowTime = async (req, res) => {
    let { id, CinemaID, MovieID, RoomID, startDate, endDate, times } = req.body
    let showTimeData = {
        CinemaID,
        MovieID,
        RoomID,
        startDate,
        endDate,
        times
    }
    let showTime = await updateShowTimeService(id, showTimeData)
    res.status(200).json({
        success: true,
        data: showTime
    })
}

const deleteShowTime = async (req, res) => {
    let { id } = req.body
    let showTime = await deleteShowTimeService(id)
    res.status(200).json({
        success: true,
        data: showTime
    })
}

module.exports = {
    postCreateShowTime, getAllShowTime, updateShowTime, deleteShowTime
}

