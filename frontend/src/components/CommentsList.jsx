import axios from '../config/axios'
import { useState, useEffect } from "react"
import EVComment from "./EVComment"
import ListGroup from 'react-bootstrap/ListGroup';

export default function CommentsList({ stationID, needUpdate, setNeedUpdate }) {

    const [storedComments, setStoredComments] = useState([])

    //call getComments immediately on mount
    useEffect(() => {
        getComments()
    })

    useEffect(() => {
        getComments()
    }, [needUpdate])

    //get comment from the server
    async function getComments() {
        try {
            const data = await axios.get(`/station/${stationID}`)
            let newcomments = data.data.comments
            setStoredComments(newcomments.reverse())
        } catch (error) {
            console.log(error)
        }
    }

    //delete a posted comment
    async function deleteComment(stationID, commentID) {
        try {
            const data = await axios.delete('/station/comment', {
                data: {
                    stationID: stationID,
                    commentID: commentID
                }
            })
            setNeedUpdate(!needUpdate)
        } catch (error) {
            console.log(error)
        }
    }

    //edit a posted comment
    async function editComment(stationID, commentID, comment, rating) {
        try {
            const data = await axios.patch('/station/comment', {
                data: {
                    stationID: stationID,
                    commentID: commentID,
                    comment: comment,
                    rating: rating
                }
            })
            setNeedUpdate(!needUpdate)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <ListGroup>
            {storedComments.map((comment, index) => {
                return (
                    <EVComment
                        key={index}
                        stationID={stationID}
                        body={comment.body}
                        date={comment.date}
                        commentID={comment._id}
                        rating={comment.rating}
                        deleteComment={deleteComment}
                        editComment={editComment}
                        author={comment.author.username}
                    />
                )
            })}
        </ListGroup>
    )
}