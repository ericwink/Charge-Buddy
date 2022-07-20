import { useContext } from "react"
import { UserContext } from "../Context/UserContext"

export default function EVComment({ stationID, body, date, commentID, deleteComment, rating, author }) {

    const { loggedInUser } = useContext(UserContext)

    function showStars() {
        let repeat = ''
        for (let i = 5; i > rating; i--) {
            repeat += '☆'
        }
        for (let i = 0; i < rating; i++) {
            repeat += '★'
        }
        return repeat
    }

    return (
        <div>
            <a className="list-group-item list-group-item-action">
                <div className="d-flex w-100 justify-content-between">
                    <small className="text-muted">{author}</small>
                </div>
                <small className="text-muted comment-rating">{showStars()}</small>
                <p className="mb-1">{body}</p>
                <small className="text-muted">{date}</small>
                {loggedInUser === author ?
                    <button className="btn btn-sm delete-comment" onClick={() => { deleteComment(stationID, commentID) }}><i class="fa-solid fa-trash"></i></button>
                    : null}
            </a>
        </div>
    )
}