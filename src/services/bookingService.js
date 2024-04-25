const Booking = require("../models/booking");

const postCreateBookingServcie = async (dataBooking) => {
    const result = await Booking.create(dataBooking);
    return result;
}
module.exports = {
    postCreateBookingServcie
}