import Input from "./Input"

export default function SignIn({ login, username, password, setUsername, setPassword, loadingUser }) {

    return (
        <div>
            <form onSubmit={login}>
                <Input
                    onChange={(e) => { setUsername(e.target.value) }}
                    value={username}
                    type='text'
                    placeholder="username"
                    label='username'
                    disabled={false}
                />
                <Input
                    onChange={(e) => { setPassword(e.target.value) }}
                    value={password}
                    type='password'
                    placeholder="Password"
                    label='Password'
                    disabled={false}
                />

                <button class="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit" disabled={loadingUser}>
                    {!loadingUser ? 'Sign in' :
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    }

                </button>
            </form>
            <hr class="my-4" />
            <h2 class="fs-5 fw-bold mb-3">Or use a third-party</h2>
            <button class="w-100 py-2 mb-2 btn btn-outline-dark rounded-3" type="submit">
                Sign in with Twitter
            </button>
            <button class="w-100 py-2 mb-2 btn btn-outline-primary rounded-3" type="submit">
                Sign in with Facebook
            </button>
            <button class="w-100 py-2 mb-2 btn btn-outline-secondary rounded-3" type="submit">
                Sign in with GitHub
            </button>
        </div>
    )
}