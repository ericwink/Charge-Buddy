const express = require('express')
const router = express.Router()
const axios = require('axios')

//https://developer.nrel.gov/docs/transportation/alt-fuel-stations-v1/all/

//ev api call by address
router.post('/address', async (req, res) => {
    try {
        const { address, miles } = req.body
        const fullLink = `https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=${process.env.EV_API_KEY}&location=${address}&radius=${miles}&fuel_type=ELEC&limit=200`
        const results = await axios.get(fullLink)
        res.json(results.data)
    } catch (error) {
        console.log(error)
    }
})

//ev api call by lat lng
router.post('/latlng', async (req, res) => {
    try {
        const { userLatitude, userLongitude, miles } = req.body
        const fullLink = `https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=${process.env.EV_API_KEY}&latitude=${userLatitude}&longitude=${userLongitude}&radius=${miles}&fuel_type=ELEC&limit=200`
        const results = await axios.get(fullLink)
        res.json(results.data)
    } catch (error) {
        console.log(error)
    }
})

//ev api call by station id
router.post('/stationid', async (req, res) => {
    try {
        const { evID } = req.body
        const fullLink = `https://developer.nrel.gov/api/alt-fuel-stations/v1/${evID}.json?api_key=${process.env.EV_API_KEY}`
        const results = await axios.get(fullLink)
        res.json(results.data)
    } catch (error) {
        console.log(error)
    }
})

module.exports = router