import { UserContext } from "../Context/UserContext"
import { useContext } from "react"
import FavoriteCard from "./FavoriteCard"
import Button from 'react-bootstrap/Button'

export default function MyAccount({ logout, updateFuelStations, panToUserLocation, setMsg, setVariant, setShowAlert }) {


    const { loggedInUser, favorites } = useContext(UserContext)

    return (
        <div>
            <h2>Welcome, {loggedInUser}!</h2>
            <div className="d-grid gap-2">
                <Button variant="primary" onClick={() => logout()}>LOGOUT</Button>
            </div><br />
            <h2>Favorites:</h2>
            {favorites.map((fav, index) => {
                return (
                    <FavoriteCard
                        key={index}
                        updateFuelStations={updateFuelStations}
                        panToUserLocation={panToUserLocation}
                        name={fav.name}
                        favID={fav.id}
                        evID={fav.evID}
                        setMsg={setMsg}
                        setVariant={setVariant}
                        setShowAlert={setShowAlert}
                    />
                )
            })}

        </div >
    )
}