const express = require('express')
const router = express.Router()

//models
const EVStation = require('../models/EVStation')
const UserAccount = require('../models/UserAccount')
const Comment = require('../models/Comment')

//get comments by station id
router.get('/:id', async (req, res) => {
    const evID = req.params.id
    try {
        const foundStation = await EVStation.findOne({ evID: evID }).populate({ path: 'comments', populate: { path: 'author', select: 'username -_id' } })
        if (foundStation) {
            res.send(foundStation)
        }
    } catch (error) {
        console.log(error)
    }
})

//post comments to station
router.post('/comment', async (req, res) => {
    const evID = req.body.stationID
    const today = new Date()
    try {
        const foundStation = await EVStation.findOne({ evID: evID })
        const foundUser = await UserAccount.findOne({ username: req.body.author })
        const newComment = new Comment
        newComment.author = foundUser._id
        newComment.body = req.body.comment
        newComment.rating = req.body.rating
        newComment.date = today.toDateString()
        await newComment.save()
        if (foundStation) {
            await foundStation.comments.push(newComment._id)
            await foundStation.save()
            res.send('comment added')
        } else {
            const newStation = new EVStation
            newStation.evID = req.body.stationID
            newStation.name = req.body.stationName
            await newStation.comments.push(newComment._id)
            await newStation.save()
            res.send('station created, comment added')
        }
    }
    catch (error) {
        console.log(error)
    }
})

//remove a comment from a station
router.delete('/comment', async (req, res) => {
    try {
        const { stationID, commentID } = req.body
        await EVStation.findOneAndUpdate({ evID: stationID }, { $pull: { comments: commentID } }, { new: true })
        await Comment.findByIdAndDelete(commentID)
        res.send('comment deleted')
    } catch (error) {
        console.log(error)
    }
})

router.patch('/comment', async (req, res) => {
    try {
        const { stationID, commentID, comment, rating } = req.body.data
        const result = await Comment.findById(commentID)
        result.body = comment
        result.rating = rating
        result.save()
    } catch (error) {
        console.log(error)
    }
})

module.exports = router