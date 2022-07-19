import { UserContext } from "../Context/UserContext"
import { useContext } from "react"

export default function MyAccount({ logout }) {

    const { loggedInUser, favorites } = useContext(UserContext)


    return (
        <div>
            <h1>{loggedInUser}</h1>
            <button className="w-100 py-2 mb-2 btn btn-primary rounded-3" onClick={() => logout()}>LOGOUT</button>
            <h2>Favorites:</h2>
            {favorites.map((fav) => {
                return (<h1> {fav.name}</h1>)
            })}

        </div >
    )
}