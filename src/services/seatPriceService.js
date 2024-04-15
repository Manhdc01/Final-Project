const SeatPrice = require("../models/seatprice");

const postCreateSeatPriceService = async ({ seatType, price }) => {
    try {
        let result = await SeatPrice.create({ seatType, price });
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getAllSeatPriceService = async () => {
    try {
        let result = await SeatPrice.find();
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const putUpdateSeatPriceService = async (id, seatType, price) => {
    try {
        let result = await SeatPrice.updateOne({ _id: id }, { seatType, price });
        return result;
    }
    catch (error) {
        console.log(error);
        return null;
    }
}

const deleteSeatPriceService = async (id) => {
    try {
        let result = await SeatPrice.deleteOne({ _id: id });
        return result;
    }
    catch (error) {
        console.log(error);
        return null;
    }
}
module.exports = {
    postCreateSeatPriceService, getAllSeatPriceService, putUpdateSeatPriceService, deleteSeatPriceService
}