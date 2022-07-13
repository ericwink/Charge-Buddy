export default function Input({ onChange, value, type, placeholder, label, disabled }) {

    return (
        <div class="form-floating mb-3">
            <input onChange={onChange} value={value} type={type} class="form-control rounded-3" id="floatingInput" placeholder={placeholder} disabled={disabled} />
            <label for="floatingInput">{label}</label>
        </div>
    )
}