const fs = require('fs');
const path = require('path');

const uploadSingleFile = async (fileObject) => {
    let uploadPath = path.resolve(__dirname, "../public/images/upload");

    let extName = path.extname(fileObject.name);

    let baseName = path.basename(fileObject.name, extName);

    let finalName = `${baseName}-${Date.now()}${extName}`
    let finalPath = `${uploadPath}/${finalName}`;

    try {
        await fileObject.mv(finalPath);
        return {
            status: 'success',
            path: finalPath,
            error: null
        }
    } catch (err) {
        console.log(">>> check error: ", err)
        return {
            status: 'failed',
            path: null,
            error: JSON.stringify(err)
        }
    }
}

module.exports = {
    uploadSingleFile
}