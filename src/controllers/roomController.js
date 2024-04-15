const { postCreateRoomService, getAllRoomService } = require('../services/roomService')
//create room
const postCreateRoom = async (req, res) => {
    let { name, cinema } = req.body
    let roomData = {
        name,
        cinema,
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
//update room



module.exports = {
    postCreateRoom, getAllRoom
}
