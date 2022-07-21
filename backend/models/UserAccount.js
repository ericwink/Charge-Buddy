const mongoose = require('mongoose');
const { Schema } = mongoose;

//user schema for mongoose
const userSchema = new Schema({
    username: String,
    password: String,
    favorites: [{ type: mongoose.Types.ObjectId, ref: 'EVStation' }]
});

//user model for mongoose
const UserAccount = mongoose.model('UserAccount', userSchema)

module.exports = UserAccount