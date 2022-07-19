export default function Input({ onChange, value, type, placeholder, label, disabled, autocomplete }) {

    return (
        <div class="form-floating mb-3">
            <input onChange={onChange} value={value} type={type} class="form-control rounded-3" id="floatingInput" placeholder={placeholder} disabled={disabled} autoComplete={autocomplete} />
            <label for="floatingInput">{label}</label>
        </div>
    )
}