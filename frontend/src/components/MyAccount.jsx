import { UserContext } from "../Context/UserContext"
import { useContext } from "react"
import FavoriteCard from "./FavoriteCard"
import Button from 'react-bootstrap/Button'

export default function MyAccount({ logout, updateFuelStations, panToUserLocation }) {

    const { loggedInUser, favorites } = useContext(UserContext)

    return (
        <div>
            <h1>{loggedInUser}</h1>
            <div className="d-grid gap-2">
                <Button variant="primary" onClick={() => logout()}>LOGOUT</Button>
            </div>
            <h2>Favorites:</h2>
            {favorites.map((fav, index) => {
                return (
                    <FavoriteCard
                        key={index}
                        updateFuelStations={updateFuelStations}
                        panToUserLocation={panToUserLocation}
                        name={fav.name}
                        favID={fav.id}
                        evID={fav.evID} />
                )
            })}

        </div >
    )
}