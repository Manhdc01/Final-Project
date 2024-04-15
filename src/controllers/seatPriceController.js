const { postCreateSeatPriceService, getAllSeatPriceService, putUpdateSeatPriceService, deleteSeatPriceService } = require('../services/seatPriceService');
//create seatPrice
const postCreateSeatPrice = async (req, res) => {
    let { seatType, price } = req.body;
    const newSeatPrice = await postCreateSeatPriceService({ seatType, price });
    return res.status(201).json({
        success: true,
        data: newSeatPrice
    });
}
//get all seatPrice
const getAllSeatPrice = async (req, res) => {
    let seatPrice = await getAllSeatPriceService()
    return res.status(200).json({
        errorCode: 0,
        data: seatPrice
    })
}

//update seatPrice
const putUpdateSeatPrice = async (req, res) => {
    let { id, seatType, price } = req.body;
    const newSeatPrice = await putUpdateSeatPriceService(id, seatType, price);
    return res.status(201).json({
        success: true,
        data: newSeatPrice
    });
}
//delete seatPrice
const deleteSeatPrice = async (req, res) => {
    let id = req.params.id;
    const newSeatPrice = await deleteSeatPriceService(id);
    return res.status(201).json({
        success: true,
        data: newSeatPrice
    });
}


module.exports = {
    postCreateSeatPrice, getAllSeatPrice, putUpdateSeatPrice, deleteSeatPrice
}