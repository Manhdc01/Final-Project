const ShowTime = require("../models/showtime")

const postCreateShowTimeService = async (showTime) => {
    let showTimeData = await ShowTime.create(showTime)
    return showTimeData
}
const getAllShowTimeService = async () => {
    let showTime = await ShowTime.find().populate('movie').populate('cinema').populate('room')
    return showTime
}

const updateShowTimeService = async (id, showTime) => {
    let showTimeData = await ShowTime.updateOne({ _id: id }, { $set: showTime })
    return showTimeData
}

const deleteShowTimeService = async (id) => {
    let showTime = await ShowTime.deleteOne({ _id: id })
    return showTime
}
module.exports = {
    postCreateShowTimeService, getAllShowTimeService, updateShowTimeService, deleteShowTimeService
}