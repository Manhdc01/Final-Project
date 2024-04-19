const { model } = require("mongoose")
const Cinema = require('../models/cinema')
const postCreateCinemaService = async (cinemaData) => {
    try {
        // Kiểm tra xem rạp có tồn tại trong cơ sở dữ liệu chưa
        const existingCinema = await Cinema.findOne({ name: cinemaData.name });

        if (existingCinema) {
            // Nếu rạp đã tồn tại, trả về thông báo lỗi
            return { success: false, message: 'The cinema name already exists' };
        } else {
            // Nếu rạp chưa tồn tại, tạo mới và lưu vào cơ sở dữ liệu
            const result = await Cinema.create({
                name: cinemaData.name,
                province: cinemaData.province,
                district: cinemaData.district,
                commune: cinemaData.commune,
                address: cinemaData.address
            });

            // Trả về kết quả thành công
            return { success: true, data: result };
        }
    } catch (error) {
        console.log(error);
        // Nếu có lỗi xảy ra, trả về thông báo lỗi
        return { success: false, message: 'Đã xảy ra lỗi khi tạo rạp.' };
    }
}
const getAllCinemaService = async () => {
    try {
        let result = await Cinema.find({})
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}

const putUpdateCinemaService = async (id, name, location) => {
    try {
        let result = await Cinema.updateOne({ _id: id }, { name, province, district, commune, address })
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}
const deleteCinemaService = async (id) => {
    try {
        let result = await Cinema.deleteOne({ _id: id })
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}

module.exports = {
    postCreateCinemaService, getAllCinemaService, putUpdateCinemaService, deleteCinemaService
}