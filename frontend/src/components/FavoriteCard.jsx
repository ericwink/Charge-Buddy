import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

export default function FavoriteCard({ name }) {

    return (

        <Card className='mb-2'>
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Button variant='outline'><i class="fa-solid fa-map-location-dot" /></Button>
                <Button variant='outline'><i class="fa-solid fa-heart-circle-xmark" /></Button>
            </Card.Body>
        </Card>
    )
}