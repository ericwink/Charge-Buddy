const jwt = require('jsonwebtoken');
require('dotenv').config()

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization']
    if (!authHeader) return res.sendStatus(401)
    // console.log('authHeader', authHeader) // Bearer token
    const token = authHeader.split(' ')[1]
    jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decodedInfo) => {
            if (err) return res.sendStatus(403) //forbidden - token recieved but may have been tampered with
            req.email = decodedInfo.username;
            next()
        }
    )
}

module.exports = verifyJWT