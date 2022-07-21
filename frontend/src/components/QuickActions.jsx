import { useState, useContext } from "react"
import AddComment from "./AddComment"
import CommentsList from "./CommentsList"
import { UserContext } from "../Context/UserContext"
import Button from 'react-bootstrap/Button'
import Offcanvas from 'react-bootstrap/Offcanvas';

export default function QuickActions(props) {

    const [needUpdate, setNeedUpdate] = useState(true)
    const { loggedInUser } = useContext(UserContext)
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div>
            <div className="d-grid gap-2">
                <Button variant="outline-primary" onClick={handleShow}>Comments and Ratings</Button>
            </div>

            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{props.stationName}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <span>Tell others about your experience at {props.stationName}!</span>
                    {!loggedInUser ? <h1>Sign in to post a comment!</h1> :
                        <AddComment
                            stationID={props.id}
                            stationName={props.stationName}
                            needUpdate={needUpdate}
                            setNeedUpdate={setNeedUpdate} />}
                    <CommentsList
                        stationID={props.id}
                        needUpdate={needUpdate}
                        setNeedUpdate={setNeedUpdate}
                    />
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    )
}
