import axios from "axios"
import { useContext, useState } from "react";
import { UserContext } from "../Context/UserContext";
import StationRating from "./StationRating";

export default function AddComment({ stationName, stationID, needUpdate, setNeedUpdate }) {

    const [comment, setComment] = useState('')
    const [rating, setRating] = useState(0)
    const [checked, setChecked] = useState({ star5: false, star4: false, star3: false, star2: false, star1: false })
    const { loggedInUser } = useContext(UserContext)

    //tracks the value of the input text field to write a comment
    function commentChange(e) {
        setComment(e.target.value)
    }

    // send comment data to the server to save
    async function sendComment() {
        try {
            await axios.post(`${stationID}`, {
                stationID: stationID,
                stationName: stationName,
                comment: comment,
                rating: rating,
                author: loggedInUser
            })
            setChecked({ 5: false, 4: false, 3: false, 2: false, 1: false })
            setNeedUpdate(!needUpdate)
        } catch (error) {
            console.log(error)
        }
    }

    //show the user that the comment is added to the list on the card
    function addItem() {
        if (comment !== '' && rating > 0) {
            sendComment()
            setComment('')
            setRating(0)
        } else {
            alert('Set comment and rating to submit!')
        }
    }

    function changeRadio(e) {
        setChecked(() => {
            return {
                star5: false,
                star4: false,
                star3: false,
                star2: false,
                star1: false,
                [e.target.id]: true
            }
        })
    }

    return (
        <div>
            <StationRating setRating={setRating} changeRadio={changeRadio} checked={checked} />
            <div className="input-group">
                <button onClick={addItem} className="input-group-text btn btn-success btn-sm">Add<br />Comment</button>
                <textarea onChange={commentChange} className="form-control" value={comment} aria-label="Add Comment"></textarea>
            </div>
        </div>
    )
}