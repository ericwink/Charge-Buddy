import axios from '../config/axios'
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../Context/UserContext"
import MyAccount from "./MyAccount"
import SignIn from "./SignIn"
import UpdatedSignUp from "./UpdatedSignUp"
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import DisplayAlert from "./DisplayAlert"

export default function AccountHandle({ updateFuelStations, panToUserLocation }) {

    const [displayState, setDisplayState] = useState('Sign In')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { loggedInUser, setloggedInUser, favorites, setFavorites, clickFav } = useContext(UserContext)
    const [loadingUser, setLoadingUser] = useState(false)
    const [successSignUp, setSuccessSignUp] = useState(false)
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
        setUsername('')
        setPassword('')
    }, [displayState, successSignUp])

    //handle user switching from 'create account' to 'sign in'
    const handleSwitch = () => {
        displayState === 'Sign In' ? setDisplayState('Create Account') : setDisplayState('Sign In')
        setSuccessSignUp(false)
    }

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
            setShowAlert(true)
            setVariant('success')
            setMsg(response.data.message)
            setSuccessSignUp(true)
            setDisplayState('Sign In')
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
                <i class="fa-solid fa-user"></i></Button>

            <Offcanvas placement='end' show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{loggedInUser ? 'My Account' : displayState}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>

                    <DisplayAlert
                        msg={msg}
                        variant={variant}
                        showAlert={showAlert}
                        setShowAlert={setShowAlert}
                    />

                    {loggedInUser ?
                        <MyAccount
                            updateFuelStations={updateFuelStations}
                            panToUserLocation={panToUserLocation}
                            logout={logout}
                            setMsg={setMsg}
                            setVariant={setVariant}
                            showAlert={showAlert}
                            setShowAlert={setShowAlert}
                            handleClose={handleClose}
                        /> :

                        displayState === 'Create Account' && !successSignUp ?
                            <div>
                                <UpdatedSignUp
                                    createAccount={createAccount}
                                    username={username}
                                    setUsername={setUsername}
                                    password={password}
                                    setPassword={setPassword}
                                    successSignUp={successSignUp}
                                />
                                <hr class="my-4" />
                                <div className="d-grid gap-2">
                                    <Button variant="outline" onClick={handleSwitch}>Already have an account?</Button>
                                </div>
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
                                    <Button variant="outline" onClick={handleSwitch}>Need to create an account?</Button>
                                </div>
                            </div>
                    }
                </Offcanvas.Body>
            </Offcanvas>
        </div >
    )
}