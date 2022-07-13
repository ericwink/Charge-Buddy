import { useState, useContext } from "react"
import AddComment from "./AddComment"
import CommentsList from "./CommentsList"
import { UserContext } from "../Context/UserContext"

export default function QuickActions(props) {

    const [needUpdate, setNeedUpdate] = useState(true)
    const { userName } = useContext(UserContext)

    return (
        <div>

            <button className="w-100 py-2 mb-2 btn btn-outline-primary rounded-3" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                View Comments and Rating
            </button>
            <div className="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasExampleLabel">Comments and Rating</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    {!userName ? <h1>Sign in to post a comment!</h1> :
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
                </div>
            </div>
        </div>
    )
}
