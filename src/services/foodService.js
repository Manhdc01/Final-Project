const Food = require("../models/food")

const addFoodService = async (foodData) => {
    try {
        return await Food.create(foodData)

    } catch (error) {
        console.error(error)
        return null
    }
}

const getAllFoodService = async () => {
    try {
        return await Food.find()
    } catch (error) {
        console.error(error)
        return null
    }
}

const putUpdateFoodService = async (id, foodData) => {
    try {
        return await Food.updateOne({ _id: id }, foodData)
    }
    catch (error) {
        console.error(error)
        return null
    }
}
const deleteFoodService = async (id) => {
    try {
        return await Food.deleteOne({ _id: id })
    }
    catch (error) {
        console.error(error)
        return null
    }
}
module.exports = {
    addFoodService,
    getAllFoodService,
    putUpdateFoodService,
    deleteFoodService
}