import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import { UserContext } from "../Context/UserContext";
import { useContext } from 'react';

export default function FavoriteCard({ name, favID, evID, updateFuelStations, panToUserLocation }) {

    const { clickFav, setClickFav, } = useContext(UserContext)

    const removeFavorite = async () => {
        try {
            const data = await axios.delete('/user/favorites', {
                data: {
                    favID: favID,
                }
            })
            setClickFav(!clickFav)
        } catch (error) {
            console.log(error)
        }
    }

    const callStationByID = async () => {
        const fullLink = `https://developer.nrel.gov/api/alt-fuel-stations/v1/${evID}.json?api_key=${process.env.REACT_APP_EV_API_KEY}`
        const data = await axios.get(fullLink)
        updateFuelStations([data.data.alt_fuel_station])
        panToUserLocation(data.data.alt_fuel_station.latitude, data.data.alt_fuel_station.longitude)
    }

    return (
        <Card className='mb-2'>
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Button onClick={callStationByID} variant='outline'><i class="fa-solid fa-map-location-dot" /></Button>
                <Button onClick={removeFavorite} variant='outline'><i class="fa-solid fa-heart-circle-xmark" /></Button>
            </Card.Body>
        </Card>
    )
}