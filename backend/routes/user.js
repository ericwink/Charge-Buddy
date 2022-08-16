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
        if (!req.session.user) return res.status(500).json({ 'message': 'No user session active' })
        const foundUser = await UserAccount.findOne({ username: req.session.user }).populate('favorites')
        const favorites = foundUser.favorites.map(fav => { return { evID: fav.evID, name: fav.name, id: fav._id } })
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
        //send json for front-end use
        res.json({ user: foundUser.username, favorites: favorites })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ 'message': 'Internal Server Error' })
    }
})

//log-out route
router.get('/logout', async (req, res) => {
    if (!req.session) return res.status(500).json({ 'message': 'No user session exists!' })
    try {
        req.session.user = null
        await req.session.save
        await req.session.destroy()
        return res.status(200).json({ 'message': 'User successfully logged out!' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ 'message': 'Internal Server Error' })
    }
})

router.post('/favorites', async (req, res) => {
    const { evID, stationName } = req.body
    try {
        if (!req.session.user) return res.status(400).json({ 'message': 'user must be signed in' })
        let station = await EVStation.findOne({ evID: evID })
        if (!station) {
            station = new EVStation
            station.evID = evID
            station.name = stationName
            await station.save()
        }
        const foundUser = await UserAccount.findOne({ username: req.session.user })
        foundUser.favorites.push(station._id)
        await foundUser.save()
        res.send('Favorite saved')
    } catch (err) {
        console.log(err)
    }
})

router.delete('/favorites', async (req, res) => {
    const { favID } = req.body
    try {
        if (!req.session.user) return res.status(500).json({ 'message': 'Something is wrong...' })
        await UserAccount.findOneAndUpdate({ username: req.session.user }, { $pull: { favorites: favID } }, { new: true })
        return res.status(200).json({ 'message': 'EV Station removed from favorites!' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ 'message': 'Internal Server Error' })
    }
})

module.exports = router