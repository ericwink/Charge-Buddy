require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.port || 8080
const cors = require('cors')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const session = require('express-session')
const MongoStore = require('connect-mongo')

const mongoose = require('mongoose');
const { Schema } = mongoose;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true
}))
app.use(session({
    secret: 'changethislater',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/chargebuddy', collectionName: 'sessions' }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 //1 day expiration
    }
}))

mongoose.connect('mongodb://localhost:27017/chargebuddy');

//evStation schema for mongoose
const evStationSchema = new Schema({
    name: String,
    evID: Number,
    // comments: [{ body: String, date: String, rating: Number, author: String }]
    comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }]
});

//evStation model for mongoose
const EVStation = mongoose.model('EVStation', evStationSchema)

//evStation schema for mongoose
const userSchema = new Schema({
    username: String,
    password: String,
    favorites: [{ type: mongoose.Types.ObjectId, ref: 'EVStation' }]
});

//evStation model for mongoose
const UserAccount = mongoose.model('UserAccount', userSchema)

//comments schema
const commentSchema = new Schema({
    body: String,
    date: String,
    rating: Number,
    author: { type: mongoose.Types.ObjectId, ref: 'UserAccount' }
})

//comment model
const Comment = mongoose.model('Comment', commentSchema)

const isAuthenticated = () => {
    if (req.session) {
        res.json({ user: req.session.user })
    }
}

//find and send user info by session on server
app.get('/checkaccount', async (req, res) => {
    try {
        if (!req.session.user) return res.status(500).json({ 'message': 'Something is wrong...' })
        const foundUser = await UserAccount.findOne({ username: req.session.user }).populate('favorites')
        const favorites = foundUser.favorites.map(fav => { return { evID: fav.evID, name: fav.name } })
        console.log('sending info now...')
        res.json({ user: foundUser.username, favorites: favorites })
    } catch (error) {
        console.log(error)
    }
})

//handle user sign-up
app.post('/signup', async (req, res) => {
    const { username, password } = req.body
    try {
        //check the database to see if a user with the username already exists
        const foundUser = await UserAccount.findOne({ username: username })
        if (foundUser) {
            return res.status(400).json({ 'message': 'User account with that username already exists' })
        } else {
            //if no user exists, create account and store password with bcrypt
            const hashPassword = await bcrypt.hash(password, saltRounds)
            const newUser = new UserAccount({ username: username, password: hashPassword })
            await newUser.save()
            return res.status(200).json({ 'message': 'User account created successfully!' })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ 'message': 'Internal Server Error' })
    }
})

//handle user sign-in and create a session on the server
app.post('/login', async (req, res) => {
    const { username, password } = req.body
    try {
        const foundUser = await UserAccount.findOne({ username: username }).populate('favorites')
        if (!foundUser) return res.status(400).json({ 'message': 'No user account found.' })
        const favorites = foundUser.favorites.map(fav => { return { evID: fav.evID, name: fav.name } })
        //verify password with bcrypt
        const verify = await bcrypt.compare(password, foundUser.password)
        if (!verify) return res.status(400).json({ 'message': 'Username or password incorrect' })
        //regenerate session, as suggestsed by session docs
        await req.session.regenerate(function (err) {
            if (err) console.log(err)
        })
        //store user information in session
        req.session.user = foundUser.username
        //save session before redirect to ensure page load does not happen before session is saved
        await req.session.save/*(function (err) {
            if (err) console.log(err)
        })*/
        console.log(req.session)
        //send accessToken in json for front-end use
        // res.redirect('/checkaccount')
        console.log('sending info now...')
        res.json({ user: foundUser.username, favorites: favorites })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ 'message': 'Internal Server Error' })
    }
})

//log-out route
app.get('/logout', async (req, res) => {
    try {
        req.session.user = null
        await req.session.save
        console.log(req.session)
        req.session.regenerate
        return res.status(200).json({ 'message': 'User successfully logged out!' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ 'message': 'Internal Server Error' })
    }
})

app.post('/addfavorite', async (req, res) => {
    try {
        if (!req.session.user) return res.status(400).json({ 'message': 'user must be signed in' })
        let station = await EVStation.findOne({ evID: req.body.evID })
        if (!station) {
            station = new EVStation
            station.evID = req.body.evID
            station.name = req.body.stationName
            await station.save()
        }
        const foundUser = await UserAccount.findOne({ username: req.body.loggedInUser })
        foundUser.favorites.push(station._id)
        console.log(foundUser)
        await foundUser.save()
        res.send('done!')
    } catch (err) {
        console.log(err)
    }
})

//get comments by station id
app.get('/:station', async (req, res) => {
    const evID = req.params.station
    try {
        const foundStation = await EVStation.findOne({ evID: evID }).populate({ path: 'comments', populate: { path: 'author', select: 'username -_id' } })
        if (foundStation) {
            console.log('.author', foundStation)
            res.send(foundStation)
        }
    } catch (error) {
        console.log(error)
    }
})

//post comments to station
app.post('/:station', async (req, res) => {
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
        console.log(newComment)
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
app.delete('/:station', async (req, res) => {
    try {
        const { stationID, commentID } = req.body
        await EVStation.findOneAndUpdate({ evID: stationID }, { $pull: { comments: commentID } }, { new: true })
        await Comment.findByIdAndDelete(commentID)
        res.send('comment deleted')
    } catch (error) {
        console.log(error)
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})