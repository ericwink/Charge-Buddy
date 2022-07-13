import Input from "./Input"

export default function SignUp({ createAccount, email, password, setemail, setPassword }) {

    return (
        <div>
            <form onSubmit={createAccount}>
                <p>Create an account with an email and password to get started!</p>
                <Input
                    onChange={(e) => { setemail(e.target.value) }}
                    value={email}
                    type='email'
                    placeholder="email address"
                    label='email address'
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
                <button class="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit">Sign up</button>
            </form>
            <small class="text-muted">By clicking Sign up, you agree to the terms of use.</small>
            <hr class="my-4" />
            <h2 class="fs-5 fw-bold mb-3">Or use a third-party</h2>
            <button class="w-100 py-2 mb-2 btn btn-outline-dark rounded-3" type="submit">
                Sign up with Twitter
            </button>
            <button class="w-100 py-2 mb-2 btn btn-outline-primary rounded-3" type="submit">
                Sign up with Facebook
            </button>
            <button class="w-100 py-2 mb-2 btn btn-outline-secondary rounded-3" type="submit">
                Sign up with GitHub
            </button>
        </div>
    )
}