const ShowTime = require("../models/showtime")

const postCreateShowTimeService = async (showTime) => {
    console.log('Attempting to create showtime with:', showTime);
    let showTimeData = await ShowTime.create(showTime)
    console.log('Created showtime:', showTimeData);
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

const getAllShowTimesForAdminCinemaService = async (cinemaId) => {
    try {
        const showTimes = await ShowTime.find({ cinema: cinemaId }).populate('movie').populate('cinema').populate('room');
        return showTimes;
    } catch (error) {
        console.error('Error fetching show times for admin cinema:', error);
        throw new Error('An error occurred while fetching show times for admin cinema');
    }
};
const postCreateShowTimeForAdminService = async (showTime) => {
    let showTimeData = await ShowTime.create(showTime)
    console.log('Created showtime:', showTimeData);
    return showTimeData
}

const putUpdateShowTimeForAdminService = async (id, showTime) => {
    let showTimeData = await ShowTime.updateOne({ _id: id }, { $set: showTime })
    return showTimeData
}
const deleteShowTimeForAdminService = async (id) => {
    let showTime = await ShowTime.deleteOne({ _id: id })
    return showTime
}
module.exports = {
    postCreateShowTimeService, getAllShowTimeService, updateShowTimeService, deleteShowTimeService, getAllShowTimesForAdminCinemaService,
    postCreateShowTimeForAdminService, putUpdateShowTimeForAdminService, deleteShowTimeForAdminService
}