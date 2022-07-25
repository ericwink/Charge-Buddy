import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

export default function SignIn({ login, username, password, setUsername, setPassword, loadingUser }) {

    return (
        <div>
            <form className='dropshadow' onSubmit={login}>

                <FloatingLabel controlId="floatingUsername" label="Username" className='mb-3'>
                    <Form.Control
                        type='text'
                        autoComplete='off'
                        placeholder="Username"
                        value={username}
                        onChange={(e) => { setUsername(e.target.value) }}
                    />
                </FloatingLabel>

                <FloatingLabel controlId="floatingUsername" label='Password' className='mb-3'>
                    <Form.Control
                        type='password'
                        autoComplete='off'
                        placeholder="Password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                    />
                </FloatingLabel>

                <div className="d-grid gap-2">
                    <Button variant="primary" size='lg' disabled={loadingUser} type='submit'>
                        {!loadingUser ? 'Sign in' :
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        }
                    </Button>
                </div>

            </form>
        </div>
    )
}