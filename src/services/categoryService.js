const { model } = require("mongoose");
const Category = require('../models/category')

const getAllCategoryService = async () => {
    try {
        let result = await Category.find({})
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}

const postCreateCategoryService = async (categoryData) => {
    try {
        let result = await Category.create({
            name: categoryData.name
        })
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}

const putUpdateCategoryService = async (id, name) => {
    try {
        let result = await Category.updateOne({ _id: id }, { name: name })
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}

const deleteCategoryService = async (id) => {
    try {
        let result = await Category.deleteOne({ _id: id })
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}

module.exports = {
    getAllCategoryService, postCreateCategoryService, putUpdateCategoryService, deleteCategoryService
}