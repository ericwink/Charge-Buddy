require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.port || 8080
const cors = require('cors')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const mongoose = require('mongoose');

//connect to mongoose
mongoose.connect('mongodb://localhost:27017/chargebuddy')
    .then(console.log('connected to database'))
    .catch(err => console.log(err))

//form parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//cors middleware
app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true
}))

//session middleware
app.use(session({
    secret: 'changethislater',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/chargebuddy', collectionName: 'sessions' }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 //1 day expiration
    }
}))

//routes
app.use('/user', require('./routes/user'))
app.use('/station', require('./routes/station'))


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})