import { useContext } from "react"
import { UserContext } from "../Context/UserContext"
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button'
import EditComment from "./EditComment";

export default function EVComment({ stationID, body, date, commentID, deleteComment, editComment, rating, author }) {

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
        <ListGroup.Item className='dropshadow'>
            <div className="d-flex w-100 justify-content-between">
                <small className="text-muted">{author}</small>
            </div>
            <small className="text-muted comment-rating">{showStars()}</small>
            <p className="mb-1">{body}</p>
            <small className="text-muted">{date}</small>
            {loggedInUser === author ?
                <section className="adjustComment">
                    <EditComment
                        comment={body}
                        rating={rating}
                        stationID={stationID}
                        commentID={commentID}
                        editComment={editComment}
                    />
                    <Button size='sm' variant='outline' onClick={() => { deleteComment(stationID, commentID) }}><i class="fa-solid fa-trash"></i></Button>
                </section>
                : null}
        </ListGroup.Item>
    )
}