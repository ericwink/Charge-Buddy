const mongoose = require('mongoose');
const { Schema } = mongoose;

//comments schema
const commentSchema = new Schema({
    body: String,
    date: String,
    rating: Number,
    author: { type: mongoose.Types.ObjectId, ref: 'UserAccount' }
})

//comment model
const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment