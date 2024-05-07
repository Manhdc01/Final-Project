const { postCreateRoomService, getAllRoomService, findRoomsByCinemaService } = require('../services/roomService')
//create room
const postCreateRoom = async (req, res) => {
    let { cinema, name, totalSeats } = req.body
    let roomData = {
        name,
        cinema,
        totalSeats
    }
    let room = await postCreateRoomService(roomData)

    return res.status(200).json({
        errorCode: 0,
        data: room
    })
}

//get all room
const getAllRoom = async (req, res) => {
    let allRoom = await getAllRoomService()
    return res.status(200).json({
        errorCode: 0,
        data: allRoom
    })
}

//All rooms in cinema
const getAllRoomsInCinema = async (req, res) => {
    const { cinemaId } = req.params;

    try {
        const rooms = await findRoomsByCinemaService(cinemaId);
        res.status(200).json({
            success: true,
            data: rooms
        });
    } catch (error) {
        console.error('Controller error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server Error: Failed to retrieve rooms'
        });
    }
};
module.exports = {
    postCreateRoom, getAllRoom, getAllRoomsInCinema
}
