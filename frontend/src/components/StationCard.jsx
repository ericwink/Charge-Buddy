import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../Context/UserContext";
import QuickActions from "./QuickActions"

export default function StationCard({ stationInfo }) {

    const { userName } = useContext(UserContext)

    const phaseOne = [stationInfo.street_address, stationInfo.city, stationInfo.state, stationInfo.zipCode].filter(Boolean).join("+");
    const phaseTwo = phaseOne.replace(/\s/g, '+')
    const directions = `https://www.google.com/maps/dir//${phaseTwo}/@${stationInfo.latitude},${stationInfo.longitude}z`
    const phone = `tel:${stationInfo.station_phone}`

    const addToFavorites = async () => {
        try {
            const response = await axios.post('/addfavorite', {
                evID: stationInfo.id,
                userName: userName
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{stationInfo.station_name}</h5>
                    <small className="card-subtitle mb-2 text-muted">Access: {stationInfo.access_code}</small>
                    {userName ? <button onClick={() => addToFavorites()}>Add Favorite</button> : null}
                </div>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">{stationInfo.street_address}<br />{stationInfo.city} {stationInfo.state} {stationInfo.zip}</li>
                    <li className="list-group-item"><i class="fa-solid fa-battery-half fa-xl"></i>  EV Network: {stationInfo.ev_network}</li>
                    <li className="list-group-item"><i class="fa-regular fa-clock fa-xl"></i>  {stationInfo.access_days_time}</li>
                    <li className="list-group-item"><a className="card-link" href={directions}><i class="fa-solid fa-car fa-xl"></i>  Directions</a></li>
                    <li className="list-group-item"><a className="card-link" href={phone}><i class="fa-solid fa-phone fa-xl"></i> {stationInfo.station_phone}</a></li>
                </ul>
            </div>
            <QuickActions id={stationInfo.id} stationName={stationInfo.station_name} />
        </div>
    )
}