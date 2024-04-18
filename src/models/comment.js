const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    comments: {
        type: String,
        required: true
    },
    pointRating: {
        type: Number,
        required: true,
        default: 1
    },
    countLike: {
        type: Number,
        default: 0
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    movie: {
        type: Schema.Types.ObjectId,
        ref: 'movie',
        required: true
    }
}, { timestamps: true });

const Comment = mongoose.model('comment', commentSchema);

module.exports = Comment;