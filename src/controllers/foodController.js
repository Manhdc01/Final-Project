const { addFoodService, getAllFoodService, putUpdateFoodService, deleteFoodService } = require('../services/foodService')
const { uploadImage } = require('../services/movieService')
const fs = require('fs')
const { uploadSingleFile } = require('../services/fileService')
//add food
const addFood = async (req, res) => {
    let { name, price } = req.body
    let foodData = {
        name,
        price
    }
    let imageUploadResult = {}
    if (!req.files || !req.files.image) {
        console.log("No file uploaded");
    } else {
        let file_dir = req.files.image;
        let fileUploadResult = await uploadSingleFile(file_dir);
        let file_addr = fileUploadResult.path;
        // console.log("Url image:", file_addr);
        // upload to imgur
        imageUploadResult = await uploadImage(file_addr);
        // console.log(">>>>check", imageUploadResult)
        foodData.image = imageUploadResult.imageUrl
        // remove file from local
        try {
            fs.unlinkSync(file_addr);
        }
        catch (err) {
            console.log(err)
        }
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