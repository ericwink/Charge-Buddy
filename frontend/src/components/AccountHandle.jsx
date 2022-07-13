import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../Context/UserContext"
import MyAccount from "./MyAccount"
import SignIn from "./SignIn"
import SignUp from "./SignUp"

export default function AccountHandle() {

    // axios.defaults.withCredentials = true

    const [displayState, setDisplayState] = useState('Sign In')
    const [email, setemail] = useState('')
    const [password, setPassword] = useState('')
    const { userName, setUserName, favorites, setFavorites, clickFav } = useContext(UserContext)

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
        console.log(response)
        setUserName(response.data.user)
        setFavorites([...response.data.favorites])
    }

    // send user form data to the server to create an account
    async function createAccount(e) {
        e.preventDefault();
        try {
            const response = await axios.post(`/signup`, {
                email: email,
                password: password
            })
            setemail('')
            setPassword('')
            console.log(response)
            alertErr(response.data.message, 'success')
        } catch (error) {
            alertErr(error.response.data.message, 'danger')
        }
    }

    // send user form data to the server to login
    async function login(e) {
        e.preventDefault();
        try {
            const response = await axios.post(`/login`, {
                email: email,
                password: password
            })
            setemail('')
            setPassword('')
            alertErr(response.data.message, 'success')
            checkAccount()
        } catch (error) {
            alertErr(error.response.data.message, 'danger')
            console.log(error)
        }
    }

    //logout the current user
    async function logout() {
        try {
            const response = await axios.get('/logout')
            alertErr(response.data.message, 'success')
            setUserName(null)
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

                    {userName ? <MyAccount logout={logout} /> :

                        displayState === 'Create' ? <div><SignUp
                            createAccount={createAccount}
                            email={email}
                            password={password}
                            setemail={setemail}
                            setPassword={setPassword}
                        />
                            <hr class="my-4" />
                            <button className="w-100 py-2 mb-2 btn btn-outline rounded-3" onClick={() => { setDisplayState('Sign In') }}>Already have an account?</button>
                        </div>

                            : <div><SignIn
                                login={login}
                                email={email}
                                password={password}
                                setemail={setemail}
                                setPassword={setPassword}
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