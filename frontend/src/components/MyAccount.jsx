import { UserContext } from "../Context/UserContext"
import { useContext } from "react"
import FavoriteCard from "./FavoriteCard"
import Button from 'react-bootstrap/Button'

export default function MyAccount({ logout }) {

    const { loggedInUser, favorites } = useContext(UserContext)
    console.log(favorites)


    return (
        <div>
            <h1>{loggedInUser}</h1>
            <div className="d-grid gap-2">
                <Button variant="primary" onClick={() => logout()}>LOGOUT</Button>
            </div>
            <h2>Favorites:</h2>
            {favorites.map((fav, index) => {
                return (
                    <FavoriteCard name={fav.name} key={index} evID={fav.evID} />
                )
            })}

        </div >
    )
}