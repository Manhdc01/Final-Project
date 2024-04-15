const ShowTime = require("../models/showtime")

const postCreateShowTimeService = async (showTimeData) => {
    let showTime = await ShowTime.create(showTimeData)
    return showTime
}
const getAllShowTimeService = async () => {
    let showTime = await ShowTime.find().populate('movie').populate('cinema').populate('room')
    return showTime
}

module.exports = {
    postCreateShowTimeService, getAllShowTimeService
}