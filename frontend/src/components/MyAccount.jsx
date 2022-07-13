import { UserContext } from "../Context/UserContext"
import { useContext } from "react"
import axios from "axios"

export default function MyAccount({ logout }) {

    const { userName, setUserName } = useContext(UserContext)


    const showFavorites = async () => {
        const favs = axios.get('favorites')
    }

    return (
        <div>
            <h1>{userName}</h1>
            <button className="w-100 py-2 mb-2 btn btn-primary rounded-3" onClick={() => logout()}>LOGOUT</button>
            <button className="w-100 py-2 mb-2 btn btn-primary rounded-3" onClick={() => showFavorites()}>Show Favorites</button>
        </div>
    )
}