import { useContext } from "react"
import { UserContext } from "../Context/UserContext"
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button'

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
        <ListGroup.Item>
            <div className="d-flex w-100 justify-content-between">
                <small className="text-muted">{author}</small>
            </div>
            <small className="text-muted comment-rating">{showStars()}</small>
            <p className="mb-1">{body}</p>
            <small className="text-muted">{date}</small>
            {loggedInUser === author ?
                <Button size='sm' variant='outline' className='delete-comment' onClick={() => { deleteComment(stationID, commentID) }}><i class="fa-solid fa-trash"></i></Button>
                : null}
        </ListGroup.Item>
    )
}