const { model } = require("mongoose")
const Cinema = require('../models/cinema')
const axios = require('axios');
async function getProvinceNameByCode(code) {
    try {
        const response = await axios.get(`https://province-api-dccinema.onrender.com/provinces`);
        const province = response.data.data.find(p => p.code === code);
        return province ? province.name : null;
    } catch (error) {
        console.error('Error fetching province name:', error);
        return null;
    }
}

async function getDistrictNameByCode(provinceCode, districtCode) {
    try {
        const response = await axios.get(`https://province-api-dccinema.onrender.com/districts/${provinceCode}`);
        const district = response.data.data.find(d => d.code === districtCode);
        return district ? district.name : null;
    } catch (error) {
        console.error('Error fetching district name:', error);
        return null;
    }
}

async function getCommuneNameByCode(districtCode, communeCode) {
    try {
        const response = await axios.get(`https://province-api-dccinema.onrender.com/wards/${districtCode}`);
        const commune = response.data.data.find(c => c.code === communeCode);
        return commune ? commune.name : null;
    } catch (error) {
        console.error('Error fetching commune name:', error);
        return null;
    }
}
const postCreateCinemaService = async (cinemaData) => {
    const { name, province, district, commune, address } = cinemaData;
    try {

        const provinceName = await getProvinceNameByCode(province);
        const districtName = await getDistrictNameByCode(province, district);
        const communeName = await getCommuneNameByCode(district, commune);

        if (!provinceName || !districtName || !communeName) {
            return { success: false, message: 'Failed to retrieve location details' };
        }

        const result = await Cinema.create({
            name,
            province: provinceName,
            district: districtName,
            commune: communeName,
            address
        });

        return { success: true, data: result };
    } catch (error) {
        console.error('Error in postCreateCinemaService:', error);
        return { success: false, message: 'An error occurred during cinema creation.' };
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

const putUpdateCinemaService = async (id, cinemaData) => {
    try {
        let updateData = {};
        if (cinemaData.name) updateData.name = cinemaData.name;
        if (cinemaData.province) updateData.province = await getProvinceNameByCode(cinemaData.province);
        if (cinemaData.district) updateData.district = await getDistrictNameByCode(cinemaData.province, cinemaData.district);
        if (cinemaData.commune) updateData.commune = await getCommuneNameByCode(cinemaData.district, cinemaData.commune);
        if (cinemaData.address) updateData.address = cinemaData.address;

        const existingCinema = await Cinema.updateOne(
            { _id: id },
            { $set: updateData }
        );

        return { success: true, data: existingCinema };
    } catch (error) {
        console.error('Error in putUpdateCinemaService:', error);
        return { success: false, message: 'An error occurred during cinema update.' };
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