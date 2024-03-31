const mongoose = require('mongoose')

const directorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    nationality: {
        type: String,
        required: true
    }
}, {
    timestamps: true, ///reatedAT, updatedAt
}
);
const Director = new mongoose.model('director', directorSchema)
module.exports = Director

