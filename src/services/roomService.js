const Room = require("../models/room")

const postCreateRoomService = async (roomData) => {
    let room = await Room.create(roomData)
    return room
}

const getAllRoomService = async (req, res) => {
    let result = await Room.find().populate('cinema')
    return result
}
const findRoomsByCinemaService = async (cinemaId) => {
    try {
        const rooms = await Room.find({ cinema: cinemaId }).populate('cinema', 'name');
        return rooms;
    } catch (error) {
        console.error('Error finding rooms:', error);
        throw new Error('Failed to retrieve rooms');
    }
};

module.exports = {
    postCreateRoomService, getAllRoomService, findRoomsByCinemaService
}