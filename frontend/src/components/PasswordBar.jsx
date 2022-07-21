import ProgressBar from 'react-bootstrap/ProgressBar';

export default function PasswordBar({ status, variant }) {

    return (
        <ProgressBar now={status} variant={variant} />
    )
}