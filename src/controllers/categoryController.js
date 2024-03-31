const { getAllCategoryService, postCreateCategoryService, putUpdateCategoryService, deleteCategoryService } = require('../services/categoryService')

const getAllCategory = async (req, res) => {
    let category = await getAllCategoryService()
    return res.status(200).json({
        errorCode: 0,
        data: category
    })
}
const postCreateCategory = async (req, res) => {
    let name = req.body.name
    let categoryData = ({ name: name })
    let category = await postCreateCategoryService(categoryData)
    return res.status(200).json({
        errorCode: 0,
        data: category
    })

}
const putUpdateCategory = async (req, res) => {
    let { id, name } = req.body
    let category = await putUpdateCategoryService(id, name)
    return res.status(200).json({
        errorCode: 0,
        data: category
    })
}
const deleteCategory = async (req, res) => {
    let id = req.body.id
    let category = await deleteCategoryService(id)
    return res.status(200).json({
        errorCode: 0,
        data: category
    })
}

module.exports = {
    getAllCategory, postCreateCategory, putUpdateCategory, deleteCategory
}