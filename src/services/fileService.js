const fs = require('fs');
const path = require('path');

const uploadSingleFile = async (poster) => {
    let uploadPath = path.resolve(__dirname, "../public/images/upload");

    // let DOMAIN = process.env.DOMAIN;
    let extName = path.extname(poster.name);

    let baseName = path.basename(poster.name, extName);

    let finalName = `${baseName}-${Date.now()}${extName}`
    let finalPath = `${uploadPath}/${finalName}`;

    // let url_file = `${DOMAIN}${finalName}`;
    try {
        await poster.mv(finalPath);
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