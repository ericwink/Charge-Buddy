const mongoose = require('mongoose');
const { Schema } = mongoose;

//evStation schema for mongoose
const evStationSchema = new Schema({
    name: String,
    evID: Number,
    // comments: [{ body: String, date: String, rating: Number, author: String }]
    comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }]
});

//evStation model for mongoose
const EVStation = mongoose.model('EVStation', evStationSchema)

module.exports = EVStation