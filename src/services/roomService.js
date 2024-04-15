const Room = require("../models/room")

const postCreateRoomService = async (roomData) => {
    let room = await Room.create(roomData)
    return room
}

const getAllRoomService = async (req, res) => {
    let result = await Room.find().populate('cinema')
    return result
}

module.exports = {
    postCreateRoomService, getAllRoomService
}