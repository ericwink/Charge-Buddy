const jwt = require('jsonwebtoken')
require('dotenv').config()

//assign a new access token by validating the refresh token
const renewAccessToken = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(401) //unauthorized
    const refreshToken = cookies.jwt

    const foundUser = await UserAccount.findOne({ refreshToken: refreshToken })
    if (!foundUser) return res.sendStatus(403) //forbidden

    jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decodedInfo) => {
            if (err || foundUser.username !== decodedInfo.username) return res.sendStatus(403) //forbidden probably something wrong with token
            const accessToken = jwt.sign(
                jwt.sign(
                    { username: email },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '15m' })
            )
        })
}

module.exports = renewAccessToken