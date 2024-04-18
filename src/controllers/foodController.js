const { addFoodService, getAllFoodService, putUpdateFoodService, deleteFoodService } = require('../services/foodService')

//add food
const addFood = async (req, res) => {
    let { name, price } = req.body
    let foodData = {
        name,
        price
    }
    let food = await addFoodService(foodData)
    res.status(200).json({
        success: true,
        data: food
    })
}
const getAllFood = async (req, res) => {
    let food = await getAllFoodService()
    res.status(200).json({
        success: true,
        data: food
    })
}
const putUpdateFood = async (req, res) => {
    let { id, name, price } = req.body
    let foodData = {
        name,
        price
    }
    let food = await putUpdateFoodService(id, foodData)
    res.status(200).json({
        success: true,
        data: food
    })
}

const deleteFood = async (req, res) => {
    let id = req.params.id
    let food = await deleteFoodService(id)
    res.status(200).json({
        success: true,
        data: food
    })
}

module.exports = {
    addFood,
    getAllFood,
    putUpdateFood,
    deleteFood
}