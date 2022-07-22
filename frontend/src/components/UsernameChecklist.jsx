export default function UsernameChecklist({ username }) {

    const startWithLetter = /^[a-zA-Z]/
    const hasNumber = /[0-9]/

    return (
        <section className="checker">
            <small>{startWithLetter.test(username) ? <i class="fa-solid fa-check"></i> : <i class="fa-solid fa-x"></i>} Start with lower or uppercase letter</small><br />
            <small>{username.length > 3 ? <i class="fa-solid fa-check"></i> : <i class="fa-solid fa-x"></i>} At least four characters long</small><br />
            <small>{hasNumber.test(username) ? <i class="fa-solid fa-check"></i> : <i class="fa-solid fa-x"></i>} Contain a number (optional)</small><br />
        </section>
    )
}