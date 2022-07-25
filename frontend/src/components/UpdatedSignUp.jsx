import { useEffect } from "react";
import { useState } from "react";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import UsernameChecklist from "./UsernameChecklist";
import PasswordChecklist from "./PasswordChecklist";

export default function UpdatedSignUp({ username, setUsername, password, setPassword, createAccount }) {
    //username and password requirements
    //start with lower or upper, followed by 3-23 lower, upper, digit, hyphen, underscore
    const user_regex = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;

    //strong strength must contain at least 8 characters, including one upper case, one number and one special character
    var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

    //medium strength must contain at least 6 characters, including one number
    var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

    //states
    const [verifyPass, setVerifyPass] = useState('')
    const [allowSubmit, setAllowSubmit] = useState(true)
    const [focus, setFocus] = useState('')

    useEffect(() => {
        setAllowSubmit((user_regex.test(username)) && (password !== '') && (verifyPass !== '') && (password === verifyPass) && (mediumRegex.test(password) || strongRegex.test(password)))
    }, [password, verifyPass, username])

    return (
        <Form className='dropshadow' onSubmit={createAccount}>
            <FloatingLabel controlId="floatingUsername" label="Username" className='mb-3'>
                <Form.Control
                    type='text'
                    autoComplete='off'
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setFocus('username')}
                />
            </FloatingLabel>

            {focus === 'username' ? <UsernameChecklist username={username} /> : null}
            <br />

            <FloatingLabel controlId="floatingPassword" label="Password" className='mb-3'>
                <Form.Control
                    type='password'
                    autoComplete='off'
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocus('password')}
                />
            </FloatingLabel>

            {focus === 'password' ? <PasswordChecklist password={password} /> : null}
            <br />

            <FloatingLabel controlId="floatingPassword2" label='Verify Password' className='mb-3'>
                <Form.Control
                    type='password'
                    autoComplete='off'
                    placeholder="verify password"
                    value={verifyPass}
                    onChange={(e) => setVerifyPass(e.target.value)}
                    onFocus={() => setFocus('verifypass')}
                />
            </FloatingLabel>

            {
                focus === 'verifypass' ? !verifyPass ? null : allowSubmit ? <div className="checker"><small><i class="fa-solid fa-check"></i> Passwords Match!</small></div> : <div className="checker"><small><i class="fa-solid fa-x"></i> Passwords dont match!</small></div> : null
            }
            <div className="d-grid gap-2">
                <Button variant="primary" size='lg' type='submit' disabled={!allowSubmit}>Create Account</Button>
            </div>
        </Form>

    )
}