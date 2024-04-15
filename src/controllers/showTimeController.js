const { postCreateShowTimeService, getAllShowTimeService } = require('../services/showTimeService')
//create showTime
const postCreateShowTime = async (req, res) => {
    let { movie, cinema, startDate, endDate, room, status } = req.body
    let showTimeData = {
        movie, cinema, startDate, endDate, room, status
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

module.exports = {
    postCreateShowTime, getAllShowTime
}

