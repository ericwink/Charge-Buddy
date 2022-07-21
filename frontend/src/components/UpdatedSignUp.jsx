import { useEffect } from "react";
import { useState } from "react";
import PasswordBar from "./PasswordBar";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


export default function UpdatedSignUp({ username, setUsername, password, setPassword, createAccount }) {
    //username and password requirements
    const user_regex = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/; //start with lower or upper, followed by 3-23 lower, upper, digit, hyphen, underscore

    //strong strength must contain at least 8 characters, including one upper case, one number and one special character
    var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

    //medium strength must contain at least 6 characters, including one number
    var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

    //states
    const [verifyPass, setVerifyPass] = useState('')
    const [passRating, setPassRating] = useState('danger')
    const [nameRule, setNameRule] = useState(false)
    const [allowSubmit, setAllowSubmit] = useState(true)
    const [passPerc, setPassPerc] = useState(33)

    useEffect(() => {
        setNameRule(user_regex.test(username))
    }, [username])

    useEffect(() => {
        checkStrength()
        setAllowSubmit((password !== '') && (verifyPass !== '') && (password === verifyPass) && (passPerc === 66 || passPerc === 100))
    }, [password, verifyPass])

    const checkStrength = () => {
        if (!password) { setPassPerc(0) }
        else if (strongRegex.test(password)) {
            setPassRating('success')
            setPassPerc(100)
        } else if (mediumRegex.test(password)) {
            setPassRating('caution')
            setPassPerc(66)
        } else {
            setPassRating('danger')
            setPassPerc(33)
        }
    }


    return (
        <Form onSubmit={createAccount}>
            <FloatingLabel controlId="floatingUsername" label="Username" className='mb-3'>
                <Form.Control
                    type='text'
                    autoComplete='off'
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </FloatingLabel>

            {!username ? null : nameRule ? <h5>Meets Criteria!</h5> : <h5>Doesn't meet criteria...</h5>}

            <br />

            <FloatingLabel controlId="floatingPassword" label="Password" className='mb-3'>
                <Form.Control
                    type='password'
                    autoComplete='off'
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </FloatingLabel>

            <PasswordBar status={passPerc} variant={passRating} />

            <br />

            <FloatingLabel controlId="floatingPassword2" label="Verify Password" className='mb-3'>
                <Form.Control
                    type='password'
                    autoComplete='off'
                    placeholder="verify password"
                    value={verifyPass}
                    onChange={(e) => setVerifyPass(e.target.value)}
                />
            </FloatingLabel>

            {
                !verifyPass ? null : allowSubmit ? <h5>Passwords Match!</h5> : <h5>Passwords dont match!</h5>
            }
            <div className="d-grid gap-2">
                <Button variant="primary" size='lg' type='submit' disabled={!allowSubmit}>Sign up</Button>
            </div>
        </Form>
    )
}