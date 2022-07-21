const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const saltRounds = 10;
const session = require('express-session')

//models
const EVStation = require('../models/EVStation')
const UserAccount = require('../models/UserAccount')

//find and send user info by session on server
router.get('/checkaccount', async (req, res) => {
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
router.post('/signup', async (req, res) => {
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
router.post('/login', async (req, res) => {
    console.log(req.body)
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
        // console.log(req.session)
        //send accessToken in json for front-end use
        console.log('sending info now...')
        console.log(req.session)
        res.json({ user: foundUser.username, favorites: favorites })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ 'message': 'Internal Server Error' })
    }
})

//log-out route
router.get('/logout', async (req, res) => {
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

router.post('/addfavorite', async (req, res) => {
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

module.exports = router