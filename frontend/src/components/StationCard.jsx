import axios from '../config/axios'
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../Context/UserContext";
import QuickActions from "./QuickActions"
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup';

export default function StationCard({ stationInfo }) {

    const { loggedInUser, clickFav, setClickFav, favorites } = useContext(UserContext)
    const [isFav, setIsFav] = useState(false)
    const [foundID, setFoundID] = useState('')

    const phaseOne = [stationInfo.street_address, stationInfo.city, stationInfo.state, stationInfo.zipCode].filter(Boolean).join("+");
    const phaseTwo = phaseOne.replace(/\s/g, '+')
    const directions = `https://www.google.com/maps/dir//${phaseTwo}/@${stationInfo.latitude},${stationInfo.longitude}z`
    const phone = `tel:${stationInfo.station_phone}`

    useEffect(() => {
        findFav()
    }, [favorites, stationInfo])

    function findFav() {
        let found = favorites.find(obj => obj.evID === stationInfo.id)
        if (found) {
            setIsFav(true)
            setFoundID(found.id)
        } else {
            setIsFav(false)
        }
    }

    const addToFavorites = async () => {
        if (!loggedInUser) return alert('Sign in to save favorites!')
        try {
            const response = await axios.post('/user/favorites', {
                evID: stationInfo.id,
                stationName: stationInfo.station_name,
            })
            setClickFav(!clickFav)
        } catch (error) {
            console.log(error)
        }
    }

    const removeFavorite = async () => {
        if (!loggedInUser) return alert('Sign in to remove favorites!')
        try {
            const data = await axios.delete('/user/favorites', {
                data: {
                    favID: foundID,
                }
            })
            setClickFav(!clickFav)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <section>
            <Card>
                <Card.Body>
                    <Card.Title>{stationInfo.station_name}</Card.Title>
                    <Card.Subtitle className='d-flex justify-content-between'><small className="text-muted mt-2">Access: {stationInfo.access_code}</small>
                        {!isFav ?
                            <a className='notfavorite' onClick={addToFavorites}><i class='fa-regular fa-heart'></i></a> :
                            <a className='favorite' onClick={removeFavorite}><i class='fa-solid fa-heart'></i></a>
                        }
                    </Card.Subtitle>


                    <ListGroup>
                        <ListGroup.Item>{stationInfo.street_address}<br />{stationInfo.city} {stationInfo.state} {stationInfo.zip}</ListGroup.Item>
                        <ListGroup.Item><i class="fa-solid fa-battery-half fa-xl"></i>  EV Network: {stationInfo.ev_network}</ListGroup.Item>
                        <ListGroup.Item><i class="fa-regular fa-clock fa-xl"></i>  {stationInfo.access_days_time}</ListGroup.Item>
                        <ListGroup.Item><a className="card-link" href={directions}><i class="fa-solid fa-car fa-xl"></i>  Directions</a></ListGroup.Item>
                        <ListGroup.Item><a className="card-link" href={phone}><i class="fa-solid fa-phone fa-xl"></i> {stationInfo.station_phone}</a></ListGroup.Item>
                    </ListGroup>
                </Card.Body>
            </Card>
            <QuickActions id={stationInfo.id} stationName={stationInfo.station_name} />
        </section>
    )
}