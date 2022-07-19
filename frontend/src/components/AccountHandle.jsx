import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../Context/UserContext"
import MyAccount from "./MyAccount"
import SignIn from "./SignIn"
import UpdatedSignUp from "./UpdatedSignUp"

export default function AccountHandle() {

    // axios.defaults.withCredentials = true

    const [displayState, setDisplayState] = useState('Sign In')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { loggedInUser, setloggedInUser, favorites, setFavorites, clickFav } = useContext(UserContext)
    const [loadingUser, setLoadingUser] = useState(false)

    const alertPlaceholder = document.getElementById('liveAlertPlaceholder')

    const alertErr = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        alertPlaceholder.append(wrapper)
    }

    useEffect(() => {
        checkAccount()
    }, [])

    useEffect(() => {
        checkAccount()
    }, [clickFav])

    //check that a user is signed in
    const checkAccount = async () => {
        const response = await axios.get('/checkaccount', { withCredentials: true })
        setloggedInUser(response.data.user)
        setFavorites([...response.data.favorites])
        setLoadingUser(false)
    }

    // send user form data to the server to create an account
    async function createAccount(e) {
        e.preventDefault();
        try {
            const response = await axios.post(`/signup`, {
                username: username,
                password: password
            })
            setUsername('')
            setPassword('')
            alertErr(response.data.message, 'success')
        } catch (error) {
            alertErr(error.response.data.message, 'danger')
        }
    }

    // send user form data to the server to login
    async function login(e) {
        e.preventDefault();
        try {
            setLoadingUser(true)
            const response = await axios.post(`/login`, {
                username: username,
                password: password
            })
            setloggedInUser(response.data.user)
            setFavorites([...response.data.favorites])
            setLoadingUser(false)
            setUsername('')
            setPassword('')
        } catch (error) {
            alertErr(error.response.data.message, 'danger')
            console.log(error)
            setLoadingUser(false)
        }
    }

    //logout the current user
    async function logout() {
        try {
            const response = await axios.get('/logout')
            alertErr(response.data.message, 'success')
            setloggedInUser(null)
            setFavorites(null)
        } catch (error) {
            alertErr(error.response.data.message, 'danger')
            console.log(error)
        }
    }

    return (

        <div className="AccountHandle">
            <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">My Account</button>
            <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                <div class="offcanvas-header">
                    <h5 class="offcanvas-title" id="offcanvasRightLabel">{displayState}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">

                    <div id="liveAlertPlaceholder"></div>

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
                                <button className="w-100 py-2 mb-2 btn btn-outline rounded-3" onClick={() => { setDisplayState('Create') }}>Need to create an account?</button>
                            </div>
                    }

                </div>
            </div>
        </div>
    )
}