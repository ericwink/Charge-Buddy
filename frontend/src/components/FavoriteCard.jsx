import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import axios from '../config/axios'
import { UserContext } from "../Context/UserContext";
import { useContext } from 'react';

export default function FavoriteCard({ name, favID, evID, updateFuelStations, panToUserLocation, setMsg, setVariant, setShowAlert, handleClose }) {

    const { clickFav, setClickFav, } = useContext(UserContext)

    const removeFavorite = async () => {
        try {
            const data = await axios.delete('/user/favorites', {
                data: {
                    favID: favID,
                }
            })
            setClickFav(!clickFav)
            setShowAlert(true)
            setVariant('success')
            setMsg(data.data.message)
        } catch (error) {
            console.log(error)
            setShowAlert(true)
            setVariant('danger')
            setMsg(error.data.data.message)
        }
    }

    const callStationByID = async () => {
        try {
            const data = await axios.post('/evapi/stationid', { evID: evID })
            updateFuelStations([data.data.alt_fuel_station])
            panToUserLocation(data.data.alt_fuel_station.latitude, data.data.alt_fuel_station.longitude)
            handleClose()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Card className='mb-2 dropshadow'>
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Button onClick={callStationByID} variant='outline'><i class="fa-solid fa-map-location-dot" /></Button>
                <Button onClick={removeFavorite} variant='outline'><i class="fa-solid fa-heart-circle-xmark" /></Button>
            </Card.Body>
        </Card>
    )
}