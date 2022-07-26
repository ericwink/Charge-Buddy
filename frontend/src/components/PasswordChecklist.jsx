export default function PasswordChecklist({ password }) {

    const hasSpecial = /[!@#$%^&*]/
    const hasNumber = /[0-9]/
    const hasCapital = /[A-Z]/

    return (
        <section className="checker">

            <small>Required:</small><br />
            <small>{password.length >= 6 ? <i class="fa-solid fa-check"></i> : <i class="fa-solid fa-x"></i>} 6 characters long</small><br />
            <small>{hasNumber.test(password) ? <i class="fa-solid fa-check"></i> : <i class="fa-solid fa-x"></i>} Contains a number</small><br /><br />
            <small>For a stronger password, recommended to use...</small><br />
            <small>{password.length >= 8 ? <i class="fa-solid fa-check"></i> : <i class="fa-solid fa-x"></i>} (Optional) 8 characters long</small><br />
            <small>{hasSpecial.test(password) ? <i class="fa-solid fa-check"></i> : <i class="fa-solid fa-x"></i>} (Optional) Contains one of... !@#$%^&*</small><br />
            <small>{hasCapital.test(password) ? <i class="fa-solid fa-check"></i> : <i class="fa-solid fa-x"></i>} (Optional) Has a capital letter</small>
        </section>
    )
}