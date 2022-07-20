import { useEffect } from "react";
import { useState } from "react";

export default function UpdatedSignUp({ username, setUsername, password, setPassword, createAccount }) {
    //username and password requirements
    const user_regex = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/; //start with lower or upper, followed by 3-23 lower, upper, digit, hyphen, underscore

    //strong strength must contain at least 8 characters, including one upper case, one number and one special character
    var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

    //medium strength must contain at least 6 characters, including one number
    var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

    //states
    const [verifyPass, setVerifyPass] = useState('')
    const [passRating, setPassRating] = useState('Weak')
    const [nameRule, setNameRule] = useState(false)
    const [allowSubmit, setAllowSubmit] = useState(true)

    useEffect(() => {
        setNameRule(user_regex.test(username))
    }, [username])

    useEffect(() => {
        checkStrength()
        setAllowSubmit((password !== '') && (verifyPass !== '') && (password === verifyPass) && (passRating === 'medium' || passRating === 'strong'))
    }, [password, verifyPass])

    const checkStrength = () => {
        if (strongRegex.test(password)) {
            setPassRating('strong')
        } else if (mediumRegex.test(password)) {
            setPassRating('medium')
        } else setPassRating('weak')
    }


    return (
        <div>
            <div class="form-floating mb-3">
                <input
                    autoComplete="off"
                    type="text"
                    class="form-control"
                    id="floatingInput"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label for="floatingInput">Username</label>
            </div>

            {!username ? null : nameRule ? <h5>Meets Criteria!</h5> : <h5>Doesn't meet criteria...</h5>}

            <br />

            <div class="form-floating mb-3">
                <input
                    autoComplete="off"
                    type="password"
                    class="form-control"
                    id="createpassword"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <label for="createpassword">Password</label>
            </div>

            {!password ? null : <h5>Password Strength is <span className={passRating}>{passRating}</span></h5>}
            {passRating === 'weak' ? <span>Must be 'medium' or better to continue</span> : null}

            <br />

            <div class="form-floating mb-3">
                <input
                    autoComplete="off"
                    type="password"
                    class="form-control"
                    id="verifypassword"
                    placeholder="verify password"
                    value={verifyPass}
                    onChange={(e) => setVerifyPass(e.target.value)}
                />
                <label for="verifypassword">Verify Password</label>
            </div>
            {!verifyPass ? null : allowSubmit ? <h5>Passwords Match!</h5> : <h5>Passwords dont match!</h5>
            }
            <button class="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit" disabled={!allowSubmit} onClick={createAccount}>Sign up</button>
        </div>
    )
}