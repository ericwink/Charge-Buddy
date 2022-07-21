import { Alert } from "react-bootstrap"

export default function DisplayAlert({ msg, variant, showAlert, setShowAlert }) {

    return (
        <div>        {
            !showAlert ? null :
                <Alert variant={variant} onClose={() => setShowAlert(false)} dismissible>
                    {msg}
                </Alert>
        }</div>
    )
}