import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../Context/UserContext"
import MyAccount from "./MyAccount"
import SignIn from "./SignIn"
import UpdatedSignUp from "./UpdatedSignUp"
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import DisplayAlert from "./DisplayAlert"

export default function AccountHandle() {

    // axios.defaults.withCredentials = true

    const [displayState, setDisplayState] = useState('Sign In')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { loggedInUser, setloggedInUser, favorites, setFavorites, clickFav } = useContext(UserContext)
    const [loadingUser, setLoadingUser] = useState(false)
    const [showAlert, setShowAlert] = useState(false);
    const [msg, setMsg] = useState('')
    const [variant, setVariant] = useState('')
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        checkAccount()
    }, [])

    useEffect(() => {
        checkAccount()
    }, [clickFav])

    useEffect(() => {
        setShowAlert(false)
    }, [username, password])

    //check that a user is signed in
    const checkAccount = async () => {
        const response = await axios.get('/user/checkaccount', { withCredentials: true })
        setloggedInUser(response.data.user)
        setFavorites([...response.data.favorites])
        setLoadingUser(false)
    }

    // send user form data to the server to create an account
    async function createAccount(e) {
        e.preventDefault();
        try {
            const response = await axios.post(`/user/signup`, {
                username: username,
                password: password
            })
            setUsername('')
            setPassword('')
            setShowAlert(true)
            setVariant('success')
            setMsg(response.data.message)
        } catch (error) {
            setShowAlert(true)
            setVariant('danger')
            setMsg(error.response.data.message)
        }
    }

    // send user form data to the server to login
    async function login(e) {
        e.preventDefault();
        try {
            setLoadingUser(true)
            const response = await axios.post(`/user/login`, {
                username: username,
                password: password
            })
            setloggedInUser(response.data.user)
            setFavorites([...response.data.favorites])
            setLoadingUser(false)
            setUsername('')
            setPassword('')
        } catch (error) {
            setLoadingUser(false)
            setShowAlert(true)
            setVariant('danger')
            setMsg(error.response.data.message)
        }
    }

    //logout the current user
    async function logout() {
        try {
            const response = await axios.get('/user/logout')
            setShowAlert(true)
            setVariant('success')
            setMsg(response.data.message)
            setloggedInUser(null)
            setFavorites(null)
        } catch (error) {
            setShowAlert(true)
            setVariant('danger')
            setMsg(error.response.data.message)
        }
    }

    return (

        <div className="AccountHandle">

            <Button variant="primary" onClick={handleShow}>
                My Account
            </Button>

            <Offcanvas placement='end' show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{displayState}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>

                    <DisplayAlert
                        msg={msg}
                        variant={variant}
                        showAlert={showAlert}
                        setShowAlert={setShowAlert}
                    />

                    {loggedInUser ? <MyAccount logout={logout} /> :

                        displayState === 'Create' ?
                            <div>
                                <UpdatedSignUp
                                    createAccount={createAccount}
                                    username={username}
                                    setUsername={setUsername}
                                    password={password}
                                    setPassword={setPassword}
                                />
                                <hr class="my-4" />
                                <button className="w-100 py-2 mb-2 btn btn-outline rounded-3" onClick={() => { setDisplayState('Sign In') }}>Already have an account?</button>
                            </div>
                            :
                            <div>
                                <SignIn
                                    login={login}
                                    username={username}
                                    password={password}
                                    setUsername={setUsername}
                                    setPassword={setPassword}
                                    loadingUser={loadingUser}
                                />
                                <hr class="my-4" />
                                <div className="d-grid gap-2">
                                    <Button variant="outline" onClick={() => { setDisplayState('Create') }}>Need to create an account?</Button>
                                </div>
                            </div>
                    }
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    )
}