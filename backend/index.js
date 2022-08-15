require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const cors = require('cors')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const mongoose = require('mongoose');
const dbLink = `mongodb+srv://${process.env.MONGO_LOGIN}:${process.env.MONGO_SECRET}@cluster0.1sbqg.mongodb.net/?retryWrites=true&w=majority`
const path = require('path')

//connect to mongoose
mongoose.connect(dbLink)
    .then(console.log('connected to database'))
    .catch(err => console.log(err))

//join dir
app.use(express.static('public'))

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
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: dbLink, collectionName: 'sessions' }),
    cookie: {
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 //1 day expiration
    }
}))

//routes
app.use('/user', require('./routes/user'))
app.use('/station', require('./routes/station'))
app.use('/evapi', require('./routes/evapi'))
app.get('/', (req, res) => {
    res.send('Charge-Buddy API')
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})